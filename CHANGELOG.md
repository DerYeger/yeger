## [2.2.6](https://github.com/DerYeger/vue-masonry-wall/compare/v2.2.5...v2.2.6) (2021-08-23)


### Bug Fixes

* remove unused `ready` data ([33d2440](https://github.com/DerYeger/vue-masonry-wall/commit/33d2440119caa4c0ad2ede9f75bbd969bb3752e9))
* replace `cursor` with recursion parameter ([b7ed516](https://github.com/DerYeger/vue-masonry-wall/commit/b7ed516cf37953fb1c328fd3355030fc491d08c4))

## [2.2.5](https://github.com/DerYeger/vue-masonry-wall/compare/v2.2.4...v2.2.5) (2021-08-22)


### Bug Fixes

* remove redundant `masonry-column__floor` elements ([2b1acc4](https://github.com/DerYeger/vue-masonry-wall/commit/2b1acc4a429a446a9e69e10806fa10ec4d685d6e))
* use `getBoundingClientRect` instead of height properties ([f58c03e](https://github.com/DerYeger/vue-masonry-wall/commit/f58c03eb2ecc9d974a035e2b40be691c617736a2))

## [2.2.4](https://github.com/DerYeger/vue-masonry-wall/compare/v2.2.3...v2.2.4) (2021-08-22)


### Bug Fixes

* reduce bundle size by optimizing code ([fe12558](https://github.com/DerYeger/vue-masonry-wall/commit/fe125586f8fc3f371685384bf509fa1470fd4310))

## [2.2.3](https://github.com/DerYeger/vue-masonry-wall/compare/v2.2.2...v2.2.3) (2021-08-21)


### Bug Fixes

* update side-effects ([24bc47e](https://github.com/DerYeger/vue-masonry-wall/commit/24bc47e11ca6217da328cc6978fa74fd564cd67f))

## [2.2.2](https://github.com/DerYeger/vue-masonry-wall/compare/v2.2.1...v2.2.2) (2021-08-21)


### Bug Fixes

* specify side-effects ([44aad69](https://github.com/DerYeger/vue-masonry-wall/commit/44aad694b732b4818eb7ad5e8400453a49ac04d1))

## [2.2.1](https://github.com/DerYeger/vue-masonry-wall/compare/v2.2.0...v2.2.1) (2021-08-21)


### Bug Fixes

* check if item is actually `undefined` ([4e34cb1](https://github.com/DerYeger/vue-masonry-wall/commit/4e34cb14e9758f7f691cb6a5faf8cb28f67e9038))
* remove redundant check in `padding` watcher ([01dda58](https://github.com/DerYeger/vue-masonry-wall/commit/01dda5811d4856d787d4f84ac6a4257318a7ce5e))

# [2.2.0](https://github.com/DerYeger/vue-masonry-wall/compare/v2.1.0...v2.2.0) (2021-08-20)


### Features

* add support for rtl layouting ([1b85c72](https://github.com/DerYeger/vue-masonry-wall/commit/1b85c7218616ce42ada7e2fe10a088950ece0e87))

# [2.1.0](https://github.com/DerYeger/vue-masonry-wall/compare/v2.0.1...v2.1.0) (2021-08-20)


### Features

* **vue:** remove `v-bind` in `style` to support Vue v3.1 and v3.2 ([bfbd7ed](https://github.com/DerYeger/vue-masonry-wall/commit/bfbd7ed79e78940d93355dd38f5f75439bb6f941))

## [2.0.1](https://github.com/DerYeger/vue-masonry-wall/compare/v2.0.0...v2.0.1) (2021-08-16)


### Bug Fixes

* round down when calculating column count ([66aace1](https://github.com/DerYeger/vue-masonry-wall/commit/66aace1c740ecfd83be211db16b890dfc000b27d))

# [2.0.0](https://github.com/DerYeger/vue-masonry-wall/compare/v1.0.3...v2.0.0) (2021-08-16)


### Bug Fixes

* remove bottom margin of last item in column ([0ac0b80](https://github.com/DerYeger/vue-masonry-wall/commit/0ac0b802e9a5451160a088d37a6e4baa635b5f83))


### Code Refactoring

* rename `width` prop to `columnWidth` ([eb699d0](https://github.com/DerYeger/vue-masonry-wall/commit/eb699d0b53a1b53f2bdd9123a8dd9d38340d567b))


### Features

* consider padding while calculating column count ([6c4af87](https://github.com/DerYeger/vue-masonry-wall/commit/6c4af8770746639fed47ea12e6a587f52f2f3cc5))
* support item removal by recreating layout on input change ([6b7d308](https://github.com/DerYeger/vue-masonry-wall/commit/6b7d3086e88c10ef98f1f2bb4cde271d49d2a5c1))


### BREAKING CHANGES

* rename `width` prop to `columnWidth`
* `padding` prop is now of type number

## [1.0.3](https://github.com/DerYeger/vue-masonry-wall/compare/v1.0.2...v1.0.3) (2021-08-15)


### Bug Fixes

* enable css extraction ([cddf809](https://github.com/DerYeger/vue-masonry-wall/commit/cddf809a745eb609f9093314c5ad78e5320052b6))

## [1.0.2](https://github.com/DerYeger/vue-masonry-wall/compare/v1.0.1...v1.0.2) (2021-08-15)


### Bug Fixes

* remove helper function export ([4f6b884](https://github.com/DerYeger/vue-masonry-wall/commit/4f6b8848f1e0af0c9797111d73e87eb3224cc64f))

## [1.0.1](https://github.com/DerYeger/vue-masonry-wall/compare/v1.0.0...v1.0.1) (2021-08-15)


### Bug Fixes

* **npm:** add publish config ([f151fe3](https://github.com/DerYeger/vue-masonry-wall/commit/f151fe31166dea440422c9b1486e649192085203))

# 1.0.0 (2021-08-15)


### Features

* create project ([afa690e](https://github.com/DerYeger/vue-masonry-wall/commit/afa690e2b2aa9fcfa1a80391548922db58f81f09))
