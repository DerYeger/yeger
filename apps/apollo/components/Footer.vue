<script setup lang="ts">
import type { Link } from '~~/types/types'

const resources: Link[] = [
  {
    to: 'https://github.com/DerYeger/yeger/tree/main/apps/apollo',
    text: 'GitHub',
  },
  {
    to: 'https://github.com/DerYeger/yeger/tree/main/packages/fol',
    text: 'Parser',
  },
  {
    to: 'https://github.com/DerYeger/yeger/tree/main/packages/d3-graph-controller',
    text: 'Graph Library',
  },
]
</script>

<template>
  <footer
    class="flex flex-wrap align-start justify-between gap-12 mt-8 w-fit mx-auto"
  >
    <FooterColumn title="Resources">
      <a
        v-for="link of resources"
        :key="link.to"
        target="_blank"
        rel="noreferrer"
        :href="link.to"
        class="transition-colors hover:text-stone-900 cursor-pointer py-2 my--2 w-full"
      >
        {{ link.text }}
      </a>
    </FooterColumn>
    <FooterColumn title="Credits">
      <span>Images by Midjourney (CC BY-NC 4.0).</span>
      <span>© 2022 Jan Müller. All rights reserved.</span>
    </FooterColumn>
  </footer>
</template>
