import { AxiosInstance } from '../../core/axios.instance'
import { SettingGetQuery, type SettingListQuery } from './setting.dto'
import { Setting, SettingKey } from './setting.model'

export class SettingApi {
  static async list(options: SettingListQuery): Promise<Setting[]> {
    const params = SettingGetQuery.toQuery(options)

    const response = await AxiosInstance.get('/setting/list', { params })
    const data = response.data as { settingList: any[] }
    return Setting.fromList(data.settingList)
  }

  static async map() {
    const settingList = await SettingApi.list({})
    const settingMap: Partial<Record<SettingKey, any>> = {}
    settingList.forEach((setting) => {
      settingMap[setting.key as SettingKey] = setting.value
    })

    return settingMap
  }

  static async upsert(type: keyof typeof SettingKey, setting: Setting) {
    const response = await AxiosInstance.post(`/setting/upsert/${type}`, {
      value: setting.value,
    })
    const data = response.data
    return data
  }
}
