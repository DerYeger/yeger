<script setup lang="ts">
import type {
  Column,
  KeyMapper,
  NonEmptyArray,
} from '@yeger/vue-masonry-wall-core'
import { useMasonryWall } from '@yeger/vue-masonry-wall-core'
import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

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
  },
)

const emit = defineEmits<{
  (event: 'redraw'): void
  (event: 'redraw-skip'): void
}>()

const {
  columnWidth,
  items,
  gap,
  rtl,
  ssrColumns,
  scrollContainer,
  minColumns,
  maxColumns,
  keyMapper,
} = toRefs(props)
const columns = ref<Column[]>([])
const wall = ref<HTMLDivElement>() as Ref<HTMLDivElement>
const { getColumnWidthTarget } = useMasonryWall<unknown>({
  columns,
  columnWidth,
  emit,
  gap,
  items,
  keyMapper,
  maxColumns,
  minColumns,
  nextTick,
  onBeforeUnmount,
  onMounted,
  rtl,
  scrollContainer,
  ssrColumns,
  vue: 2,
  wall,
  watch,
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
        height: ['-webkit-max-content', '-moz-max-content', 'max-content'],
        'min-width': 0,
      }"
    >
      <div v-for="itemIndex in column" :key="itemIndex" class="masonry-item">
        <slot :item="items[itemIndex]" :index="itemIndex">
          {{ items[itemIndex] }}
        </slot>
      </div>
    </div>
  </div>
</template>
