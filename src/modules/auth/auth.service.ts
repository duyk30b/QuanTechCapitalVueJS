import { CONFIG } from '@/config'
import { IndexedDBConnection } from '@/core/indexed-db'
import { AlertStore } from '../../common/vue-alert/vue-alert.store'
import { LocalStorageService } from '../../core/local-storage.service'
import { reconnectSocket } from '../../core/socket/socket.base'
import { Router } from '../../router/router'
import { MeService } from '../_me/me.service'
import { AuthApi } from './auth.api'
import type { LoginDto, LoginRootDto } from './auth.dto'

export class AuthService {
  static async login(body: LoginDto) {
    try {
      const data = await AuthApi.login(body)
      LocalStorageService.setToken(data)
      MeService.user.value = data.user
      reconnectSocket()
      return true
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || error?.config.signal?.reason
      AlertStore.addError(message)
    }
  }

  static async loginRoot(body: LoginRootDto) {
    try {
      const data = await AuthApi.loginRoot(body)
      LocalStorageService.setToken(data)
      MeService.user.value = data.user
      reconnectSocket()
      return true
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || error?.config.signal?.reason
      AlertStore.addError(message)
    }
  }



  static logout = (() => {
    const start = async (msg: string) => {
      const uid = MeService.user.value?.id
      LocalStorageService.removeToken()
      MeService.user.value = null // khai báo trước Router push Login
      Router.push({ name: 'Login' })
      AlertStore.addError(msg, 2000)
      try {
        await IndexedDBConnection.clear()
        if (uid) {
          await AuthApi.logout({ uid, clientId: CONFIG.CLIENT_ID })
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error.message || error?.config.signal?.reason
        AlertStore.addError(message)
      }
    }
    let fetching: any = null
    return async (msg: string) => {
      if (!fetching) fetching = start(msg)
      await fetching
      fetching = null
    }
  })()

  static refreshToken = (() => {
    const start = async () => {
      try {
        const refreshToken = LocalStorageService.getRefreshToken()
        if (!refreshToken) throw new Error()
        const data = await AuthApi.refreshToken(refreshToken)
        LocalStorageService.setAccessToken(data)
      } catch (error: any) {
        console.log('🚀 ~ file: auth.service.ts:111 ~ AuthService ~ start ~ error:', error)
        await AuthService.logout('Phiên đã hết hạn, vui lòng đăng nhập lại')
      }
    }
    let fetching: any = null
    return async () => {
      if (!fetching) fetching = start()
      await fetching
      fetching = null
    }
  })()
}
