import { OmitClass, PickClass } from '../../utils'
import type { ConditionDate, ConditionString } from '../_base/base-condition'

export class SettingGetQuery {
  page?: number
  limit?: number
  relation?: {
  }

  filter?: {
  }

  sort?: {
    id?: 'ASC' | 'DESC'
  }

  static toQuery(instance: Partial<SettingGetQuery>) {
    return {
      page: instance?.page,
      limit: instance?.limit,
      relation: instance.relation ? JSON.stringify(instance.relation) : undefined,
      filter: instance.filter ? JSON.stringify(instance.filter) : undefined,
      sort: instance.sort ? JSON.stringify(instance.sort) : undefined,
    }
  }
}

export class SettingPaginationQuery extends SettingGetQuery { }
export class SettingListQuery extends OmitClass(SettingGetQuery, ['page']) { }
export class SettingDetailQuery extends PickClass(SettingGetQuery, ['relation']) { }
