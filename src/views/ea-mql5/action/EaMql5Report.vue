<script setup lang="ts">
import { VueButton } from '@/common'
import MonacoEditor from '@/common/monaco-editor/MonacoEditor.vue'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import { InputDate, InputText } from '@/common/vue-form'
import InputNumber from '@/common/vue-form/InputNumber.vue'
import { EaMql5Api } from '@/modules/ea_mql5'
import { SettingKey, SettingService } from '@/modules/setting'
import { ESTimer } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eaMql5Ref } from './ea_mql5_ref'

const route = useRoute()
const router = useRouter()

const messageSuccess = ref<string[]>([])
const messageError = ref<string[]>([])

const runTestLoading = ref(false)

const mt5Login = ref<string>('')
const mt5Password = ref<string>('')
const mt5Server = ref<string>('')

onMounted(async () => {
  mt5Login.value =
    (await SettingService.getOne({ filter: { key: SettingKey.MT5_LOGIN } })).value || ''
  mt5Password.value =
    (await SettingService.getOne({ filter: { key: SettingKey.MT5_PASSWORD } })).value || ''
  mt5Server.value =
    (await SettingService.getOne({ filter: { key: SettingKey.MT5_SERVER } })).value || ''
})

const iniConfig = computed(() => {
  return `[Common]
Login=${mt5Login.value}
Password=${mt5Password.value}
Server=${mt5Server.value}
AutoConfiguration=false

[Tester]
Expert=${eaMql5Ref.value.name}.ex5
Symbol=${eaMql5Ref.value.configIni.symbol || ''}
Period=${eaMql5Ref.value.configIni.period || ''}
Model=0
ExecutionMode=0
Optimization=false
FromDate=${ESTimer.timeToText(eaMql5Ref.value.configIni.fromDate, 'YYYY.MM.DD') || ''}
ToDate=${ESTimer.timeToText(eaMql5Ref.value.configIni.toDate, 'YYYY.MM.DD') || ''}
ForwardMode=false
Deposit=${eaMql5Ref.value.configIni.deposit || 0}
Currency=${eaMql5Ref.value.configIni.currency || ''}
Leverage=${eaMql5Ref.value.configIni.leverage || 0}
Report=report.html
ReplaceReport=false
ShutdownTerminal=false
Visual=false
`
})

const handleStartRunTest = async () => {
  try {
    AlertStore.addSuccess('Đã bắt đầu chạy test')
  } catch (error: any) {
    console.log('🚀 ~ EaMql5UpsertContainer.vue:88 ~ handleStartRunTest ~ error:', error)
  }
}

const handleStopRunTest = async () => {
  try {
    await EaMql5Api.stopRunTest(eaMql5Ref.value.id)
    AlertStore.addSuccess('Đã dừng chạy test')
  } catch (error: any) {
    console.log('🚀 ~ EaMql5UpsertContainer.vue:97 ~ handleStopRunTest ~ error:', error)
  }
}
</script>

<template>
  <div>Report Content</div>
</template>

<style></style>
