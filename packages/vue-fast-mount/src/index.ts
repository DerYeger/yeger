import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'

type ImportedComponent<TImport> = TImport extends { default: infer TComponent }
  ? TComponent
  : TImport

type MountOptions<TImport> = Parameters<typeof shallowMount<ImportedComponent<TImport>>>[1]

type MountedInstance<TImport> =
  ImportedComponent<TImport> extends abstract new (...args: any[]) => infer TInstance
    ? TInstance
    : ComponentPublicInstance

export async function fastMount<TImport>(
  componentImport: Promise<TImport>,
  options?: MountOptions<TImport>,
): Promise<VueWrapper<MountedInstance<TImport>>> {
  const importedComponent = await componentImport
  const component =
    importedComponent && typeof importedComponent === 'object' && 'default' in importedComponent
      ? importedComponent.default
      : importedComponent

  return shallowMount(
    component as Parameters<typeof shallowMount>[0],
    options as MountOptions<TImport>,
  ) as VueWrapper<MountedInstance<TImport>>
}
