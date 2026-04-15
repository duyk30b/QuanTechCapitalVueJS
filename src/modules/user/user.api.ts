import { AxiosInstance } from '../../core/axios.instance'
import type { FullResponse } from '../_base/base-dto'
import { UserDetailQuery, UserGetQuery, UserListQuery, UserPaginationQuery } from './user.dto'
import { User } from './user.model'

export class UserApi {
  static async pagination(options: UserPaginationQuery) {
    const params = UserGetQuery.toQuery(options)

    const response = await AxiosInstance.get('/user/pagination', { params })
    const data = response.data 

    return {
      userList: User.fromList(data.userList),
      total: data.total,
      page: data.page,
      limit: data.limit,
    }
  }

  static async list(options: UserListQuery): Promise<User[]> {
    const params = UserGetQuery.toQuery(options)

    const response = await AxiosInstance.get('/user/list', { params })
    const data = response.data as { userList: any[] }
    return User.fromList(data.userList)
  }

  static async detail(id: number, options?: UserDetailQuery): Promise<User> {
    const params = UserGetQuery.toQuery(options || {})

    const response = await AxiosInstance.get(`/user/detail/${id}`, { params })
    const { data } = response.data as FullResponse<{ user: any }>
    return User.from(data.user)
  }

  static async createOne(body: {
    user: User
    roleIdList: number[]
    account: { username: string; password: string }
  }) {
    const { user, account, roleIdList } = body
    const response = await AxiosInstance.post('/user/create', {
      user: {
        fullName: user.fullName,
        isActive: user.isActive,
      },
      account: {
        username: account.username,
        password: account.password,
      },
      roleIdList,
    })
    const data = response.data as { user: any }
    return User.from(data.user)
  }

  static async updateOne(
    id: number,
    body: {
      user: User
      account?: { username: string; password: string }
      roleIdList?: number[]
    },
  ) {
    const { user, account, roleIdList } = body
    const response = await AxiosInstance.post(`/user/update/${id}`, {
      user: {
        fullName: user.fullName,
        isActive: user.isActive,
      },
      account,
      roleIdList,
    })
    const data = response.data as { user: any }
    return User.from(data.user)
  }

  static async deleteOne(id: number) {
    const response = await AxiosInstance.post(`/user/delete/${id}`)
    const data = response.data as { userId: number }
    return data
  }

  static async deviceLogout(userId: number, clientId: string) {
    const response = await AxiosInstance.post(`/user/device-logout/${userId}`, { clientId })
    const { data } = response.data as FullResponse
    return data
  }
}
