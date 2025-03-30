import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
// import type { FormRulesExt } from '@/service/fetch';
import KpuAvatar from '@/adapter/component/components/avatar.vue'
import {
  addRequest,
  delRequest,
  infoRequest,
  pageRequest,
  removeFn,
} from '@/api/devOperation/system/baseFile.ts'
import { downloadIds } from '@/api/devOperation/system/upload.ts'
import { asyncFindUrlById } from '@/api/modules/file/upload.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { $t } from '@/locales'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
} from '@/plugins/fast-crud/common'
import { downloadFile, formatFileSize } from '@/utils/kpu/common.ts'
// import { usePermission } from '@/hooks/web/usePermission'
import { AutoComplete } from 'ant-design-vue'
import { ref } from 'vue'
// const { hasPermission } = usePermission()

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  const selectedIds = ref([] as string[])
  const { createMessage, createConfirm } = useMessage()
  async function onDownload(row: Record<string, any>) {
    const response = await downloadIds([row.id])
    downloadFile(response)
    createMessage.success($t('common.tips.downloadSuccess'))
  }
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        delRequest,
        infoRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: true,
            text: '调试上传',
          },
          ...deleteButton({
            crudExpose: props.crudExpose,
            selectedIds,
            removeFn,
          }),
          batchDownload: {
            // show: hasPermission(g.TENANT_SYSTEM_FILE_DOWNLOAD),
            text: $t('common.title.download'),
            click() {
              if (selectedIds.value?.length > 0) {
                createConfirm({
                  iconType: 'warning',
                  content: `确定要批量下载${selectedIds.value.length}条记录吗`,
                  onOk: async () => {
                    const response = await downloadIds(selectedIds.value)
                    downloadFile(response)
                    createMessage.success($t('common.tips.downloadSuccess'))
                  },
                })
              }
              else {
                createMessage.warning('请先勾选您要删除的数据')
              }
            },
          },
        },
      },
      addForm: {
        wrapper: {
          title: '调试上传',
        },
      },
      form: {
        col: {
          span: 24,
        },
        wrapper: {
          buttons: {
            ok: {
              show: !1,
            },
          },
        },
      },
      table: {
        striped: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          selectedRowKeys: selectedIds,
          onChange: (ids: any) => {
            selectedIds.value = ids
          },
        },
      },
      rowHandle: {
        width: '150px',
        buttons: {
          edit: {
            show: false,
          },
          view: {
            show: false,
          },
          copy: {
            show: false,
          },
          remove: {
            // show: hasPermission(R.TENANT_SYSTEM_FILE_DELETE)
          },

          down: {
            // show: hasPermission(g.TENANT_SYSTEM_FILE_DOWNLOAD),
            text: '下载',
            size: 'small',
            type: 'link',
            order: 0,
            async click({ row }) {
              const response = await downloadIds(row.id)
              downloadFile(response)
              createMessage.success($t('common.tips.downloadSuccess'))
            },
          },

        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        id: {
          title: '预览',
          type: 'file-uploader',
          form: {
            component: {
              valueType: 'key',
              buildUrl: async (id: any) => {
                return (await asyncFindUrlById(id)).data
              },
              uploader: {
                param: () => {
                  const data = props.crudExpose.getFormData()
                  return { ...data }
                },
              },
            },
          },
          column: {
            component: {
              buildUrl: async (id: any) => {
                return (await asyncFindUrlById(id)).data
              },
              render: data => data.row.fileType === 'IMAGE'
                ? (<KpuAvatar height="50px" width="50px" value={data.value}></KpuAvatar>)
                : (<a href="javascript:;" onClick={onDownload.bind(null, data.row)}>{data.row.originalFileName}</a>),
            },
          },
        },
        originalFileName: {
          title: $t('devOperation.system.comFile.originalFileName'),
          type: 'text',
          search: {
            show: !0,
          },
          form: {
            show: !1,
          },
        },
        bucket: {
          title: $t('devOperation.system.comFile.bucket'),
          type: 'text',
          search: {
            show: !0,
          },
          form: {
            rules: [{
              required: !0,
            }],
            value: 'dev',
            component: {
              name: AutoComplete,
              options: [{
                label: '私有资源',
                value: 'dev',
                key: 'dev',
              }, {
                label: '公共资源',
                value: 'public',
                key: 'public',
              }],
            },
          },
        },
        bizType: {
          title: $t('devOperation.system.comFile.bizType'),
          type: 'text',
          form: {
            rules: [{
              required: !0,
            }],
            value: 'BASE__FILE',
          },
        },
        fileType: {
          title: $t('devOperation.system.comFile.fileType'),
          type: 'dict-radio',
          dict: backendDict({
            type: 'FileType',
            isEnum: !0,
          }),
          column: {
            component: {
              color: 'auto',
            },
          },
          form: {
            show: !1,
          },
        },
        storageType: {
          title: $t('devOperation.system.comFile.storageType'),
          type: 'dict-select',
          dict: backendDict({
            type: 'FileStorageType',
            isEnum: !0,
          }),
          column: {
            component: {
              color: 'auto',
            },
          },
          search: {
            show: !0,
          },
          form: {
            rules: [{
              required: !0,
            }],
            value: 'LOCAL',
          },
        },
        contentType: {
          title: 'ContentType',
          type: 'text',
          search: {
            show: !0,
          },
          form: {
            show: !1,
          },
        },
        size: {
          title: $t('devOperation.system.comFile.size'),
          type: 'text',
          form: {
            show: !1,
          },
          column: {
            formatter({ value }) {
              return formatFileSize(value)
            },
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}
