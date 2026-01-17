<template>
  <div id="badges" class="row">
    <a
      href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml"
      target="_blank"
      rel="noopener"
    >
      <img
        alt="CI"
        src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F"
      />
    </a>
    <a href="https://www.npmjs.com/package/@yeger/vue-masonry-wall" target="_blank" rel="noopener">
      <img alt="NPM" src="https://img.shields.io/npm/v/@yeger/vue-masonry-wall?logo=npm" />
    </a>
    <a
      href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/vue-masonry-wall"
      target="_blank"
      rel="noopener"
    >
      <img
        alt="Coverage"
        src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=vue-masonry-wall"
      />
    </a>
    <a href="https://www.npmjs.com/package/vue" target="_blank" rel="noopener">
      <img
        alt="npm peer dependency version"
        src="https://img.shields.io/npm/dependency-version/@yeger/vue-masonry-wall/peer/vue"
      />
    </a>
    <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">
      <img alt="MIT" src="https://img.shields.io/npm/l/@yeger/vue-masonry-wall?color=%234DC71F" />
    </a>
  </div>
</template>

<style scoped>
#badges {
  justify-content: center;
  margin-top: 1rem;
}
</style>
