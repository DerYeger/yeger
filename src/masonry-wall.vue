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
    <div class="masonry-column" v-for="(column, columnIndex) in columns" :key="columnIndex">
      <div class="masonry-item" v-for="row in column.itemIndices" :key="row">
        <slot :item="items[row]" :index="row">{{ items[row] }}</slot>
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

function maxBy<T>(array: T[], transform: (element: T) => number): T | undefined {
  if (array.length === 0) {
    return undefined
  }
  return array.slice(1).reduce((previous, current) => (transform(current) > transform(previous) ? current : previous), array[0])
}

function createColumns(count: number): Column[] {
  return [...new Array(count)].map(() => ({ itemIndices: [] }))
}

export default /*#__PURE__*/ defineComponent({
  name: 'MasonryWall', // vue component name
  props: {
    items: {
      type: Array,
      required: true,
    },
    ssrColumns: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    width: {
      type: Number,
      default: 400,
    },
    padding: {
      type: String,
      default: '0px',
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
  },
  methods: {
    recreate() {
      this.cursor = 0
      this.columns = []
      this.redraw()
    },
    redraw() {
      if (this.columns.length === this.columnCount()) {
        return
      }
      this.ready = false
      this.columns.splice(0)
      this.cursor = 0
      this.columns.push(...createColumns(this.columnCount()))
      this.ready = true
      this.fillColumns()
    },
    columnCount(): number {
      const count = Math.round(this.wall.scrollWidth / this.width)
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
        const floors = [...this.wall.getElementsByClassName('masonry-column__floor')] as HTMLDivElement[]
        const floor = maxBy(floors, (spacer: HTMLDivElement) => spacer.clientHeight || 0)
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
    width() {
      this.redraw()
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

.masonry-column:not(:last-child) {
  margin-right: v-bind(padding);
}

.masonry-item:not(:nth-last-child(2)) {
  margin-bottom: v-bind(padding);
}

.masonry-column__floor {
  flex-grow: 1;
  height: 0;
  z-index: -1;
}
</style>
