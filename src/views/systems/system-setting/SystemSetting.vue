<script setup lang="ts">
import { IconSetting } from '@/common/icon-antd'
import { InputText } from '@/common/vue-form'
import VueButton from '@/common/VueButton.vue'
import { CONFIG } from '@/config'
import { SettingApi } from '@/modules/setting/setting.api'
import {
  Setting,
  SettingKey,
  SettingKeyExampleMap,
  SettingKeyLabelMap,
} from '@/modules/setting/setting.model'
import { ESTypescript } from '@/utils'
import { BugDevelopment } from '@/views/component'
import Breadcrumb from '@/views/component/Breadcrumb.vue'
import { onBeforeMount, ref } from 'vue'

const settingMapOld: Partial<Record<SettingKey, Setting>> = {}
const settingMap = ref<Partial<Record<SettingKey, Setting>>>({})

ESTypescript.valuesEnum(SettingKey).forEach((value) => {
  settingMapOld[value] = Setting.blank()
  settingMap.value[value] = Setting.blank()
})

const fetchData = async () => {
  const settingList = await SettingApi.list({})
  settingList.forEach((setting) => {
    settingMapOld[setting.key] = setting
    settingMap.value[setting.key] = Setting.from(setting)
  })
}

onBeforeMount(async () => {
  await fetchData()
})

const handleUpsertSetting = async (settingKey: SettingKey, setting: Setting) => {
  await SettingApi.upsert(settingKey, setting)
  await fetchData()
}
</script>

<template>
  <div class="mx-4 mt-4 gap-4 flex items-center">
    <div class="hidden md:block">
      <Breadcrumb />
    </div>
  </div>

  <div class="mt-4 md:mx-4 p-4 bg-white">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-if="CONFIG.MODE === 'development'"></th>
            <th>Cài đặt</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(setting, key, index) in settingMap" :key="key">
            <td v-if="CONFIG.MODE === 'development'" style="text-align: center">
              <BugDevelopment :data="{ key, setting }" />
            </td>
            <td>
              <div>{{ index + 1 }}. {{ SettingKeyLabelMap[key] }}: ({{ key }})</div>
              <div style="font-style: italic; font-size: 0.9em">
                Example: {{ SettingKeyExampleMap[key] }}
              </div>
              <div>
                <InputText v-model:value="setting!.value" />
              </div>
            </td>
            <td style="vertical-align: bottom">
              <VueButton
                color="blue"
                type="button"
                icon="save"
                :disabled="Setting.equal(setting!, settingMapOld[key]!)"
                @click="handleUpsertSetting(key, setting!)"
              >
                Save
              </VueButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
