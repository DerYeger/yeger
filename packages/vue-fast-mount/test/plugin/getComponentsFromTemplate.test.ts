import { describe, test } from 'vitest'

import { getComponentsFromTemplate } from '../../src/plugin/getComponentsFromTemplate'

describe('getComponentsFromTemplate', () => {
  test('extracts components and their data from the template', ({ expect }) => {
    const template = `
      <template>
        <Child v-model="input" :prop="value" @event="handler">
          <div>Content</div>
        </Child>
        <Sibling v-for="item of items" :key="item.id" :id="id" name="test" @close="onClose" />
        <Transition>
          <KeepAlive>
            <DynamicChild v-if="condition" v-bind:label="label" is-active v-on:click="handleClick" />
          </KeepAlive>
        </Transition>
        <my-form v-model:age="age" @submit="submitForm" />
        <MyComponentToKeep />
        <component :is="dynamicComponent" />
        <ComponentWithRef
          ref="myRef"
          :rules="[
            (val: string) => val.length > 0 || 'Value is required',
            (val: string) => val.length <= 10 || 'Value must be less than 10 characters',
          ]"
          :items="[
            1,
            2
          ]"
          :is-initialized="true"
          some-prop="test"
          @long-press="handleLongPress"
        />
        ></ComponentWithRef>
      </template>
      `

    const components = getComponentsFromTemplate(template, new Set(['MyComponentToKeep']))

    expect(components).toStrictEqual(
      new Map([
        [
          'Child',
          {
            props: new Set(['modelValue', 'prop']),
            emits: new Set(['event', 'update:modelValue']),
          },
        ],
        ['Sibling', { props: new Set(['id', 'name']), emits: new Set(['close']) }],
        ['DynamicChild', { props: new Set(['isActive', 'label']), emits: new Set(['click']) }],
        ['my-form', { props: new Set(['age']), emits: new Set(['submit', 'update:age']) }],
        [
          'ComponentWithRef',
          {
            props: new Set(['items', 'isInitialized', 'rules', 'someProp']),
            emits: new Set(['longPress']),
          },
        ],
      ]),
    )
  })
})
