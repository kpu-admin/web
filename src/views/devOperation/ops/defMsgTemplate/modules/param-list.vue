<script setup lang="ts">
import type { VxeGridListeners } from '@/adapter/vxe-table'
import type { VxeGridProps } from '@/adapter/vxe-table.ts'
import { useKpuVxeGrid } from '@/adapter/vxe-table'
import { useMessage } from '@/hooks/useMessage.tsx'
import { $t } from '@/locales'

const props = defineProps<{ value?: string }>()
const emits = defineEmits(['change', 'update:value'])
const { createConfirm } = useMessage()
const list = ref([])
const editRules = ref({})
function gridOptions(): VxeGridProps<{ key: string, value: string }> {
  return {
    toolbarConfig: {
      export: !1,
      zoom: !1,
      print: !1,
      refresh: !1,
      custom: !1,
      buttons: [{
        code: 'myInsert',
        name: '新增',
      }],
    },
    columns: [
      {
        title: $t('common.seq'),
        fixed: 'left',
        type: 'seq',
        width: 50,
      },
      {
        title: '参数名称',
        field: 'key',
        showOverflow: 'tooltip',
        align: 'center',
        editRender: {
          name: 'input',
          placeholder: '请点击输入',
          events: {
            change: () => {
            // eslint-disable-next-line ts/no-use-before-define
              const data = gridApi.grid?.getRecordset()
              emits('update:value', [...data.updateRecords, ...data.insertRecords])
            },
          },
        },
      },
      {
        title: '值',
        field: 'value',
        showOverflow: 'tooltip',
        align: 'center',
        editRender: {
          name: 'input',
          placeholder: '请点击输入',
          events: {
            change: () => {
            // eslint-disable-next-line ts/no-use-before-define
              const data = gridApi.grid?.getRecordset()
              emits('update:value', [...data.updateRecords, ...data.insertRecords])
            },
          },
        },
      },
      {
        field: 'action',
        fixed: 'right',
        title: '操作',
        slots: {
          default: 'action',
        },
        width: 150,
      },
    ],
    pagerConfig: {
      enabled: !1,
    },
    height: '250px',
    keepSource: !0,
    formConfig: {
      enabled: !1,
    },
    keyboardConfig: {
      isArrow: !0,
      isDel: !0,
      isEnter: !0,
      isTab: !0,
      isEdit: !0,
      isChecked: !0,
    },
    mouseConfig: {
      selected: !0,
    },
    editConfig: {
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: !0,
    },
    proxyConfig: {
      enabled: !1,
    },

  }
}
const gridEvents: VxeGridListeners = {
  toolbarButtonClick({ code }) {
    // eslint-disable-next-line ts/no-use-before-define
    const $grid = gridApi.grid
    switch (code) {
      case 'myInsert': {
        $grid?.insertAt({}, -1)
        const data = $grid?.getRecordset()
        emits('update:value', data?.insertRecords)
        break
      }
    }
  },
}
const [Grid, gridApi] = useKpuVxeGrid({
  gridOptions: gridOptions(),
  gridEvents,
})

watch(() => props.value, (t) => {
  let e = []
  if (t) {
    try {
      e = JSON.parse(t)
    }
    catch {}
  }
  list.value = e
  emits('update:value', e)
}, {
  immediate: !0,
})

async function removeRowEvent(row: any) {
  createConfirm({
    iconType: 'warning',
    title: '您确定要删除吗？',
    onOk: () => {
      const $grid = gridApi.grid
      try {
        $grid?.remove(row)
        const data = $grid?.getRecordset()
        emits('update:value', data?.insertRecords)
      }
      catch {}
    },
  })
}
</script>

<template>
  <Grid :edit-rules="editRules" :data="list">
    <template #action="{ row }">
      <AButton danger @click="() => removeRowEvent(row)">
        删除
      </AButton>
    </template>
  </Grid>
</template>
