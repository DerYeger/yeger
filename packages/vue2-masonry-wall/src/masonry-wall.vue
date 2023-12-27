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
    columnWidth?: number | NonEmptyArray<number>
    items: unknown[]
    gap?: number
    rtl?: boolean
    ssrColumns?: number
    scrollContainer?: HTMLElement | null
    minColumns?: number
    maxColumns?: number
    keyMapper?: KeyMapper<unknown>
    incremental?: boolean
  }>(),
  {
    columnWidth: 400,
    gap: 0,
    keyMapper: (_item: unknown, _column: number, _row: number, index: number) =>
      index,
    minColumns: 1,
    maxColumns: undefined,
    rtl: false,
    scrollContainer: null,
    ssrColumns: 0,
    incremental: false,
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
        display: 'flex',
        'flex-basis': `${getColumnWidthTarget(columnIndex)}px`,
        'flex-direction': 'column',
        'flex-grow': 1,
        gap: `${gap}px`,
        height:
          column.height === undefined
            ? ['-webkit-max-content', '-moz-max-content', 'max-content']
            : `${column.height}px`,
        'min-width': 0,
        'overflow-y': column.height === undefined ? undefined : 'hidden',
      }"
    >
      <div
        v-for="(itemIndex, row) in column.items"
        :key="keyMapper(items[itemIndex], columnIndex, row, itemIndex)"
        class="masonry-item"
      >
        <slot :item="items[itemIndex]" :index="itemIndex">
          {{ items[itemIndex] }}
        </slot>
      </div>
    </div>
  </div>
</template>
