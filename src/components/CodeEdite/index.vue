<script lang="ts" setup>
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { onMounted } from 'vue'
import { Codemirror } from 'vue-codemirror'

interface Props {
  code?: string
  mode?: 'java' | 'javascript'
  theme?: 'default' | 'oneDark'
  config?: Record<string, any>
  placeholder?: string
}

defineOptions({
  name: 'CodeEdite',
})
const props = withDefaults(defineProps<Props>(), {
  code: '',
  mode: 'javascript',
  theme: 'default',
  config: () => ({
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    autofocus: true,
    height: 'auto',
  }),
  placeholder: '',
})
const code = computed(() => props.code)
const themes = { oneDark } as any
const languages = {
  java: java(),
  Javascript: javascript(),
} as any
const extensions = computed(() => {
  const result = []
  if (props.mode) {
    result.push(languages[props.mode])
  }
  if (props.theme) {
    result.push(themes[props.theme])
  }
  return result
})
onMounted(() => {
})
</script>

<template>
  <div class="code-edit">
    <Codemirror
      v-model="code"
      :autofocus="config.autofocus"
      :disabled="config.disabled"
      :extensions="extensions"
      :placeholder="placeholder"
      :style="{
        width: '100%',
        height: config.height,
        backgroundColor: '#fff',
        color: '#333',
      }"
      :tab-size="config.tabSize"
    />
  </div>
</template>

<style scoped>
.code-edit {
  display: flex;
  max-width: 100%;
}
</style>
