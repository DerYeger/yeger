<script setup lang="ts" generic="T">
import { debounce } from '@yeger/debounce'
import type { VNode } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

export type NonEmptyArray<T> = [T, ...T[]]

export type Column = number[]

export type KeyMapper<T> = (
  item: T,
  column: number,
  row: number,
  index: number,
) => string | number | symbol | undefined

const {
  columnWidth = 400,
  gap = 0,
  items,
  maxColumns,
  minColumns = 1,
  rtl = false,
  scrollContainer = null,
  ssrColumns = 0,
} = defineProps<{
  columnWidth?: number | NonEmptyArray<number> | undefined
  items: T[]
  gap?: number | undefined
  rtl?: boolean | undefined
  ssrColumns?: number | undefined
  scrollContainer?: HTMLElement | null | undefined
  minColumns?: number | undefined
  maxColumns?: number | undefined
  keyMapper?: KeyMapper<T> | undefined
}>()

const emit = defineEmits<{
  (event: 'redraw'): void
  (event: 'redrawSkip'): void
}>()

defineSlots<{
  default?: (props: {
    item: T
    column: number
    columnCount: number
    row: number
    index: number
  }) => VNode | VNode[] | Element | Element[]
}>()

const columns = ref<Column[]>([])
const wall = useTemplateRef<HTMLDivElement>('wall')

function createColumns(count: number): Column[] {
  return Array.from({ length: count }).map(() => [])
}

function countIteratively(
  containerWidth: number,
  gap: number,
  count: number,
  consumed: number,
): number {
  const nextWidth = getColumnWidthTarget(count)
  if (consumed + gap + nextWidth <= containerWidth) {
    return countIteratively(containerWidth, gap, count + 1, consumed + gap + nextWidth)
  }
  return count
}

function getColumnWidthTarget(columnIndex: number): number {
  const widths = Array.isArray(columnWidth) ? columnWidth : [columnWidth]
  return widths[columnIndex % widths.length]!
}

function columnCount(): number {
  const count = countIteratively(
    wall.value!.getBoundingClientRect().width,
    gap,
    0,
    // Needs to be offset my negative gap to prevent gap counts being off by one
    -gap,
  )
  const boundedCount = aboveMin(belowMax(count))
  return boundedCount > 0 ? boundedCount : 1
}

function belowMax(count: number): number {
  if (!maxColumns) {
    return count
  }
  return Math.min(count, maxColumns)
}

function aboveMin(count: number): number {
  return Math.max(count, minColumns)
}

if (ssrColumns > 0) {
  const newColumns = createColumns(ssrColumns)
  for (let i = 0; i < items.length; i++) {
    newColumns[i % ssrColumns]!.push(i)
  }
  columns.value = newColumns
}

let currentRedrawId = 0

async function fillColumns(itemIndex: number, assignedRedrawId: number) {
  if (itemIndex >= items.length) {
    return
  }
  await nextTick()
  if (currentRedrawId !== assignedRedrawId) {
    // Skip if a new redraw has been requested in parallel,
    // e.g., in an onMounted hook during initial render
    return
  }
  const columnDivs = [...wall.value!.children] as HTMLDivElement[]
  const target = columnDivs.reduce((prev, curr) =>
    curr.getBoundingClientRect().height < prev.getBoundingClientRect().height ? curr : prev,
  )
  columns.value[+target.dataset.index!]!.push(itemIndex)
  await fillColumns(itemIndex + 1, assignedRedrawId)
}

async function redraw(force = false) {
  const newColumnCount = columnCount()
  if (columns.value.length === newColumnCount && !force) {
    emit('redrawSkip')
    return
  }
  columns.value = createColumns(newColumnCount)
  const scrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY
  await fillColumns(0, ++currentRedrawId)
  if (scrollContainer) {
    scrollContainer.scrollBy({ top: scrollY - scrollContainer.scrollTop })
  } else {
    window.scrollTo({ top: scrollY })
  }
  emit('redraw')
}

const resizeObserver =
  typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(debounce(() => redraw()))

onMounted(async () => {
  await redraw()
  resizeObserver?.observe(wall.value!)
})

onBeforeUnmount(() => resizeObserver?.unobserve(wall.value!))

watch(
  () => items,
  () => redraw(true),
)
watch([() => columnWidth, () => gap, () => minColumns, () => maxColumns], () => redraw())
</script>

<template>
  <div
    ref="wall"
    class="masonry-wall"
    :style="{ display: 'flex', gap: `${gap}px`, flexDirection: rtl ? 'row-reverse' : undefined }"
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
        height: 'max-content',
        'min-width': 0,
      }"
    >
      <div
        v-for="(itemIndex, row) in column"
        :key="keyMapper?.(items[itemIndex]!, columnIndex, row, itemIndex) ?? itemIndex"
        class="masonry-item"
      >
        <slot
          :item="items[itemIndex]!"
          :column="columnIndex"
          :column-count="columns.length"
          :row="row"
          :index="itemIndex"
        >
          {{ items[itemIndex] }}
        </slot>
      </div>
    </div>
  </div>
</template>
