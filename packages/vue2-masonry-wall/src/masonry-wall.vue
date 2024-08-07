<script setup lang="ts">
import type { Column, NonEmptyArray } from '@yeger/vue-masonry-wall-core'
import { useMasonryWall } from '@yeger/vue-masonry-wall-core'
import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

export type KeyMapper<T> = (
  item: T,
  column: number,
  row: number,
  index: number,
) => string | number | symbol | undefined

const props = withDefaults(
  defineProps<{
    columnWidth?: number | NonEmptyArray<number> | undefined
    items: unknown[]
    gap?: number | undefined
    rtl?: boolean | undefined
    ssrColumns?: number | undefined
    scrollContainer?: HTMLElement | null | undefined
    minColumns?: number | undefined
    maxColumns?: number | undefined
    keyMapper?: KeyMapper<unknown> | undefined
  }>(),
  {
    columnWidth: 400,
    gap: 0,
    minColumns: 1,
    maxColumns: undefined,
    rtl: false,
    scrollContainer: null,
    ssrColumns: 0,
  },
)

const emit = defineEmits<{
  (event: 'redraw'): void
  (event: 'redraw-skip'): void
}>()

const columns = ref<Column[]>([])
const wall = ref<HTMLDivElement>() as Ref<HTMLDivElement>

const { getColumnWidthTarget } = useMasonryWall<unknown>({
  columns,
  emit,
  nextTick,
  onBeforeUnmount,
  onMounted,
  vue: 2,
  wall,
  watch,
  ...toRefs(props),
})

const heightStyle = ['-webkit-max-content', '-moz-max-content', 'max-content'] as any
</script>

<template>
  <div
    ref="wall"
    class="masonry-wall"
    :style="{ display: 'flex', gap: `${gap}px` }"
  >
    <div
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      class="masonry-column"
      :data-index="columnIndex"
      :style="{
        'display': 'flex',
        'flex-basis': `${getColumnWidthTarget(columnIndex)}px`,
        'flex-direction': 'column',
        'flex-grow': 1,
        'gap': `${gap}px`,
        'height': heightStyle,
        'min-width': 0,
      }"
    >
      <div
        v-for="(itemIndex, row) in column"
        :key="
          keyMapper?.(items[itemIndex], columnIndex, row, itemIndex)
            ?? itemIndex
        "
        class="masonry-item"
      >
        <slot :item="items[itemIndex]" :index="itemIndex">
          {{ items[itemIndex] }}
        </slot>
      </div>
    </div>
  </div>
</template>
