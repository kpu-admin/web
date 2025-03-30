<script setup lang="ts">
import { HTTP_TAG_MAP } from '@/enums/httpEnum'
import { $t } from '@/locales'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal'
import { useFs } from '@fast-crud/fast-crud'
import { Card, CardMeta, Col, Row, Tag } from 'ant-design-vue'
import { split } from 'lodash-es'

import { createCrudOptions } from './ResourceApiSelect.data'

const data = reactive<{
  selectedData: Recordable[]
}>({
  selectedData: [],
})
const { crudBinding } = useFs({
  createCrudOptions,
  context: data,
})
const formRef = ref()
const [Modal, modalApi] = useKpuModal({
  onOpenChange(isOpen) {
    if (isOpen) {
      data.selectedData = modalApi.getData().selectedData
    }
  },
},
)
async function delSelectedDataByCard(obj: any) {
  const model = formRef.value.getFormData()
  const uris = model?.uri
  if (uris) {
    const index = uris.findIndex((uri: any) => {
      const selected = split(uri, '#')
      return (
        selected[0] === obj.springApplicationName
        && selected[2] === obj.uri
        && selected[3] === obj.requestMethod
      )
    })
    if (index > -1) {
      uris.splice(index, 1)
    }

    if (uris && uris.length > 0) {
      // await formRef.value.setFormData({...model, uri: undefined });
      formRef.value.setFormData({ ...model, uri: uris })
    }
    else {
      formRef.value.setFormData({ ...model, uri: undefined })
    }
  }
  const index = data.selectedData.findIndex(
    selected =>
      selected.springApplicationName === obj.springApplicationName
      && selected.uri === obj.uri
      && selected.requestMethod === obj.requestMethod,
  )

  if (index > -1) {
    data.selectedData.splice(index, 1)
  }
}
</script>

<template>
  <Modal v-bind="$attrs" title="选择API" :z-index="1000" :mask-closable="false" class="w1/2" width="80%">
    <Row>
      <Col :span="16">
        <div class="ml-4 mr-4">
          <fs-form ref="formRef" v-bind="crudBinding.addForm" />
        </div>
      </Col>
      <Col :span="8">
        <div class="ml-4 mr-4">
          <h4>已选接口 ({{ data.selectedData.length }})：</h4>
          <Card
            v-for="api in data.selectedData" :key="api.springApplicationName + api.uri + api.requestMethod" style="margin-bottom: 0.5rem;" hoverable
            size="small" :title="api.name"
          >
            <template #extra>
              <a href="javascript:void(0);" @click="delSelectedDataByCard(api)">删除</a>
            </template>
            <CardMeta>
              <template #title>
                {{ $t('devOperation.application.defResourceApi.springApplicationName') }}：
                {{ api.springApplicationName }} <br>
                {{ $t('devOperation.application.defResourceApi.controller') }}：{{ api.controller }}
              </template>
              <template #description>
                <div class="cardDesc" :title="`(${api.requestMethod}) ${api.uri} (${api.controller})`">
                  <Tag :color="HTTP_TAG_MAP.get(api.requestMethod)">
                    {{ api.requestMethod }}
                  </Tag>
                  {{ api.uri }}
                </div>
              </template>
            </CardMeta>
          </Card>
        </div>
      </Col>
    </Row>
  </Modal>
</template>

<style scoped>
.cardDesc {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  background: rgb(97 175 254 / 10%);
}
</style>
