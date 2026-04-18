import { AxiosInstance } from '@/core/axios.instance'
import { EaMql5DetailQuery, EaMql5GetQuery, EaMql5ListQuery, type EaMql5PaginationQuery } from './ea_mql5.dto'
import { EaMql5 } from './ea_mql5.model'

export class EaMql5Api {
  static async pagination(options: EaMql5PaginationQuery) {
    const params = EaMql5GetQuery.toQuery(options)

    const response = await AxiosInstance.get('/ea_mql5/pagination', { params })
    const data = response.data
    return {
      eaMql5List: EaMql5.fromList(data.eaMql5List),
      total: data.total,
      page: data.page,
      limit: data.limit,
    }
  }

  static async list(options: EaMql5ListQuery): Promise<EaMql5[]> {
    const params = EaMql5GetQuery.toQuery(options)

    const response = await AxiosInstance.get('/ea_mql5/list', { params })
    const data = response.data as { eaMql5List: any[] }
    return EaMql5.fromList(data.eaMql5List)
  }

  static async detail(id: string, options: EaMql5DetailQuery): Promise<EaMql5> {
    const params = EaMql5GetQuery.toQuery(options)
    const response = await AxiosInstance.get(`/ea_mql5/detail/${id}`, { params })
    const data = response.data as { eaMql5: any }

    return EaMql5.from(data.eaMql5)
  }

  static async createOne(body: { eaMql5: EaMql5 }) {
    const { eaMql5 } = body
    const response = await AxiosInstance.post('/ea_mql5/create', {
      name: eaMql5.name,
      description: eaMql5.description,
      mql5Code: eaMql5.mql5Code,
    })
    const data = response.data as { eaMql5Id: string }

    return data.eaMql5Id
  }

  static async updateOne(id: string, body: { eaMql5: EaMql5 }) {
    const { eaMql5 } = body
    await AxiosInstance.put(`/ea_mql5/update/${id}`, {
      name: eaMql5.name,
      description: eaMql5.description,
      mql5Code: eaMql5.mql5Code,
    })
  }

  static async destroyOne(id: string) {
    await AxiosInstance.delete(`/ea_mql5/destroy/${id}`)
  }
}