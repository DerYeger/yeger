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

export type Column = number[]

export interface Vue2ComponentEmits {
  (event: 'redraw'): void
  (event: 'redraw-skip'): void
}

export interface Vue3ComponentEmits {
  (event: 'redraw'): void
  (event: 'redrawSkip'): void
}

export interface Slots<T> {
  default?: (props: {
    item: T
    column: number
    row: number
    index: number
  }) => any
}

export const defaults = {
  columnWidth: 400,
  gap: 0,
  keyMapper: (_item: unknown, _column: number, _row: number, index: number) =>
    index,
  minColumns: 1,
  maxColumns: undefined,
  rtl: false,
  scrollContainer: null,
  ssrColumns: 0,
} as const satisfies Partial<ComponentProps<unknown>>

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
    return [...new Array(count)].map(() => [])
  }

  if (ssrColumns.value > 0) {
    const newColumns = createColumns(ssrColumns.value)
    items.value.forEach((_: T, i: number) =>
      newColumns[i % ssrColumns.value]!.push(i),
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
        : prev,
    )
    columns.value[+target.dataset.index!]!.push(itemIndex)
    await fillColumns(itemIndex + 1)
  }

  async function redraw(force = false) {
    if (columns.value.length === columnCount() && !force) {
      if (vue === 2) {
        ;(emit as Vue2ComponentEmits)('redraw-skip')
      } else {
        ;(emit as Vue3ComponentEmits)('redrawSkip')
      }
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

  return { getColumnWidthTarget }
}
