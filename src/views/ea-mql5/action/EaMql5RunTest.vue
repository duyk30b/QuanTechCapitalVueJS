<script setup lang="ts">
import { VueButton } from '@/common'
import { IconRight } from '@/common/icon-antd'
import MonacoEditor from '@/common/monaco-editor/MonacoEditor.vue'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import { InputDate, InputText } from '@/common/vue-form'
import { ModalStore } from '@/common/vue-modal/vue-modal.store'
import { VueTabMenu, VueTabPanel, VueTabs } from '@/common/vue-tabs'
import { useSettingStore } from '@/modules/_me/setting.store'
import { EaMql5, EaMql5Api } from '@/modules/ea_mql5'
import { Breadcrumb } from '@/views/component'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eaMql5OldRef, eaMql5Ref } from './ea_mql5_ref'
import { SettingKey, SettingService } from '@/modules/setting'
import { ESTimer } from '@/utils'
import InputNumber from '@/common/vue-form/InputNumber.vue'

const settingStore = useSettingStore()

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
  <form @submit.prevent="handleStartRunTest">
    <div class="mt-4 flex flex-wrap gap-4">
      <div>
        <div>From Date</div>
        <div><InputDate v-model:value="eaMql5Ref.configIni.fromDate" /></div>
      </div>

      <div>
        <div>To Date</div>
        <div><InputDate v-model:value="eaMql5Ref.configIni.toDate" /></div>
      </div>

      <div>
        <div>Symbol</div>
        <div><InputText v-model:value="eaMql5Ref.configIni.symbol" /></div>
      </div>

      <div>
        <div>Period</div>
        <div><InputText v-model:value="eaMql5Ref.configIni.period" /></div>
      </div>

      <div>
        <div>Deposit</div>
        <div><InputNumber v-model:value="eaMql5Ref.configIni.deposit" /></div>
      </div>

      <div>
        <div>Currency</div>
        <div><InputText v-model:value="eaMql5Ref.configIni.currency" /></div>
      </div>

      <div>
        <div>Leverage</div>
        <div><InputNumber v-model:value="eaMql5Ref.configIni.leverage" /></div>
      </div>
    </div>

    <div style="height: 500px" class="mt-4 flex flex-col">
      <div>MQL5 Config Ini</div>
      <div style="flex-grow: 1; border: 1px solid #cdcdcd">
        <MonacoEditor :value="iniConfig" language="ini" readOnly />
      </div>
    </div>

    <div class="mt-8 flex gap-4">
      <VueButton
        style="margin-left: auto"
        color="blue"
        type="button"
        icon="send"
        @click="handleStartRunTest"
        :loading="runTestLoading"
      >
        Run Test
      </VueButton>
    </div>
  </form>
</template>

<style></style>
