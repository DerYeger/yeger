<template>
  <header class="secondary">
    <div class="row">
      <h1>@yeger/vue-masonry-wall</h1>
      <github-logo />
    </div>
    <p id="subtitle">
      Responsive masonry layout with SSR support and zero dependencies for Vue
      3.
    </p>
    <p class="row" style="justify-content: center">
      <a href="https://vue2-masonry-wall.yeger.eu/" rel="noopener">
        Vue 2 version
      </a>
      <a
        href="https://github.com/DerYeger/vue-masonry-wall/blob/master/README.md"
        target="_blank"
        rel="noopener"
      >
        Documentation
      </a>
    </p>
    <samp id="install" class="accent">
      <span>yarn add @yeger/vue-masonry-wall</span>
      <span>npm install @yeger/vue-masonry-wall</span>
    </samp>
    <badges />
  </header>
</template>

<script>
import { defineComponent } from 'vue'
import Badges from './badges'
import GithubLogo from './github-logo'

export default defineComponent({
  components: { Badges, GithubLogo },
})
</script>

<style scoped>
header {
  padding: 1rem;
  text-align: center;
}

header .row:first-child {
  align-items: center;
  justify-content: center;
}

header .row:first-child > * {
  margin-bottom: 0.5rem;
}

header h1 {
  margin: 0;
}

#subtitle {
  font-size: 1.25rem;
  font-style: italic;
  margin-top: 0;
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
</style>
