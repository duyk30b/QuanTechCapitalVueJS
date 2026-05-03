<script setup lang="ts">
import { CONFIG } from '@/config'
import { onBeforeMount, ref } from 'vue'
import VueButton from '@/common/VueButton.vue'
import VuePagination from '@/common/VuePagination.vue'
import VueTag from '@/common/VueTag.vue'
import { IconApartment, IconDelete, IconForm } from '@/common/icon-antd'
import { InputSelect } from '@/common/vue-form'
import { MeService } from '@/modules/_me/me.service'
import { RoleApi, RoleService, type Role } from '@/modules/role'
import { EaMql5, EaMql5Api } from '@/modules/ea_mql5'
import BugDevelopment from '../component/BugDevelopment.vue'
import { ModalStore } from '@/common/vue-modal/vue-modal.store'
import Breadcrumb from '../component/Breadcrumb.vue'
import MT5ProcessStatus from '../component/MT5ProcessStatus.vue'

const eaMql5List = ref<EaMql5[]>([])

const dataLoading = ref(false)

const page = ref(1)
const limit = ref(Number(localStorage.getItem('DISTRIBUTOR_PAGINATION_LIMIT')) || 10)
const total = ref(0)
const { userPermission } = MeService

const startFetchData = async (options?: { refetch?: boolean }) => {
  try {
    dataLoading.value = true
    const response = await EaMql5Api.pagination({
      relation: { user: true },
      page: page.value,
      limit: limit.value,
      filter: {},
      sort: { id: 'DESC' },
    })
    eaMql5List.value = response.eaMql5List
    total.value = response.total
  } catch (error) {
    console.log('🚀 ~ file: EaMql5List.vue:35 ~ startFetchData ~ error:', error)
  }
}

onBeforeMount(async () => {
  await startFetchData({ refetch: true })
})

const changePagination = async (options: { page?: number; limit?: number }) => {
  if (options.page) page.value = options.page
  if (options.limit) {
    limit.value = options.limit
    localStorage.setItem('DISTRIBUTOR_PAGINATION_LIMIT', String(options.limit))
  }
  await startFetchData()
}

const clickDelete = (eaMql5RefId: string) => {
  ModalStore.confirm({
    title: 'Bạn có chắc chắn muốn xóa EA MQL5 này',
    content: 'EA MQL5 đã xóa không thể khôi phục lại được. Bạn vẫn muốn xóa ?',
    async onOk() {
      try {
        await EaMql5Api.destroyOne(eaMql5RefId)
        await startFetchData()
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
    </div>
    <div>
      <VueButton color="blue" icon="plus" @click="$router.push({ name: 'EaMql5Action' })">
        Thêm mới
      </VueButton>
    </div>
    <div class="ml-auto flex items-center gap-8">
      <MT5ProcessStatus />
    </div>
  </div>

  <div class="page-main">
    <div class="page-main-table table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-if="CONFIG.MODE === 'development'">ID</th>
            <th>Tên EA</th>
            <th>Mô tả</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="eaMql5List.length === 0">
            <td colspan="20" class="text-center">No data</td>
          </tr>
          <tr v-for="eaMql5 in eaMql5List" :key="eaMql5.id">
            <td v-if="CONFIG.MODE === 'development'" style="text-align: center">
              <BugDevelopment :data="eaMql5" />
            </td>
            <td>{{ eaMql5.name }}</td>
            <td>{{ eaMql5.description }}</td>
            <td class="text-center">
              <router-link :to="{ name: 'EaMql5Action', params: { id: eaMql5.id } }">
                <IconForm width="20px" height="20px" style="color: var(--text-orange)" />
              </router-link>
            </td>
            <td class="text-center">
              <div
                class="flex justify-center cursor-pointer"
                style="color: var(--text-red); font-size: 20px"
                @click="clickDelete(eaMql5.id)"
              >
                <IconDelete />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-4 flex flex-wrap justify-end gap-4">
      <VuePagination
        v-model:page="page"
        :total="total"
        :limit="limit"
        @update:page="(p: any) => changePagination({ page: p, limit })"
      />
      <InputSelect
        v-model:value="limit"
        @update:value="(l: any) => changePagination({ page, limit: l })"
        :options="[
          { value: 10, label: '10 / page' },
          { value: 20, label: '20 / page' },
          { value: 50, label: '50 / page' },
          { value: 100, label: '100 / page' },
        ]"
      />
    </div>
  </div>
</template>
