<script setup lang="ts">
import { debounce } from '@yeger/debounce'
import { onBeforeUnmount, useTemplateRef, watch } from 'vue'

import type { Marmoset } from './marmoset'
import { loadMarmoset, marmosetViewerDefaultOptions } from './marmoset'

const {
  src,
  width = marmosetViewerDefaultOptions.width,
  height = marmosetViewerDefaultOptions.height,
  responsive = false,
  autoStart = false,
} = defineProps<{
  src: string
  width?: number
  height?: number
  responsive?: boolean
  autoStart?: boolean
}>()

const emit = defineEmits<{
  (event: 'load'): void
  (event: 'resize'): void
  (event: 'unload'): void
}>()

const viewerHost = useTemplateRef<HTMLDivElement>('marmosetViewerHost')
const resizeObserver = new ResizeObserver(debounce(() => onResize()))

let viewer: Marmoset.WebViewer | undefined

function loadViewer() {
  const host = viewerHost.value
  if (host == null) {
    return
  }

  viewer = new window.marmoset.WebViewer(width, height, src)
  host.appendChild(viewer.domRoot)
  viewer.onLoad = () => emit('load')

  if (responsive) {
    resizeObserver.observe(host)
  }
  if (autoStart) {
    viewer.loadScene()
  }
}

function unloadViewer() {
  if (viewer === undefined) {
    return
  }

  const host = viewerHost.value
  if (host != null) {
    resizeObserver.unobserve(host)
    if (host.contains(viewer.domRoot)) {
      host.removeChild(viewer.domRoot)
    }
  }

  viewer.unload()
  viewer = undefined
  emit('unload')
}

function reloadViewer() {
  unloadViewer()
  loadViewer()
}

function onResize() {
  const host = viewerHost.value
  if (host == null) {
    return
  }

  try {
    viewer?.resize(host.clientWidth, host.clientHeight)
  } catch {
    // marmoset.js throws a typeError on resize
  }
  emit('resize')
}

function resize() {
  if (responsive) {
    return
  }

  try {
    viewer?.resize(width, height)
  } catch {
    // marmoset.js throws a typeError on resize
  }
  emit('resize')
}

watch(
  () => src,
  () => {
    reloadViewer()
  },
)

watch(
  () => width,
  () => {
    resize()
  },
)

watch(
  () => height,
  () => {
    resize()
  },
)

watch(
  () => responsive,
  (val) => {
    const host = viewerHost.value
    if (host == null) {
      return
    }

    if (val) {
      resizeObserver.observe(host)
    } else {
      resizeObserver.unobserve(host)
      resize()
    }
  },
)

watch(
  () => autoStart,
  (val) => {
    if (val) {
      viewer?.loadScene()
    }
  },
)

loadMarmoset().then(loadViewer)

onBeforeUnmount(() => {
  unloadViewer()
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
