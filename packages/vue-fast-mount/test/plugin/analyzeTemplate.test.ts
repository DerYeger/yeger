import { readFileSync } from 'node:fs'

import { describe, test } from 'vitest'
import { parse } from 'vue/compiler-sfc'

import { analyzeTemplate } from '../../src/plugin/analyzeTemplate'
import type { Components } from '../../src/plugin/utils'

describe('analyzeTemplate', () => {
  describe('collects attributes', () => {
    test('collects native and data attributes as-is', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent data-testid="test" aria-label="label" />
      </template>
    `)
      const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
      const expectedComponents: Components = new Map([
        [
          'TestComponent',
          {
            props: new Map([
              ['data-testid', 'unknown'],
              ['aria-label', 'unknown'],
            ]),
            emits: new Set(),
          },
        ],
      ])
      expect(components).toMatchObject(expectedComponents)
    })

    test('collects static and dynamic attributes in camelCase', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent custom-attr="value" :dynamicProp="dynamicValue" />
      </template>
    `)
      const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
      const expectedComponents: Components = new Map([
        [
          'TestComponent',
          {
            props: new Map([
              ['custom-attr', 'unknown'],
              ['dynamicProp', 'unknown'],
            ]),
            emits: new Set(),
          },
        ],
      ])
      expect(components).toMatchObject(expectedComponents)
    })

    test('collects from multiple instances', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent :first-prop="42" />
        <TestComponent second-prop="7" />
        <TestComponent first-prop="42again" />
      </template>
    `)
      const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
      const expectedComponents: Components = new Map([
        [
          'TestComponent',
          {
            props: new Map([
              ['first-prop', 'unknown'],
              ['second-prop', 'unknown'],
            ]),
            emits: new Set(),
          },
        ],
      ])
      expect(components).toMatchObject(expectedComponents)
    })

    describe('boolean shorthand', () => {
      test('collects shorthand props with inference over multiple usages', ({ expect }) => {
        const { descriptor } = parse(`
      <template>
        <TestComponent :boolean-prop="unknown" />
        <TestComponent boolean-prop />
      </template>
    `)
        const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
        const expectedComponents: Components = new Map([
          [
            'TestComponent',
            {
              props: new Map([['boolean-prop', 'boolean']]),
              emits: new Set(),
            },
          ],
        ])
        expect(components).toMatchObject(expectedComponents)
      })

      test('does not widen inferered type', ({ expect }) => {
        const { descriptor } = parse(`
      <template>
        <TestComponent boolean-prop />
        <TestComponent :boolean-prop="unknown" />
        <TestComponent boolean-prop="another one" />
      </template>
    `)
        const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
        const expectedComponents: Components = new Map([
          [
            'TestComponent',
            {
              props: new Map([['boolean-prop', 'boolean']]),
              emits: new Set(),
            },
          ],
        ])
        expect(components).toMatchObject(expectedComponents)
      })
    })
  })

  describe('collects emits', () => {
    test('collects v-on events with kebab-case and camelCase', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent @kebab-event="handler" @camelEvent.stop="handler" v-on:submit="onSubmit" />
      </template>
    `)
      const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
      const expectedComponents: Components = new Map([
        [
          'TestComponent',
          {
            props: new Map(),
            emits: new Set(['kebab-event', 'camelEvent', 'submit']),
          },
        ],
      ])
      expect(components).toMatchObject(expectedComponents)
    })

    test('collects from multiple instances', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent @first-event="firstHandler" />
        <TestComponent @second-event="secondHandler" />
        <TestComponent @first-event="thirdHandler" />
      </template>
    `)
      const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
      const expectedComponents: Components = new Map([
        [
          'TestComponent',
          {
            props: new Map(),
            emits: new Set(['first-event', 'second-event']),
          },
        ],
      ])
      expect(components).toMatchObject(expectedComponents)
    })
  })

  describe('model values', () => {
    test('collects v-model bindings as props and emits', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent v-model="shorthandModelValue" v-model:named-value="namedModel" />
      </template>
    `)
      const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
      const expectedComponents: Components = new Map([
        [
          'TestComponent',
          {
            props: new Map([
              ['modelValue', 'unknown'],
              ['named-value', 'unknown'],
            ]),
            emits: new Set(['update:modelValue', 'update:named-value']),
          },
        ],
      ])
      expect(components).toMatchObject(expectedComponents)
    })

    test('collects from multiple instances', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent v-model="shorthandModelValue" />
        <TestComponent v-model:first-named="firstNamedModel" />
        <TestComponent v-model:second-named="secondNamedModel" />
        <TestComponent v-model="secondShorthandModelValue" />
      </template>
    `)
      const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
      const expectedComponents: Components = new Map([
        [
          'TestComponent',
          {
            props: new Map([
              ['modelValue', 'unknown'],
              ['first-named', 'unknown'],
              ['second-named', 'unknown'],
            ]),
            emits: new Set(['update:modelValue', 'update:first-named', 'update:second-named']),
          },
        ],
      ])
      expect(components).toMatchObject(expectedComponents)
    })
  })

  describe('unstubbed components', () => {
    test('does not collect metadata for unstubbed components', ({ expect }) => {
      const { descriptor } = parse(`
      <template>
        <TestComponent />
        <SecondComponent />
      </template>
    `)
      const components = analyzeTemplate(
        'Test.vue',
        descriptor.template!,
        new Set(['TestComponent']),
      )
      const expectedComponents: Components = new Map([
        ['SecondComponent', { props: new Map(), emits: new Set() }],
      ])
      expect(components).toMatchObject(expectedComponents)
    })
  })

  test('works on the example Parent.vue', ({ expect }) => {
    const { descriptor } = parse(readFileSync('test/runtime/Parent.vue', 'utf-8'))
    const components = analyzeTemplate('Test.vue', descriptor.template!, new Set())
    expect(components).toMatchInlineSnapshot(`
      Map {
        "Child" => {
          "emits": Set {},
          "props": Map {},
        },
        "VElseIfChild" => {
          "emits": Set {},
          "props": Map {
            "data-testid" => "unknown",
          },
        },
        "VElseChild" => {
          "emits": Set {},
          "props": Map {
            "data-testid" => "unknown",
          },
        },
        "AliasedBarrelChild" => {
          "emits": Set {},
          "props": Map {
            "data-testid" => "unknown",
            "is-active" => "boolean",
          },
        },
        "MixedDefaultChild" => {
          "emits": Set {
            "child-event",
          },
          "props": Map {},
        },
        "MixedNamedChild" => {
          "emits": Set {},
          "props": Map {
            "child-prop" => "unknown",
          },
        },
        "Sibling" => {
          "emits": Set {
            "update:modelValue",
            "update:named-model",
          },
          "props": Map {
            "modelValue" => "unknown",
            "named-model" => "unknown",
          },
        },
      }
    `)
  })
})
