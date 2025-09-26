<script setup lang="ts">
import type { Link } from '~~/types/types'

const resources: Link[] = [
  {
    to: 'https://github.com/DerYeger/yeger/tree/main/apps/formi',
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
  {
    to: 'https://apollo.janmueller.dev',
    text: 'Apollo',
  },
]
</script>

<template>
  <footer
    class="align-start mx-auto mt-8 flex w-fit flex-wrap justify-between gap-12"
  >
    <FooterColumn title="Resources">
      <a
        v-for="link of resources"
        :key="link.to"
        target="_blank"
        rel="noreferrer"
        :href="link.to"
        class="my--2 w-full cursor-pointer py-2 transition-colors hover:text-stone-900"
      >
        {{ link.text }}
      </a>
    </FooterColumn>
    <FooterColumn title="About">
      <span>Images by Midjourney (CC BY-NC 4.0).</span>
      <span>© 2022 Jan Müller. All rights reserved.</span>
    </FooterColumn>
  </footer>
</template>
