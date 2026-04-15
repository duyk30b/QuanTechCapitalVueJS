<script setup lang="ts">
import { IconDoorOpen } from '@/common/icon-google'
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import {
  IconApartment,
  IconAppstore,
  IconAreaChart,
  IconCalendar,
  IconContacts,
  IconControl,
  IconDollar,
  IconHome,
  IconPicCenter,
  IconShop,
  IconTeam,
} from '../../common/icon-antd'
import { MeService } from '../../modules/_me/me.service'
import { PermissionId } from '../../modules/permission/permission.enum'
import { UserType } from '@/modules/user'

const props = defineProps<{ collapsed?: boolean }>()
const { userPermission, user } = MeService

const emit = defineEmits(['handleShowDrawer'])
const router = useRouter()

const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])

watchEffect(() => {
  const currentRoute = router.currentRoute.value
  // slice 1 vì vị trí 0 là Home
  const openRouterName = currentRoute.matched.slice(1).map((routeItem) => {
    if (routeItem.meta.menuKey && typeof routeItem.meta.menuKey === 'function') {
      return routeItem.meta.menuKey(routeItem, currentRoute.params)
    }
    return routeItem.name
  })
  selectedKeys.value = openRouterName as string[]
  if (props.collapsed === false) {
    openKeys.value = openRouterName as string[]
  }
})

const handleMenuClick = (menu: { key: string; keyPath: string[] }) => {
  // router.push({ name: menu.key, params: {} })
  openKeys.value = menu.keyPath
  emit('handleShowDrawer', false)
}
</script>

<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    theme="light"
    mode="inline"
    :inline-collapsed="false"
    :openKeys="openKeys"
    @click="handleMenuClick"
  >
    <a-menu-item key="AppHome">
      <template #icon><IconHome /></template>
      <span><router-link :to="{ name: 'AppHome' }">Home</router-link></span>
    </a-menu-item>

    <a-sub-menu
      v-if="user?.userType === UserType.Root || user?.userType === UserType.Admin"
      key="User"
    >
      <template #icon>
        <IconTeam />
      </template>
      <template #title>Nhân viên</template>
      <a-menu-item key="Role">
        <router-link :to="{ name: 'Role' }">Vai trò</router-link>
      </a-menu-item>
      <a-menu-item key="Account">
        <router-link :to="{ name: 'Account' }">Tài khoản</router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="Systems">
      <template #icon>
        <IconControl />
      </template>
      <template #title>Hệ thống</template>
      <a-menu-item key="UserInfo">
        <router-link :to="{ name: 'UserInfo' }">Thông tin cá nhân</router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu v-if="user?.userType === UserType.Root" key="ROOT">
      <template #icon>
        <IconApartment />
      </template>
      <template #title>ROOT</template>
      <a-menu-item key="RootData">
        <router-link :to="{ name: 'RootData' }">Data</router-link>
      </a-menu-item>
      <a-menu-item key="SystemLog">
        <router-link :to="{ name: 'SystemLog' }">System Log</router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
