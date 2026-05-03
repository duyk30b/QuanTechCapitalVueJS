<script setup lang="ts">
import { VueButton } from '@/common'
import MonacoEditor from '@/common/monaco-editor/MonacoEditor.vue'
import { InputDate, InputNumber, InputSelect, InputText } from '@/common/vue-form'
import { ModalStore } from '@/common/vue-modal/vue-modal.store'
import { EaMql5, EaMql5Api, EaMql5Status } from '@/modules/ea_mql5'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eaMql5OldRef, eaMql5Ref } from './ea_mql5_ref'
import { AlertStore } from '@/common/vue-alert'
import { SettingKey, SettingService } from '@/modules/setting'
import { ESTimer } from '@/utils'

const route = useRoute()
const router = useRouter()

const messageSuccess = ref<string[]>([])
const messageError = ref<string[]>([])

const saveLoading = ref(false)
const compileLoading = ref(false)
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

const iniConfigText = computed(() => {
  return `[Common]
Login=${mt5Login.value}
Password=${mt5Password.value}
Server=${mt5Server.value}
AutoConfiguration=false

[Tester]
Expert=PYTHON_SERVER\\${eaMql5Ref.value.id}\\${eaMql5Ref.value.id}.ex5
Symbol=${eaMql5Ref.value.configIni.symbol || ''}
Period=${eaMql5Ref.value.configIni.period || ''}
FromDate=${ESTimer.timeToText(eaMql5Ref.value.configIni.fromDate, 'YYYY.MM.DD') || ''}
ToDate=${ESTimer.timeToText(eaMql5Ref.value.configIni.toDate, 'YYYY.MM.DD') || ''}
Deposit=${eaMql5Ref.value.configIni.deposit || 0}
Currency=${eaMql5Ref.value.configIni.currency || ''}
Leverage=${eaMql5Ref.value.configIni.leverage || 0}
Model=${eaMql5Ref.value.configIni.model || 0}
Optimization=${eaMql5Ref.value.configIni.optimization || 0}
OptimizationCriterion=${eaMql5Ref.value.configIni.optimizationCriterion || 0}
ExecutionMode=0
ForwardMode=0
Report=MQL5\\Experts\\PYTHON_SERVER\\${eaMql5Ref.value.id}\\Report\\report
ReplaceReport=1
ShutdownTerminal=true
Visual=false

[TesterInputs]
lot=0.1||0.1||0.1||1.000000||Y
`
})

const hasChangeData = computed(() => {
  if (!EaMql5.equal(eaMql5OldRef.value, eaMql5Ref.value)) {
    return true
  }
  return false
})

const handleClickSave = async () => {
  try {
    saveLoading.value = true
    let eaMql5Response: EaMql5
    if (!eaMql5Ref.value.id) {
      eaMql5Response = await EaMql5Api.createOne({ eaMql5: eaMql5Ref.value })
      router.push({ name: 'EaMql5Action', params: { id: eaMql5Response.id } })
    } else {
      eaMql5Response = await EaMql5Api.updateOne(eaMql5Ref.value.id, {
        eaMql5: eaMql5Ref.value,
      })
    }

    eaMql5OldRef.value = EaMql5.from(eaMql5Response)
    eaMql5Ref.value = EaMql5.from(eaMql5Response)
  } catch (error: any) {
    console.log('🚀 ~ EaMql5CompileAndTest.vue:79 ~ handleClickSave ~ error:', error)
  } finally {
    saveLoading.value = false
  }
}

const handleClickCompile = async () => {
  compileLoading.value = true
  try {
    const response = await EaMql5Api.startCompile({ eaMql5: eaMql5Ref.value })
    if (response.compileSuccess) {
      messageSuccess.value = response.logs
      messageError.value = []

      eaMql5OldRef.value = EaMql5.from(response.eaMql5)
      eaMql5Ref.value = EaMql5.from(response.eaMql5)
    } else {
      messageSuccess.value = []
      messageError.value = response.logs
    }
  } catch (error: any) {
    console.log('🚀 ~ EaMql5CompileAndTest.vue:77 ~ handleClickCompile ~ error:', error)
  } finally {
    compileLoading.value = false
  }
}

const handleStartRunTest = async () => {
  try {
    await EaMql5Api.startRunTest(eaMql5OldRef.value.id, iniConfigText.value)
    AlertStore.addSuccess('Đã bắt đầu chạy test')
  } catch (error: any) {
    console.log('🚀 ~ EaMql5CompileAndTest.vue:88 ~ handleStartRunTest ~ error:', error)
  }
}
</script>

<template>
  <form @submit.prevent="handleClickSave">
    <!-- <div class="mt-4">{{ JSON.stringify(eaMql5Ref, null, 2) }}</div> -->
    <div class="mt-4">
      <div>
        <span>Tên EA</span>
        <span v-if="eaMql5Ref.id" class="ml-2">(id: {{ eaMql5Ref.id }})</span>
      </div>
      <div>
        <InputText v-model:value="eaMql5Ref.name" required />
      </div>
    </div>

    <div class="mt-4">
      <div>Mô tả</div>
      <div>
        <InputText v-model:value="eaMql5Ref.description" />
      </div>
    </div>

    <div class="mt-4 flex flex-col">
      <div>MQL5 Code</div>
      <div style="flex-grow: 1; border: 1px solid #cdcdcd; height: 300px">
        <MonacoEditor v-model:value="eaMql5Ref.mql5Code" language="cpp" />
      </div>

      <div class="mt-4">
        <div v-if="messageSuccess.length" class="p-2 bg-green-100 text-green-700">
          <div
            v-for="(message, index) in messageSuccess"
            :key="index"
            style="overflow-wrap: anywhere"
          >
            {{ message }}
          </div>
        </div>
        <div v-if="messageError.length" class="p-2 bg-red-100 text-red-700">
          <div
            v-for="(message, index) in messageError"
            :key="index"
            style="overflow-wrap: anywhere"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <div class="flex flex-wrap gap-4">
        <div style="flex-grow: 1" class="w-full lg:w-0.5 flex flex-wrap gap-4">
          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>Symbol</div>
            <div><InputText v-model:value="eaMql5Ref.configIni.symbol" /></div>
          </div>

          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>Period</div>
            <div><InputText v-model:value="eaMql5Ref.configIni.period" /></div>
          </div>
          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>From Date</div>
            <div>
              <InputDate v-model:value="eaMql5Ref.configIni.fromDate" typeParser="number" />
            </div>
          </div>

          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>To Date</div>
            <div>
              <InputDate v-model:value="eaMql5Ref.configIni.toDate" typeParser="number" />
            </div>
          </div>
          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>Deposit</div>
            <div class="flex">
              <div style="flex-grow: 1">
                <InputNumber v-model:value="eaMql5Ref.configIni.deposit" />
              </div>
              <div style="width: 120px">
                <InputSelect
                  v-model:value="eaMql5Ref.configIni.currency"
                  :options="[
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                  ]"
                />
              </div>
            </div>
          </div>

          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>Leverage</div>
            <div><InputNumber v-model:value="eaMql5Ref.configIni.leverage" /></div>
          </div>

          <div style="flex-basis: 90%; min-width: 150px; flex-grow: 1">
            <div>Modelling</div>
            <div>
              <InputSelect
                v-model:value="eaMql5Ref.configIni.model"
                :options="[
                  { label: 'Every tick', value: 0 },
                  { label: 'Every tick based on real ticks', value: 4 },
                  { label: '1 minute OHLC', value: 1 },
                  { label: 'Open prices only', value: 2 },
                  { label: 'Math calculations', value: 3 },
                ]"
              />
            </div>
          </div>

          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>Optimization</div>
            <div>
              <InputSelect
                v-model:value="eaMql5Ref.configIni.optimization"
                :options="[
                  { label: 'Disabled', value: 0 },
                  { label: 'Slow complete algorithm', value: 1 },
                  { label: 'Fast genetic based algorithm', value: 2 },
                  { label: 'All symbols selected in Market Watch', value: 3 },
                ]"
              />
            </div>
          </div>
          <div style="flex-basis: 40%; min-width: 150px; flex-grow: 1">
            <div>Optimization Criterion</div>
            <div>
              <InputSelect
                v-model:value="eaMql5Ref.configIni.optimizationCriterion"
                :options="[
                  { label: 'Balance max', value: 0 },
                  { label: 'Profit Factor max', value: 1 },
                  { label: 'Expected Payoff max', value: 2 },
                  { label: 'Drawdown min', value: 3 },
                  { label: 'Recovery Factor max', value: 4 },
                  { label: 'Sharpe Ratio max', value: 5 },
                  { label: 'Custom max', value: 6 },
                  { label: 'Complex Criterion max', value: 7 },
                ]"
              />
            </div>
          </div>
        </div>
        <div style="flex-grow: 1; min-height: 300px" class="w-full lg:w-0.5 flex flex-col">
          <div class="">Config file</div>
          <div style="flex-grow: 1; border: 1px solid #cdcdcd">
            <MonacoEditor :value="iniConfigText" language="ini" readOnly />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-4">
      <VueButton
        style="margin-left: auto"
        color="blue"
        type="button"
        icon="send"
        :disabled="hasChangeData || !eaMql5Ref.id || ![EaMql5Status.Compiled].includes(eaMql5Ref.status)"
        @click="handleStartRunTest"
        :loading="runTestLoading"
      >
        Run Test
      </VueButton>

      <VueButton
        color="blue"
        type="button"
        icon="send"
        :disabled="
          hasChangeData || !eaMql5Ref.id || ![EaMql5Status.Init].includes(eaMql5Ref.status)
        "
        @click="handleClickCompile"
        :loading="compileLoading"
      >
        <span>Compile</span>
      </VueButton>

      <VueButton
        color="blue"
        type="submit"
        :loading="saveLoading"
        icon="save"
        :disabled="
          !hasChangeData || ![EaMql5Status.Init, EaMql5Status.Compiled].includes(eaMql5Ref.status)
        "
      >
        Save
      </VueButton>
    </div>
  </form>
</template>

<style></style>
