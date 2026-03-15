<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import * as s from '@yeger/streams/sync'
import type { UnwrapRef } from 'vue'

import CopyButton from '~/components/CopyButton.vue'
import WatchtowerLinks from '~/components/WatchtowerLinks.vue'
import WatchtowerWarning from '~/components/WatchtowerWarning.vue'

const NO_WARNING = 'none'

const { data } = useQuery({
  key: queryKeys.watchtower,
  query: () => $fetch('/api/watchtower'),
})

const search = useLocalStorage('watchtower-search', '')
const warningFilterState = useLocalStorage<string[]>('watchtower-warning-filter', [
  'fund',
  'reitBdc',
  'swap',
])
const warningFilter = computed({
  get: () => warningFilterState.value,
  set: (val) => {
    warningFilterState.value = val.toSorted((a, b) => {
      if (a === NO_WARNING) {
        return -1
      }
      if (b === NO_WARNING) {
        return 1
      }
      return a.localeCompare(b)
    })
  },
})
const includeSold = useLocalStorage('watchtower-include-sold', false)

const securities = computed(() => {
  if (!data.value) {
    return undefined
  }
  const warningFilterSet = new Set(warningFilter.value)
  return s.toArray(
    s.pipe(
      data.value,
      s.filter((s) => {
        if (includeSold.value) {
          return true
        }
        return !s.isSold
      }),
      s.filter((security) => {
        if (!warningFilterSet.size) {
          return true
        }
        const activeWarnings = s.toSet(
          s.pipe(
            s.fromObject(security.warnings),
            s.filter(([_, isActive]) => isActive),
            s.map(([name]) => name),
          ),
        )
        if (activeWarnings.size === 0) {
          return warningFilterSet.has(NO_WARNING)
        }
        return activeWarnings.intersection(warningFilterSet).size > 0
      }),
      s.filter((s) => {
        if (!search.value) {
          return true
        }
        const lowerSearch = search.value.toLowerCase()
        return (
          s.name.toLowerCase().includes(lowerSearch) || s.isin.toLowerCase().includes(lowerSearch)
        )
      }),
    ),
  )
})

const columns = computed<TableColumn<NonNullable<UnwrapRef<typeof data>>[number]>[]>(() => [
  {
    id: 'logo',
    header: '',
    meta: {
      class: {
        td: 'size-16',
      },
    },
    cell: ({ row }) => h(resolveComponent('UAvatar'), { src: row.original.logo }),
  },
  { accessorKey: 'name', header: $t('watchtower.table.name') },
  {
    header: $t('watchtower.table.isin'),
    cell: ({ row }) => h(CopyButton, { text: row.original.isin }),
  },
  {
    id: 'fund',
    header: $t('watchtower.table.fund'),
    meta: {
      class: {
        th: 'text-center',
      },
    },
    cell: ({ row }) => {
      if (!row.original.warnings.fund) {
        return null
      }
      return h(WatchtowerWarning, {
        tooltip: $t('watchtower.warning.fund'),
      })
    },
  },
  {
    id: 'reitBdc',
    header: $t('watchtower.table.reit-bdc'),
    meta: {
      class: {
        th: 'text-center whitespace-nowrap',
      },
    },
    cell: ({ row }) => {
      if (!row.original.warnings.reitBdc) {
        return null
      }
      return h(WatchtowerWarning, {
        tooltip: $t('watchtower.warning.reit-bdc'),
      })
    },
  },
  {
    id: 'swap',
    header: $t('watchtower.table.swap'),
    meta: {
      class: {
        th: 'text-center',
      },
    },
    cell: ({ row }) => {
      if (!row.original.warnings.swap) {
        return null
      }
      return h(WatchtowerWarning, {
        tooltip: $t('watchtower.warning.swap'),
      })
    },
  },
  {
    header: $t('watchtower.table.links'),
    meta: {
      class: {
        th: 'text-right',
      },
    },

    cell: ({ row }) =>
      h(WatchtowerLinks, {
        name: row.original.name,
        isin: row.original.isin,
        fund: row.original.warnings.fund,
      }),
  },
])
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="grid max-w-full grid-cols-[1fr_auto_auto_auto] items-center gap-x-8 gap-y-4 p-4 max-lg:grid-cols-[1fr_auto]"
    >
      <UInput :placeholder="$t('watchtower.search-placeholder')" v-model="search" />
      <InfoTooltip :ui="{ content: 'max-w-sm text-justify' }">
        {{ $t('watchtower.help') }}
      </InfoTooltip>
      <USelect
        v-model="warningFilter"
        icon="hugeicons:filter"
        :placeholder="$t('watchtower.warning-filter')"
        :items="[
          { label: $t('watchtower.no-warning'), value: NO_WARNING },
          { label: $t('watchtower.table.fund'), value: 'fund' },
          { label: $t('watchtower.table.reit-bdc'), value: 'reitBdc' },
          { label: $t('watchtower.table.swap'), value: 'swap' },
        ]"
        class="max-sm:col-span-2 max-sm:row-start-2"
        multiple
      />
      <USwitch
        v-model="includeSold"
        :label="$t('watchtower.include-sold')"
        class="whitespace-nowrap max-sm:row-start-3"
      />
    </div>
    <UTable
      :loading="!data"
      :data="securities"
      :columns="columns"
      :column-pinning="{ left: ['logo'] }"
      :column-visibility="{
        reitBdc: warningFilter.includes('reitBdc') || warningFilter.length === 0,
        fund: warningFilter.includes('fund') || warningFilter.length === 0,
        swap: warningFilter.includes('swap') || warningFilter.length === 0,
      }"
      sticky
      class="flex-1 pb-16"
    />
  </div>
</template>
