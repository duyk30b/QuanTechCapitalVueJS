import axios from 'axios'
import { CONFIG } from '../../config'
import { User } from '../user'
import type { LoginDto, LoginRootDto } from './auth.dto'

export class AuthApi {
  static async login(body: LoginDto) {
    const response = await axios.post(`${CONFIG.API_URL}/auth/login`, body)
    const data = response.data as {
      user: any
      accessToken: string
      accessExp: number
      refreshToken: string
      refreshExp: number
    }
    return {
      user: User.from(data.user),
      accessToken: data.accessToken as string,
      accessExp: data.accessExp as number,
      refreshToken: data.refreshToken as string,
      refreshExp: data.refreshExp as number,
    }
  }

  static async loginRoot(body: LoginRootDto) {
    const response = await axios.post(`${CONFIG.API_URL}/auth/login_root`, body)
    const data = response.data as {
      user: any
      accessToken: string
      accessExp: number
      refreshToken: string
      refreshExp: number
    }
    return {
      user: User.from(data.user),
      accessToken: data.accessToken as string,
      accessExp: data.accessExp as number,
      refreshToken: data.refreshToken as string,
      refreshExp: data.refreshExp as number,
    }
  }

  static async refreshToken(refreshToken: string) {
    const response = await axios.post(`${CONFIG.API_URL}/auth/refresh_token`, { refreshToken })
    const data = response.data as { accessToken: string; accessExp: number }
    return data
  }

  static async logout(refreshToken: string) {
    console.log('🚀 ~ auth.api.ts:53 ~ AuthApi ~ logout ~ response:')
    const response = await axios.post(`${CONFIG.API_URL}/auth/logout`, { refreshToken })
    const data = response.data as { detail: string }
    return data
  }
}
