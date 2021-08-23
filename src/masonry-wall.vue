<!--MIT License-->

<!--Copyright (c) 2021 Fuxing Loh, Jan Müller-->

<!--Permission is hereby granted, free of charge, to any person obtaining a copy-->
<!--of this software and associated documentation files (the "Software"), to deal-->
<!--in the Software without restriction, including without limitation the rights-->
<!--to use, copy, modify, merge, publish, distribute, sublicense, and/or sell-->
<!--copies of the Software, and to permit persons to whom the Software is-->
<!--furnished to do so, subject to the following conditions:-->

<!--The above copyright notice and this permission notice shall be included in all-->
<!--copies or substantial portions of the Software.-->

<!--THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR-->
<!--IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,-->
<!--FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE-->
<!--AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER-->
<!--LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,-->
<!--OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE-->
<!--SOFTWARE.-->

<template>
  <div class="masonry-wall" ref="wall" :class="{ ready }">
    <div
      class="masonry-column"
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      :data-index="columnIndex"
      :style="`margin-right: ${
        columnIndex === columns.length - 1 ? '0' : paddingPx
      }`"
    >
      <div
        class="masonry-item"
        v-for="(itemIndex, row) in column.itemIndices"
        :key="itemIndex"
        :style="`margin-bottom: ${
          row === column.itemIndices.length - 1 ? '0' : paddingPx
        }`"
      >
        <slot :item="items[itemIndex]" :index="itemIndex">
          {{ items[itemIndex] }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Column {
  itemIndices: number[]
}

function createColumns(count: number): Column[] {
  return [...new Array(count)].map(() => ({ itemIndices: [] }))
}

export default /*#__PURE__*/ defineComponent({
  name: 'MasonryWall',
  props: {
    items: {
      type: Array as PropType<unknown[]>,
      required: true,
    },
    ssrColumns: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    columnWidth: {
      type: Number,
      default: 400,
    },
    padding: {
      type: Number,
      default: 0,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const count = this.ssrColumns ?? 0
    if (count > 0) {
      const columns = createColumns(count)
      this.items.forEach((_, i) => columns[i % count].itemIndices.push(i))
      return {
        columns: columns,
        cursor: this.items.length,
        ready: false,
      }
    }
    return {
      columns: [],
      cursor: 0,
      ready: false,
    }
  },
  mounted() {
    this.redraw()
    this.ready = true
    this.resizeObserver.observe(this.wall)
  },
  beforeUnmount() {
    this.resizeObserver.unobserve(this.wall)
  },
  computed: {
    wall(): HTMLDivElement {
      return this.$refs.wall as HTMLDivElement
    },
    resizeObserver(): ResizeObserver {
      return new ResizeObserver(() => this.redraw())
    },
    paddingPx(): string {
      return `${this.padding}px`
    },
  },
  methods: {
    redraw(force = false) {
      if (this.columns.length === this.columnCount() && !force) {
        return
      }
      this.ready = false
      this.cursor = 0
      this.columns = createColumns(this.columnCount())
      this.ready = true
      this.fillColumns()
    },
    columnCount(): number {
      const count = Math.floor(
        (this.wall.getBoundingClientRect().width + this.padding) /
          (this.columnWidth + this.padding)
      )
      return count > 0 ? count : 1
    },
    fillColumns() {
      if (!this.ready || this.cursor >= this.items.length) {
        return
      }
      this.$nextTick(() => {
        const columnDivs = [
          ...this.wall.getElementsByClassName('masonry-column'),
        ] as HTMLDivElement[]
        if (this.rtl) {
          columnDivs.reverse()
        }
        const target = columnDivs.reduce((prev, curr) =>
          curr.getBoundingClientRect().height <
          prev.getBoundingClientRect().height
            ? curr
            : prev
        )
        this.columns[+target.dataset.index!].itemIndices.push(this.cursor++)
        this.fillColumns()
      })
    },
  },
  watch: {
    items() {
      this.redraw(true)
    },
    columnWidth() {
      this.redraw()
    },
    padding() {
      this.redraw()
    },
    rtl() {
      this.redraw(true)
    },
  },
})
</script>

<style scoped>
.masonry-wall {
  display: flex;
}

.masonry-wall:not(.ready) {
  opacity: 0;
}

.masonry-column {
  display: flex;
  flex-basis: 0;
  flex-direction: column;
  flex-grow: 1;
  height: fit-content;
  height: -moz-fit-content;
}
</style>
