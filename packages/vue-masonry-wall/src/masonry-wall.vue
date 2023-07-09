<script setup lang="ts" generic="T">
import type {
  Column,
  KeyMapper,
  NonEmptyArray,
  Vue3ComponentEmits,
} from '@yeger/vue-masonry-wall-core'
import { defaults, useMasonryWall } from '@yeger/vue-masonry-wall-core'
import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    columnWidth?: number | NonEmptyArray<number>
    items: T[]
    gap?: number
    rtl?: boolean
    ssrColumns?: number
    scrollContainer?: HTMLElement | null
    minColumns?: number
    maxColumns?: number
    keyMapper?: KeyMapper<T>
  }>(),
  defaults,
)

const emit = defineEmits<Vue3ComponentEmits>()

defineSlots<{
  default?: (props: {
    item: T
    column: number
    row: number
    index: number
  }) => any
}>()

const columns = ref<Column[]>([])
const wall = ref<HTMLDivElement>() as Ref<HTMLDivElement>

const { getColumnWidthTarget } = useMasonryWall<T>({
  columns,
  emit,
  nextTick,
  onBeforeUnmount,
  onMounted,
  vue: 3,
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
        height: [
          '-webkit-max-content',
          '-moz-max-content',
          'max-content',
        ] as any,
        'min-width': 0,
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
