import axios, { type AxiosRequestConfig } from 'axios'
import { reactive } from 'vue'
import { AlertStore } from '../common/vue-alert/vue-alert.store'
import { CONFIG } from '../config'
import { AuthService } from '../modules/auth/auth.service'
import { DeviceInstance } from './device.instance'
import { LocalStorageService } from './local-storage.service'

axios.defaults.headers.common['X-OS'] = DeviceInstance.platform
axios.defaults.headers.common['X-Browser'] = DeviceInstance.browser
axios.defaults.headers.common['X-Mobile'] = DeviceInstance.mobile
axios.defaults.headers.common['X-Client-Id'] = CONFIG.CLIENT_ID

const AxiosLoading = reactive({ percent: 0, loading: true })

const AxiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
})

AxiosInstance.interceptors.request.use(
  async (config) => {
    const controller = new AbortController()
    config.signal = controller.signal

    // nếu refreshToken sắp hết hạn thì logout (cho hết hạn trước 60s)
    if (
      !LocalStorageService.getAccessToken() ||
      !LocalStorageService.getRefreshToken() ||
      LocalStorageService.getRefreshExp() - 60 * 1000 < Date.now()
    ) {
      AuthService.removeAuth()
      controller.abort()
      return config
    }
    // nếu accessToken sắp hết hạn (cho hết hạn trước 10s)
    if (LocalStorageService.getAccessExp() - 10 * 1000 < Date.now()) {
      await AuthService.refreshToken()
    }

    config.headers!['Authorization'] = `Bearer ${LocalStorageService.getAccessToken()}`

    AxiosLoading.percent = 40
    AxiosLoading.loading = true
    return config
  },
  (error) => Promise.reject(error),
)

AxiosInstance.interceptors.response.use(
  (response) => {
    AxiosLoading.percent = 100
    setTimeout(() => (AxiosLoading.loading = false), 300)
    return response
  },
  async (error: any) => {
    if (error?.response?.status === 401) {
      await AuthService.removeAuth()
      return Promise.reject()
    }
    if (error?.response?.status === 440) {
      const originalRequest: AxiosRequestConfig = error.config
      await AuthService.refreshToken()
      if (!LocalStorageService.getAccessToken()) {
        return Promise.reject()
      }
      originalRequest!.headers!['Authorization'] = `Bearer ${LocalStorageService.getAccessToken()}`
      return AxiosInstance(originalRequest)
    }
    if (error?.response?.status === 403) {
      AlertStore.add({ type: 'error', message: 'Bạn không có quyền thực hiện hành động này', time: 5000 })
    }
    const message = error?.response?.data?.message || error?.response?.data?.detail || error.message || error?.config.signal?.reason
    if (message !== 'canceled') {
      if (error?.response?.status === 422) {
        AlertStore.add({ type: 'warning', message, time: 5000 })
      } else {
        AlertStore.add({ type: 'error', message, time: 5000 })
      }
      AxiosLoading.percent = 0
      AxiosLoading.loading = false
    }

    return Promise.reject(error)
  },
)

export { AxiosInstance, AxiosLoading }
