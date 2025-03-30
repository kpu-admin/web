import type { FunctionalComponent, VNode } from 'vue'

import KpuIcon from '@/ui/components/KpuIcon/index.vue'
import { isString } from '@vue/shared'
import { h } from 'vue'

interface TreeIconProps {
  icon: VNode | string
}

export const TreeIcon: FunctionalComponent<TreeIconProps> = ({ icon }) => {
  if (!icon) {
    return null
  }
  if (isString(icon)) {
    return h(KpuIcon, { name: icon, class: 'mr-1' })
  }
  return KpuIcon as any
}
