<script setup lang="ts">
import type {
  Column,
  ComponentProps,
  Slots,
  Vue3ComponentEmits,
} from '@yeger/vue-masonry-wall-core'
import { defaults, useMasonryWall } from '@yeger/vue-masonry-wall-core'
import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

type T = unknown

const props = withDefaults(defineProps<ComponentProps<T>>(), defaults)

const emit = defineEmits<Vue3ComponentEmits>()

defineSlots<Slots<T>>()

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

const { getColumnWidthTarget } = useMasonryWall<T>({
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
  vue: 3,
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
