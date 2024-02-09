<script lang="ts">
import { defineComponent } from 'vue'

import BadgeList from '~/badge-list.vue'
import GithubLogo from '~/github-logo.vue'

export default defineComponent({
  components: { BadgeList, GithubLogo },
})
</script>

<template>
  <header class="secondary">
    <div class="row">
      <h1 id="title">
        @yeger/vue2-masonry-wall
      </h1>
      <GithubLogo />
    </div>
    <p id="subtitle">
      Responsive masonry layout with SSR support and zero dependencies for Vue
      2.
    </p>
    <p class="row" style="justify-content: center">
      <a href="https://vue-masonry-wall.yeger.eu/" rel="noopener">
        Vue 3 version
      </a>
      <a
        href="https://github.com/DerYeger/yeger/blob/main/packages/vue2-masonry-wall/README.md"
        target="_blank"
        rel="noopener"
      >
        Documentation
      </a>
    </p>
    <samp id="install" class="accent">
      <span>yarn add @yeger/vue2-masonry-wall</span>
      <span>npm install @yeger/vue2-masonry-wall</span>
    </samp>
    <BadgeList />
  </header>
</template>

<style scoped>
header {
  padding: 1rem;
  text-align: center;
}

header .row:first-child {
  align-items: center;
  justify-content: center;
  margin-top: -0.5rem;
}

header h1 {
  margin: 0;
}

header .row:first-child > * {
  margin-top: 0.5rem;
}

#subtitle {
  font-size: 1.1rem;
  font-style: italic;
  margin-top: 0.5rem;
}

#install {
  padding: 1em;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  margin: auto;
  text-align: start;
}

#install,
#install span {
  width: fit-content;
  width: -moz-fit-content;
}

#install > * + * {
  margin-top: 0.25rem;
}

@media only screen and (max-width: 600px) {
  #title {
    font-size: 1.5rem;
  }

  #subtitle {
    font-size: 1rem;
  }

  #install {
    font-size: 0.75rem;
  }
}
</style>
