import pinia from '@/store'
import useSettingsStore from '@/store/modules/settings.ts'
import dayjs from '@/utils/dayjs.ts'
import storage from '@/utils/storage.ts'
import axios from 'axios'

const today = dayjs().format('YYYY-MM-DD')
const useBingStore = defineStore(
  // 唯一ID
  'bing',
  () => {
    const settingsStore = useSettingsStore()
    const backgroundList = ref<string[]>(JSON.parse(storage.local.get(`backgroundList-${today}`) as string) || [])
    async function setBackgroundList() {
      JSON.parse(storage.local.get(`backgroundList-${today}`) as string) || await axios({
        url: 'https://api.vuejs-core.cn/getBingImage',
        method: 'get',
      }).then(({ data }) => {
        backgroundList.value = data.data
        Object.keys(localStorage).forEach((item) => {
          item.startsWith(`${settingsStore.settings.app.storagePrefix}backgroundList`) && localStorage.removeItem(item)
        })
        storage.local.set(`backgroundList-${today}`, JSON.stringify(data.data))
      })
    }
    return {
      backgroundList,
      setBackgroundList,
    }
  },
)
useBingStore(pinia).setBackgroundList()
export default useBingStore
