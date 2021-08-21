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
      <div class="masonry-column__floor" :data-column="columnIndex" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Column {
  itemIndices: number[]
}

function maxBy<T>(array: T[], map: (element: T) => number): T | undefined {
  if (array.length === 0) {
    return undefined
  }
  return array.reduce((prev, curr) => (map(curr) > map(prev) ? curr : prev))
}

function createColumns(count: number): Column[] {
  return [...new Array(count)].map(() => ({ itemIndices: [] }))
}

export default /*#__PURE__*/ defineComponent({
  name: 'MasonryWall', // vue component name
  props: {
    items: {
      type: Array as PropType<any[]>,
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
      for (let i = 0; i < this.items.length; i++) {
        columns[i % count].itemIndices.push(i)
      }
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

    if (!this.ready) {
      this.ready = true
    }

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
      return new ResizeObserver(this.redraw)
    },
    paddingPx(): string {
      return `${this.padding}px`
    },
  },
  methods: {
    recreate() {
      this.cursor = 0
      this.columns = []
      this.redraw()
    },
    redraw() {
      if (this.columns.length === this.columnCount(this.padding)) {
        return
      }
      this.ready = false
      this.columns.splice(0)
      this.cursor = 0
      this.columns.push(...createColumns(this.columnCount(this.padding)))
      this.ready = true
      this.fillColumns()
    },
    columnCount(padding: number): number {
      const count = Math.floor(
        (this.wall.scrollWidth + padding) / (this.columnWidth + padding)
      )
      if (count < 1) {
        return 1
      }
      return count
    },
    fillColumns() {
      if (!this.ready || this.cursor >= this.items.length) {
        return
      }
      this.$nextTick(() => {
        const floors = [
          ...this.wall.getElementsByClassName('masonry-column__floor'),
        ] as HTMLDivElement[]

        if (this.rtl) {
          floors.reverse()
        }

        const floor = maxBy(
          floors,
          (spacer: HTMLDivElement) => spacer.clientHeight || 0
        )
        this.addItem(+(floor?.dataset?.column ?? 0))
        this.fillColumns()
      })
    },
    addItem(index: number) {
      const column = this.columns[index]
      if (this.items[this.cursor]) {
        column.itemIndices.push(this.cursor)
        this.cursor++
      }
    },
  },
  watch: {
    items() {
      this.recreate()
    },
    columnWidth() {
      this.redraw()
    },
    padding(value: number, oldValue: number) {
      if (this.columnCount(value) !== this.columnCount(oldValue)) {
        this.redraw()
      }
    },
    rtl() {
      this.recreate()
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
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
}

.masonry-column__floor {
  flex-grow: 1;
  height: 0;
  z-index: -1;
}
</style>
