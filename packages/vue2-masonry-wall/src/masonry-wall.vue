<script lang="ts">
import Vue from 'vue'

type Column = number[]

function createColumns(count: number): Column[] {
  return [...new Array(count)].map(() => [])
}

export default /* #__PURE__ */ Vue.extend({
  name: 'MasonryWall',
  props: {
    items: {
      type: Array as () => unknown[],
      required: true,
    },
    ssrColumns: {
      type: Number,
      default: 0,
    },
    columnWidth: {
      type: Number,
      default: 400,
    },
    gap: {
      type: Number,
      default: 0,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    if (this.ssrColumns > 0) {
      const columns = createColumns(this.ssrColumns)
      this.items.forEach((_, i) => columns[i % this.ssrColumns].push(i))
      return {
        columns,
      }
    }
    return {
      columns: [],
    }
  },
  computed: {
    wall(): HTMLDivElement {
      return this.$refs.wall as HTMLDivElement
    },
    resizeObserver(): ResizeObserver {
      return new ResizeObserver(() => this.redraw())
    },
  },
  watch: {
    items() {
      this.redraw(true)
    },
    columnWidth() {
      this.redraw()
    },
    gap() {
      this.redraw()
    },
    rtl() {
      this.redraw(true)
    },
  },
  mounted() {
    this.redraw()
    this.resizeObserver.observe(this.wall)
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    this.resizeObserver.unobserve(this.wall)
  },
  methods: {
    async redraw(force = false) {
      if (this.columns.length === this.columnCount() && !force) {
        this.$emit('redraw-skip')
        return
      }
      this.columns = createColumns(this.columnCount())
      const scrollY = window.scrollY
      await this.fillColumns(0)
      window.scrollTo({ top: scrollY })
      this.$emit('redraw')
    },
    columnCount(): number {
      const count = Math.floor(
        (this.wall.getBoundingClientRect().width + this.gap) /
          (this.columnWidth + this.gap)
      )
      return count > 0 ? count : 1
    },
    async fillColumns(itemIndex: number) {
      if (itemIndex >= this.items.length) {
        return
      }
      await this.$nextTick()
      const columnDivs = [...this.wall.children] as HTMLDivElement[]
      if (this.rtl) {
        columnDivs.reverse()
      }
      const target = columnDivs.reduce((prev, curr) =>
        curr.getBoundingClientRect().height <
        prev.getBoundingClientRect().height
          ? curr
          : prev
      )
      this.columns[+target.dataset.index!].push(itemIndex)
      await this.fillColumns(itemIndex + 1)
    },
  },
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
        'flex-basis': 0,
        'flex-direction': 'column',
        'flex-grow': 1,
        height: ['-webkit-max-content', '-moz-max-content', 'max-content'],
        gap: `${gap}px`,
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
