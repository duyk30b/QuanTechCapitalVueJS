<script setup lang="ts">
import { VueButton } from '@/common'
import { IconRight } from '@/common/icon-antd'
import MonacoEditor from '@/common/monaco-editor/MonacoEditor.vue'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import { InputText } from '@/common/vue-form'
import { ModalStore } from '@/common/vue-modal/vue-modal.store'
import { VueTabMenu, VueTabPanel, VueTabs } from '@/common/vue-tabs'
import { useSettingStore } from '@/modules/_me/setting.store'
import { EaMql5, EaMql5Api } from '@/modules/ea_mql5'
import { Breadcrumb } from '@/views/component'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const TABS_KEY = {
  EA_INFORMATION: 'EA_INFORMATION',
  EA_SETTING: 'EA_SETTING',
}

const activeTab = ref(TABS_KEY.EA_INFORMATION)

const settingStore = useSettingStore()
const { isMobile } = settingStore

const route = useRoute()
const router = useRouter()

const eaMql5 = ref<EaMql5>(EaMql5.blank())

const saveLoading = ref(false)

const startFetchEaMql5 = async (eaMql5Id?: string) => {
  if (!eaMql5Id) return

  eaMql5.value = await EaMql5Api.detail(eaMql5Id, {
    relation: { user: true },
  })
}

onBeforeMount(async () => {
  const eaMql5Id = String(route.params.id || '')
  console.log('🚀 ~ EaMql5UpsertContainer.vue:46 ~ eaMql5Id:', eaMql5Id)
  try {
    await startFetchEaMql5(eaMql5Id)
  } catch (error) {
    console.log('🚀 ~ EaMql5UpsertContainer.vue:96 ~ onBeforeMount ~ error:', error)
  }
})

const handleSave = async () => {
  saveLoading.value = true
  try {
    if (!eaMql5.value.id) {
      await EaMql5Api.createOne({ eaMql5: eaMql5.value })
    } else {
      await EaMql5Api.updateOne(eaMql5.value.id, { eaMql5: eaMql5.value })
      AlertStore.addSuccess('Cập nhật EA MQL5 thành công')
    }
    // router.push({ name: 'EaMql5List' })
  } catch (error: any) {
    console.log('🚀 ~ EaMql5UpsertContainer.vue:64 ~ handleSave ~ error:', error)
    AlertStore.addError(error.message)
  } finally {
    saveLoading.value = false
  }
}

const clickDelete = () => {
  ModalStore.confirm({
    title: 'Bạn có chắc chắn muốn xóa EA MQL5 này',
    content: 'EA MQL5 đã xóa không thể khôi phục lại được. Bạn vẫn muốn xóa ?',
    async onOk() {
      try {
        await EaMql5Api.destroyOne(eaMql5.value.id)
        router.push({ name: 'EaMql5List' })
      } catch (error) {
        console.log('🚀 ~ file: EaMql5UpsertContainer.vue:82 ~ onOk ~ error:', error)
      }
    },
  })
}
</script>

<template>
  <div class="mx-4 mt-4 gap-4 flex items-center">
    <div class="hidden md:flex gap-2 items-center text-lg font-medium">
      <Breadcrumb />
      <IconRight style="font-size: 0.7em; opacity: 0.5" />
      <span>{{ eaMql5.name }}</span>
    </div>
    <div class="ml-auto flex items-center gap-8"></div>
  </div>

  <form class="md:mx-4 mt-4 p-4 bg-white" @submit.prevent="handleSave">
    <VueTabs v-model:tabShow="activeTab">
      <template #menu>
        <VueTabMenu :tabKey="TABS_KEY.EA_INFORMATION">Cơ bản</VueTabMenu>
        <VueTabMenu :tabKey="TABS_KEY.EA_SETTING">Cài đặt</VueTabMenu>
      </template>
      <template #panel>
        <VueTabPanel :tabKey="TABS_KEY.EA_INFORMATION">
          <div class="mt-4">
            <div>Tên EA</div>
            <div>
              <InputText v-model:value="eaMql5.name" required />
            </div>
          </div>

          <div class="mt-4">
            <div>Mô tả</div>
            <div>
              <InputText v-model:value="eaMql5.description" />
            </div>
          </div>

          <div style="height: 500px" class="mt-4 flex flex-col">
            <div>MQL5 Code</div>
            <div style="flex-grow: 1; border: 1px solid #cdcdcd">
              <MonacoEditor v-model:value="eaMql5!.mql5Code" language="cpp" />
            </div>
          </div>
        </VueTabPanel>
        <VueTabPanel :tabKey="TABS_KEY.EA_SETTING">
          <div class="mt-4"></div>
        </VueTabPanel>
      </template>
    </VueTabs>

    <div class="mt-8 flex gap-4">
      <VueButton color="red" type="button" @click="clickDelete">Xóa</VueButton>
      <VueButton
        color="blue"
        type="submit"
        :loading="saveLoading"
        icon="save"
        style="margin-left: auto"
      >
        Lưu lại
      </VueButton>
    </div>
  </form>
</template>

<style></style>
