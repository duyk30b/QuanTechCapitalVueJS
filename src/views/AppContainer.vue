<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { RouterView } from 'vue-router'
import { LocalStorageService } from '../core/local-storage.service'
import { MeService } from '../modules/_me/me.service'
import { AuthService } from '../modules/auth/auth.service'
import VueLayout from './layout/VueLayout.vue'

const loaded = ref(false)

onBeforeMount(async () => {
  loaded.value = false
  try {
    if (
      !LocalStorageService.getRefreshToken ||
      LocalStorageService.getRefreshExp() - 60 * 1000 < Date.now()
    ) {
      await AuthService.logout('Container: Token đã hết hạn, vui lòng đăng nhập lại !')
    } else {
      await MeService.initData()
    }
  } catch (error) {
    console.log('🚀 ~ file: AppContainer.vue:26 ~ onBeforeMount ~ error:', error)
    await AuthService.logout('Container: Đã xảy ra lỗi, vui lòng đăng nhập lại !')
  } finally {
    loaded.value = true
  }
})
</script>

<template>
  <VueLayout v-if="loaded">
    <RouterView />
  </VueLayout>
</template>

<style></style>
