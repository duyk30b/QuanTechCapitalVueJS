<script setup lang="ts">
import { IconRight } from '@/common/icon-antd'
import { ModalStore } from '@/common/vue-modal/vue-modal.store'
import { VueTabMenu, VueTabPanel, VueTabs } from '@/common/vue-tabs'
import { EaMql5, EaMql5Api } from '@/modules/ea_mql5'
import { Breadcrumb } from '@/views/component'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eaMql5OldRef, eaMql5Ref } from './ea_mql5_ref'
import EaMql5CompileAndTest from './EaMql5CompileAndTest.vue'
import EaMql5RunTest from './EaMql5RunTest.vue'
import MT5ProcessStatus from '@/views/component/MT5ProcessStatus.vue'

const TABS_KEY = {
  EA_COMPILE_AND_TEST: 'EA_COMPILE_AND_TEST',
  EA_REPORT: 'EA_REPORT',
}

const activeTab = ref(TABS_KEY.EA_COMPILE_AND_TEST)

const route = useRoute()
const router = useRouter()

const startFetchEaMql5 = async (eaMql5Id?: string) => {
  if (!eaMql5Id) {
    eaMql5OldRef.value = EaMql5.blank()
    eaMql5Ref.value = EaMql5.blank()
  } else {
    const eaMql5OldResponse = await EaMql5Api.detail(eaMql5Id, {
      relation: { user: true },
    })
    eaMql5OldRef.value = eaMql5OldResponse
    eaMql5Ref.value = EaMql5.from(eaMql5OldRef.value)
  }
}

onBeforeMount(async () => {
  const eaMql5Id = String(route.params.id || '')
  try {
    await startFetchEaMql5(eaMql5Id)
  } catch (error) {
    console.log('🚀 ~ EaMql5UpsertContainer.vue:56 ~ onBeforeMount ~ error:', error)
  }
})

const clickDelete = () => {
  ModalStore.confirm({
    title: 'Bạn có chắc chắn muốn xóa EA MQL5 này',
    content: 'EA MQL5 đã xóa không thể khôi phục lại được. Bạn vẫn muốn xóa ?',
    async onOk() {
      try {
        await EaMql5Api.destroyOne(eaMql5Ref.value.id)
        router.push({ name: 'EaMql5List' })
      } catch (error) {
        console.log('🚀 ~ EaMql5UpsertContainer.vue:108 ~ onOk ~ error:', error)
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
      <span>{{ eaMql5Ref.name }}</span>
    </div>
    <div class="ml-auto flex items-center gap-8">
      <MT5ProcessStatus />
    </div>
  </div>

  <div class="md:mx-4 mt-4 p-4 bg-white">
    <VueTabs v-model:tabShow="activeTab">
      <template #menu>
        <VueTabMenu :tabKey="TABS_KEY.EA_COMPILE_AND_TEST">Compile And Test</VueTabMenu>
        <VueTabMenu :tabKey="TABS_KEY.EA_REPORT">Report</VueTabMenu>
      </template>
      <template #panel>
        <VueTabPanel :tabKey="TABS_KEY.EA_COMPILE_AND_TEST">
          <EaMql5CompileAndTest />
        </VueTabPanel>
        <VueTabPanel :tabKey="TABS_KEY.EA_REPORT">
          <EaMql5RunTest />
        </VueTabPanel>
      </template>
    </VueTabs>
  </div>
</template>

<style></style>
