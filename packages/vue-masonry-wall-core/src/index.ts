import type {
  LifecycleHook,
  VueRef,
  VueVersion,
  Watch,
} from '@yeger/vue-lib-adapter'

export interface ComponentProps<T> {
  columnWidth?: number | NonEmptyArray<number>
  items: T[]
  gap?: number
  rtl?: boolean
  ssrColumns?: number
  scrollContainer?: HTMLElement | null
  minColumns?: number
  maxColumns?: number
  keyMapper?: KeyMapper<T>
}

export type NonEmptyArray<T> = [T, ...T[]]

export interface Column {
  items: number[]
  height: number | undefined
}

export interface Vue2ComponentEmits {
  (event: 'redraw'): void
  (event: 'redraw-skip'): void
}

export interface Vue3ComponentEmits {
  (event: 'redraw'): void
  (event: 'redrawSkip'): void
}

export type KeyMapper<T> = (
  item: T,
  column: number,
  row: number,
  index: number,
) => string | number | symbol | undefined

export interface HookProps<T> {
  columns: VueRef<Column[]>
  columnWidth: VueRef<number | NonEmptyArray<number>>
  emit: Vue2ComponentEmits | Vue3ComponentEmits
  gap: VueRef<number>
  items: VueRef<T[]>
  keyMapper: VueRef<KeyMapper<T>>
  maxColumns: VueRef<number | undefined>
  minColumns: VueRef<number | undefined>
  nextTick: () => Promise<void>
  onBeforeUnmount: LifecycleHook
  onMounted: LifecycleHook
  rtl: VueRef<boolean>
  scrollContainer: VueRef<HTMLElement | null>
  ssrColumns: VueRef<number>
  vue: VueVersion
  wall: VueRef<HTMLDivElement>
  watch: Watch
}

export function useMasonryWall<T>({
  columns,
  columnWidth,
  emit,
  gap,
  items,
  maxColumns,
  minColumns,
  nextTick,
  onBeforeUnmount,
  onMounted,
  rtl,
  scrollContainer,
  ssrColumns,
  vue,
  wall,
  watch,
  keyMapper,
}: HookProps<T>) {
  function countIteratively(
    containerWidth: number,
    gap: number,
    count: number,
    consumed: number,
  ): number {
    const nextWidth = getColumnWidthTarget(count)
    if (consumed + gap + nextWidth <= containerWidth) {
      return countIteratively(
        containerWidth,
        gap,
        count + 1,
        consumed + gap + nextWidth,
      )
    }
    return count
  }

  function getColumnWidthTarget(columnIndex: number): number {
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
      -gap.value,
    )
    const boundedCount = aboveMin(belowMax(count))
    return boundedCount > 0 ? boundedCount : 1
  }

  function belowMax(count: number): number {
    const max = maxColumns?.value
    if (!max) {
      return count
    }
    return count > max ? max : count
  }

  function aboveMin(count: number): number {
    const min = minColumns?.value
    if (!min) {
      return count
    }
    return count < min ? min : count
  }

  function createColumns(count: number): Column[] {
    return Array.from({ length: count }).map(() => ({
      items: [],
      height: undefined,
    }))
  }

  if (ssrColumns.value > 0) {
    const newColumns = createColumns(ssrColumns.value)
    items.value.forEach((_: T, i: number) =>
      newColumns[i % ssrColumns.value]!.items.push(i),
    )
    columns.value = newColumns
  }

  function getColumnDivs() {
    const columnDivs = [...wall.value.children] as HTMLDivElement[]
    if (rtl.value) {
      columnDivs.reverse()
    }
    return columnDivs
  }

  async function fillColumns(itemIndex: number) {
    const firstColumn = columns.value[0]!
    const initialItems = firstColumn.items.length
    for (let i = itemIndex; i < items.value.length; i++)
      firstColumn.items.push(i)
    await nextTick()
    const div = getColumnDivs()[0]!
    let itemHeights = []
    for (let child of div.children)
      itemHeights.push((child as HTMLElement).getBoundingClientRect().height)
    itemHeights = itemHeights.slice(initialItems)
    firstColumn.items.splice(
      initialItems,
      firstColumn.items.length - initialItems,
    )

    let heights = columns.value.map((col) => col.height!)
    for (let i = 0; i < items.value.length - itemIndex; i++) {
      let bestCol = 0
      for (let j = 1; j < columns.value.length; j++)
        if (heights[j] < heights[bestCol]) bestCol = j
      columns.value[bestCol].items.push(itemIndex + i)
      heights[bestCol] += itemHeights[i] + gap.value
    }
  }

  let previousKeys: ReturnType<KeyMapper<T>>[] = []
  async function redraw(force = false) {
    if (columns.value.length === columnCount() && !force) {
      if (vue === 2) {
        ;(emit as Vue2ComponentEmits)('redraw-skip')
      } else {
        ;(emit as Vue3ComponentEmits)('redrawSkip')
      }
      return
    }

    const newKeys = items.value.map((item, index) =>
      keyMapper.value(item, 0, 0, index),
    )
    let reuse = 0
    if (columns.value.length === columnCount()) {
      while (
        reuse < newKeys.length &&
        reuse < previousKeys.length &&
        newKeys[reuse] === previousKeys[reuse]
      ) {
        reuse++
      }
      for (let column of columns.value) {
        // Binary search for first item to remove
        let start = 0,
          end = column.items.length
        while (start < end) {
          const mid = Math.floor((start + end) / 2)
          if (column.items[mid] < reuse) start = mid + 1
          else end = mid
        }
        if (start < column.items.length) {
          column.items.splice(start, column.items.length - start)
        }
      }
    } else {
      columns.value = createColumns(columnCount())
    }
    previousKeys = newKeys

    await nextTick()
    const columnDivs = getColumnDivs()
    for (let i = 0; i < columns.value.length; i++)
      columns.value[i]!.height = columnDivs[i]!.scrollHeight

    const scrollTarget = scrollContainer?.value
    const scrollY = scrollTarget ? scrollTarget.scrollTop : window.scrollY
    await fillColumns(reuse)
    for (let column of columns.value) column.height = undefined
    await nextTick()

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

  return { getColumnWidthTarget }
}
