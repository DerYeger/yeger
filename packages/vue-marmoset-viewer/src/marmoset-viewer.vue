<script lang="ts">
import { debounce } from '@yeger/debounce'
import { defineComponent } from 'vue'

import type { Marmoset } from '~/marmoset'
import { loadMarmoset, marmosetViewerDefaultOptions } from '~/marmoset'

export default defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: marmosetViewerDefaultOptions.width,
    },
    height: {
      type: Number,
      default: marmosetViewerDefaultOptions.height,
    },
    responsive: {
      type: Boolean,
      default: false,
    },
    autoStart: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['load', 'resize', 'unload'],
  data() {
    return {
      viewer: undefined as Marmoset.WebViewer | undefined,
    }
  },
  computed: {
    viewerHost(): HTMLDivElement {
      return this.$refs.marmosetViewerHost as HTMLDivElement
    },
    resizeObserver(): ResizeObserver {
      return new ResizeObserver(debounce(() => this.onResize()))
    },
  },
  watch: {
    src() {
      this.reloadViewer()
    },
    width() {
      this.resize()
    },
    height() {
      this.resize()
    },
    responsive(val: boolean) {
      if (val) {
        this.resizeObserver.observe(this.viewerHost)
      } else {
        this.resizeObserver.unobserve(this.viewerHost)
        this.resize()
      }
    },
    autoStart(val: boolean) {
      if (val) {
        this.viewer?.loadScene()
      }
    },
  },
  mounted() {
    loadMarmoset().then(() => this.loadViewer())
  },
  beforeUnmount() {
    this.unloadViewer()
  },
  methods: {
    loadViewer() {
      this.viewer = new window.marmoset.WebViewer(
        this.width,
        this.height,
        this.src
      )
      this.viewerHost.appendChild(this.viewer.domRoot)
      this.viewer.onLoad = () => this.$emit('load')
      if (this.responsive) {
        this.resizeObserver.observe(this.viewerHost)
      }
      if (this.autoStart) {
        this.viewer.loadScene()
      }
    },
    unloadViewer() {
      if (this.viewer === undefined) {
        return
      }
      this.resizeObserver.unobserve(this.viewerHost)
      this.viewerHost.removeChild(this.viewer.domRoot)
      this.viewer.unload()
      this.$emit('unload')
    },
    reloadViewer() {
      this.unloadViewer()
      this.loadViewer()
    },
    onResize() {
      try {
        this.viewer?.resize(
          this.viewerHost.clientWidth,
          this.viewerHost.clientHeight
        )
      } catch {
        // marmoset.js throws a typeError on resize
      }
      this.$emit('resize')
    },
    resize() {
      if (this.responsive) {
        return
      }
      try {
        this.viewer?.resize(this.width, this.height)
      } catch {
        // marmoset.js throws a typeError on resize
      }
      this.$emit('resize')
    },
  },
})
</script>

<template>
  <div
    ref="marmosetViewerHost"
    class="marmoset-viewer-host"
    :class="{ 'marmoset-viewer-host__responsive': responsive }"
    :style="{
      width: responsive ? '100%' : 'fit-content',
      height: responsive ? 'calc(100% - 1px)' : 'fit-content',
    }"
  />
</template>
