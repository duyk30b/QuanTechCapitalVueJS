import { CollectionQuery } from '@/core/indexed-db'
import { ESArray } from '@/utils'
import { ref } from 'vue'
import { SettingApi } from './setting.api'
import type { SettingGetListQuery, SettingGetOneQuery, SettingGetQuery } from './setting.dto'
import { Setting } from './setting.model'

const SettingDBQuery = new CollectionQuery<Setting>()

export class SettingService {
  static loadedAll: boolean = false
  static settingAll: Setting[] = []
  static settingMap = ref<Record<string, Setting>>({})

  // chỉ cho phép gọi 1 lần, nếu muốn gọi lại thì phải dùng refetch: true
  static fetchAll = (() => {
    const start = async () => {
      try {
        const settingAll = await SettingApi.list({})
        SettingService.settingAll = settingAll
        SettingService.settingMap.value = ESArray.arrayToKeyValue(settingAll, 'id')
      } catch (error: any) {
        console.log('🚀 ~ setting.service.ts:21 ~ SettingService ~ start ~ error:', error)
      }
    }
    let fetching: any = null
    return async (options: { refetch?: boolean } = {}) => {
      if (!fetching || !SettingService.loadedAll || options.refetch) {
        SettingService.loadedAll = true
        fetching = start()
      }
      await fetching
    }
  })()

  private static executeQuery(all: Setting[], query: SettingGetQuery) {
    let data = all
    if (query.filter) {
      const filter = query.filter
      data = data.filter((i) => {
        return SettingDBQuery.executeFilter(i, filter as any)
      })
    }
    if (query.sort) {
      data = SettingDBQuery.executeSort(data, query.sort)
    }
    return data
  }

  static async getMap(options?: { refetch: boolean }) {
    await SettingService.fetchAll({ refetch: !!options?.refetch })
    return SettingService.settingMap.value
  }

  static async getAll(options?: { refetch: boolean }) {
    await SettingService.fetchAll({ refetch: !!options?.refetch })
    return SettingService.settingAll
  }

  static async getList(query: SettingGetListQuery, options?: { refetch: boolean }) {
    await SettingService.fetchAll({ refetch: !!options?.refetch })
    return Setting.fromList(SettingService.settingAll)
  }

  static async getOne(
    query: SettingGetOneQuery = {},
    options?: { refetch?: boolean; query?: boolean },
  ) {
    let setting: Setting | undefined
    if (options?.query) {
      // Không xử lý logic query ở server
    } else {
      await SettingService.fetchAll({ refetch: !!options?.refetch })
      const data = SettingService.executeQuery(
        SettingService.settingAll,
        query,
      )
      setting = data[0]
    }

    return setting ? Setting.from(setting) : Setting.blank()
  }
}
