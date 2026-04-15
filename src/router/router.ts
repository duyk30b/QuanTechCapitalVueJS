import { createRouter, createWebHistory, type RouteLocationNormalizedLoaded } from 'vue-router'
import { MeService } from '../modules/_me/me.service'
import { AuthService } from '../modules/auth/auth.service'

enum AuthLevel {
  GUEST = 'GUEST',
  USER = 'USER',
  ROOT = 'ROOT',
}

const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AppContainer',
      component: () => import('../views/AppContainer.vue'),
      meta: { auth: AuthLevel.USER },
      children: [
        {
          path: '',
          name: 'AppHome',
          component: () => import('../views/AppHome.vue'),
          meta: { title: 'Trang chủ' },
        },
        {
          path: 'user',
          name: 'User',
          children: [
            {
              path: 'account',
              meta: { title: 'Tài khoản' },
              name: 'Account',
              component: () => import('../views/user/account/AccountList.vue'),
            },
            {
              path: 'role',
              name: 'Role',
              meta: { title: 'Vai trò' },
              redirect: () => ({ name: 'RoleList' }),
              children: [
                {
                  path: 'list',
                  name: 'RoleList',
                  component: () => import('../views/user/role/RoleList.vue'),
                },
                {
                  path: 'upsert/:id?',
                  name: 'RoleUpsert',
                  component: () => import('../views/user/role/upsert/RoleUpsertContainer.vue'),
                  meta: {
                    title: (route: RouteLocationNormalizedLoaded) => {
                      if (route.params.id) return 'Cập nhật vai trò'
                      return 'Tạo mới vai trò'
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          path: 'systems',
          name: 'Systems',
          children: [
            {
              path: 'user-info',
              name: 'UserInfo',
              component: () => import('../views/systems/UserInfo.vue'),
              meta: { title: 'Hệ thống' },
            },
          ],
        },
        {
          path: '/root',
          name: 'ROOT',
          meta: { auth: AuthLevel.ROOT },
          children: [
            {
              path: 'data',
              name: 'RootData',
              component: () => import('../views/root/RootData.vue'),
              meta: { title: 'Data' },
            },
            {
              path: 'system-log',
              name: 'SystemLog',
              component: () => import('../views/root/system-log/SystemLogList.vue'),
              meta: { title: 'Data' },
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      meta: { auth: AuthLevel.GUEST },
      component: () => import('../views/auth/AuthContainer.vue'),
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('../views/auth/Login.vue'),
        },
      ],
    },
    {
      path: '/privacy',
      component: () => import('../views/AppPrivacy.vue'),
    },
    {
      path: '/term',
      component: () => import('../views/AppTerm.vue'),
    },
    // Route bắt tất cả và redirect về trang chủ
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

Router.beforeEach((to, from, next) => {
  const { user } = MeService

  // if (to.meta.auth === AuthLevel.ROOT && meStore.user?.oid !== 0) {
  //   AuthService.logout()
  //   return next({ name: 'Login' })
  // }

  if (to.meta.auth === AuthLevel.USER && !user.value) {
    AuthService.logout('Tài khoản không hợp lệ, vui lòng đăng nhập lại !')
    return next({ name: 'Login' })
  }

  if (to.meta.auth === AuthLevel.GUEST && user.value) {
    return next({ name: 'AppHome' })
  }

  return next()
})

export { Router }
