<script lang="ts">
import { defineComponent } from 'vue'

import DemoFooter from './demo-footer.vue'
import DemoHeader from './demo-header.vue'

export default defineComponent({
  name: 'App',
  components: {
    DemoHeader,
    DemoFooter,
  },
  data() {
    const files = ['sphere', 'torus', 'cube']
    const [width, height] = window.innerWidth >= 600 ? [800, 600] : [300, 300]
    const emits = [] as string[]
    return {
      src: files[0],
      width: width.toString(),
      height: height.toString(),
      autoStart: false,
      responsive: false,
      files,
      emits,
    }
  },
  computed: {
    emitLog(): string {
      return this.emits.join('\n')
    },
  },
  created() {
    document.title = 'vue-marmoset-viewer'
    document.documentElement.setAttribute('lang', 'en')
    const metaElement = document.createElement('meta')
    metaElement.setAttribute('name', 'description')
    metaElement.content =
      'A responsive and configurable Marmoset Viewer component for Vue.'
    document.getElementsByTagName('head')[0]?.appendChild(metaElement)
  },
  methods: {
    addEmit(emit: string) {
      this.emits.unshift(`${new Date().toLocaleTimeString()}: ${emit}`)
    },
    capitalize(value: string): string {
      if (!value) {
        return ''
      }
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
})
</script>

<template>
  <div id="app">
    <DemoHeader />
    <main>
      <div id="tools">
        <section id="settings">
          <div class="row">
            <label>Model</label>
            <button
              v-for="file of files"
              :key="file"
              :disabled="src === file"
              @click="src = file"
            >
              {{ capitalize(file) }}
            </button>
          </div>
          <div>
            <label for="autostart">Autostart</label>
            <input id="autostart" v-model="autoStart" type="checkbox">
          </div>
          <div>
            <label for="responsive">Responsive</label>
            <input id="responsive" v-model="responsive" type="checkbox">
          </div>
          <div>
            <label for="width">
              Width
              <span v-show="!responsive">({{ width }}px)</span>
            </label>
            <input
              id="width"
              v-model="width"
              type="range"
              min="200"
              max="800"
              :disabled="responsive"
            >
          </div>
          <div>
            <label for="height">
              Height
              <span v-show="!responsive">({{ height }}px)</span>
            </label>
            <input
              id="height"
              v-model="height"
              :disabled="responsive"
              max="600"
              min="200"
              type="range"
            >
          </div>
        </section>
        <section id="emits">
          <div>
            <label for="emitLog">Emits</label>
            <button @click="emits = []">
              Clear
            </button>
          </div>
          <textarea id="emitLog" v-model="emitLog" readonly />
        </section>
      </div>
      <div style="flex-grow: 1">
        <MarmosetViewer
          :src="`${src}.mview`"
          :auto-start="autoStart"
          :responsive="responsive"
          :width="+width"
          :height="+height"
          @load="addEmit('load')"
          @resize="addEmit('resize')"
          @unload="addEmit('unload')"
        />
      </div>
    </main>
    <DemoFooter />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

:root {
  --color-primary: #cb997e;
  --color-secondary: #ffe8d6;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

header,
main,
footer {
  padding: 1rem;
}

header {
  background: var(--color-primary);
}

header,
footer {
  text-align: center;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

#tools {
  display: flex;
}

#settings {
  display: flex;
  flex-direction: column;
}

#settings > div + div {
  margin-top: 0.5rem;
}

#emits {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  margin-left: 1rem;
}

#emits textarea {
  width: 100%;
  height: 100%;
  resize: none;
  margin-top: 0.5rem;
}

footer {
  background: var(--color-secondary);
  font-size: 0.75rem;
  padding: 0.75em;
}

main > * + div {
  margin-top: 1rem;
}

label + * {
  margin-left: 0.5rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.5rem;
}

.row > * {
  margin-left: 0.5rem;
  display: inline-block;
}

.subtitle {
  font-size: 1.25rem;
  font-style: italic;
}

a {
  text-decoration: none;
}

a:active,
a:hover,
a:link,
a:visited {
  color: white;
}

@media only screen and (max-width: 600px) {
  #tools {
    flex-direction: column;
  }

  #emits {
    margin-left: 0;
    margin-top: 1rem;
  }
}
</style>
