import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'

type ImportedComponent<TImport> = TImport extends { default: infer TComponent }
  ? TComponent
  : TImport

type MountedInstance<TImport> =
  ImportedComponent<TImport> extends abstract new (...args: any[]) => infer TInstance
    ? TInstance
    : ComponentPublicInstance

export async function fastMount<TImport>(
  componentImport: Promise<TImport>,
  options?: Parameters<typeof shallowMount>[1],
): Promise<VueWrapper<MountedInstance<TImport>>> {
  const importedComponent = await componentImport
  const component =
    importedComponent && typeof importedComponent === 'object' && 'default' in importedComponent
      ? importedComponent.default
      : importedComponent

  return shallowMount(
    component as Parameters<typeof shallowMount>[0],
    options as Parameters<typeof shallowMount>[1],
  ) as VueWrapper<MountedInstance<TImport>>
}
