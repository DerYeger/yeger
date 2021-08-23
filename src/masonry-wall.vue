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
  <div class="masonry-wall" ref="wall" style="display: flex">
    <div
      class="masonry-column"
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      :data-index="columnIndex"
      style="
         {
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
        }
      "
      :style="{
        height: ['-webkit-fit-content', '-moz-fit-content', 'fit-content'],
        marginRight: columnIndex === columns.length - 1 ? '0' : `${padding}px`,
      }"
    >
      <div
        class="masonry-item"
        v-for="(itemIndex, row) in column.itemIndices"
        :key="itemIndex"
        :style="{
          marginBottom:
            row === column.itemIndices.length - 1 ? '0' : `${padding}px`,
        }"
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
      }
    }
    return {
      columns: [],
    }
  },
  mounted() {
    this.redraw()
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
  },
  methods: {
    redraw(force = false) {
      if (this.columns.length === this.columnCount() && !force) {
        return
      }
      this.columns = createColumns(this.columnCount())
      this.fillColumns(0)
    },
    columnCount(): number {
      const count = Math.floor(
        (this.wall.getBoundingClientRect().width + this.padding) /
          (this.columnWidth + this.padding)
      )
      return count > 0 ? count : 1
    },
    fillColumns(itemIndex: number) {
      if (itemIndex >= this.items.length) {
        return
      }
      this.$nextTick(() => {
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
        this.columns[+target.dataset.index!].itemIndices.push(itemIndex)
        this.fillColumns(itemIndex + 1)
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
