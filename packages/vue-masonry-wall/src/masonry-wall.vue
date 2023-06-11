<script setup lang="ts" generic="T">
import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    columnWidth?: number | [number, ...number[]]
    items: T[]
    gap?: number
    rtl?: boolean
    ssrColumns?: number
    scrollContainer?: HTMLElement | null
    minColumns?: number
    maxColumns?: number
    keyMapper?: (
      item: T,
      column: number,
      row: number,
      index: number
    ) => string | number | symbol | undefined
  }>(),
  {
    columnWidth: 400,
    gap: 0,
    rtl: false,
    ssrColumns: 0,
    scrollContainer: null,
    keyMapper: (_item: T, _column: number, _row: number, index: number) =>
      index,
  }
)

const emit = defineEmits<{
  (event: 'redraw'): void
  (event: 'redrawSkip'): void
}>()

defineSlots<{
  default?: (props: {
    item: T
    column: number
    row: number
    index: number
  }) => any
}>()

type Column = number[]

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

function countIteratively(
  containerWidth: number,
  gap: number,
  count: number,
  consumed: number
) {
  const nextWidth = getColumnWidthTarget(count)
  if (consumed + gap + nextWidth <= containerWidth) {
    return countIteratively(
      containerWidth,
      gap,
      count + 1,
      consumed + gap + nextWidth
    )
  }
  return count
}

function getColumnWidthTarget(columnIndex: number) {
  const widths = Array.isArray(columnWidth.value)
    ? columnWidth.value
    : [columnWidth.value]
  return widths[columnIndex % widths.length] as number
}

function columnCount(): number {
  const count = countIteratively(
    wall.value.getBoundingClientRect().width,
    gap.value,
    0,
    // Needs to be offset my negative gap to prevent gap counts being off by one
    -gap.value
  )
  const boundedCount = aboveMin(belowMax(count))
  return boundedCount > 0 ? boundedCount : 1
}

function belowMax(count: number) {
  const max = maxColumns?.value
  if (!max) {
    return count
  }
  return count > max ? max : count
}

function aboveMin(count: number) {
  const min = minColumns?.value
  if (!min) {
    return count
  }
  return count < min ? min : count
}

function createColumns(count: number): Column[] {
  return [...new Array(count)].map(() => [])
}

if (ssrColumns.value > 0) {
  const newColumns = createColumns(ssrColumns.value)
  items.value.forEach((_: T, i: number) =>
    newColumns[i % ssrColumns.value]!.push(i)
  )
  columns.value = newColumns
}

async function fillColumns(itemIndex: number) {
  if (itemIndex >= items.value.length) {
    return
  }
  await nextTick()
  const columnDivs = [...wall.value.children] as HTMLDivElement[]
  if (rtl.value) {
    columnDivs.reverse()
  }
  const target = columnDivs.reduce((prev, curr) =>
    curr.getBoundingClientRect().height < prev.getBoundingClientRect().height
      ? curr
      : prev
  )
  columns.value[+target.dataset.index!]!.push(itemIndex)
  await fillColumns(itemIndex + 1)
}

async function redraw(force = false) {
  if (columns.value.length === columnCount() && !force) {
    emit('redrawSkip')
    return
  }
  columns.value = createColumns(columnCount())
  const scrollTarget = scrollContainer?.value
  const scrollY = scrollTarget ? scrollTarget.scrollTop : window.scrollY
  await fillColumns(0)
  scrollTarget
    ? scrollTarget.scrollBy({ top: scrollY - scrollTarget.scrollTop })
    : window.scrollTo({ top: scrollY })
  emit('redraw')
}

const resizeObserver =
  typeof ResizeObserver === 'undefined'
    ? undefined
    : new ResizeObserver(() => redraw())

onMounted(() => {
  redraw()
  resizeObserver?.observe(wall.value)
})

onBeforeUnmount(() => resizeObserver?.unobserve(wall.value))

watch([items, rtl], () => redraw(true))
watch([columnWidth, gap, minColumns, maxColumns], () => redraw())
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
        height: ['-webkit-max-content', '-moz-max-content', 'max-content'] as any,
        'min-width': 0
      }"
    >
      <div
        v-for="(itemIndex, row) in column"
        :key="keyMapper(items[itemIndex]!, columnIndex, row, itemIndex)"
        class="masonry-item"
      >
        <slot
          :item="items[itemIndex]!"
          :column="columnIndex"
          :row="row"
          :index="itemIndex"
        >
          {{ items[itemIndex] }}
        </slot>
      </div>
    </div>
  </div>
</template>
