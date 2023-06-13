import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('lib', {
    description:
      'An example Turborepo generator - creates a new file at the root of the project',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new library to create?',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'library name cannot include an extension'
          }
          if (input.includes(' ')) {
            return 'library name cannot include spaces'
          }
          if (!input) {
            return 'library name is required'
          }
          return true
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{ dashCase name }}/package.json',
        templateFile: 'templates/lib/package.json.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{ dashCase name }}/README.md',
        templateFile: 'templates/lib/README.md.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{ dashCase name }}/tsconfig.json',
        templateFile: 'templates/lib/tsconfig.json',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{ dashCase name }}/vite.config.ts',
        templateFile: 'templates/lib/vite.config.ts.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{ dashCase name }}/src/index.ts',
        templateFile: 'templates/lib/src/index.ts',
      },
    ],
  })
}
