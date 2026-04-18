import { OmitClass, PickClass } from '../../utils'
import type { ConditionDate, ConditionString } from '../_base/base-condition'

export class EaMql5GetQuery {
  page?: number
  limit?: number
  relation?: {
    user?: boolean
  }

  filter?: {
    isActive?: 1 | 0
    name?: ConditionString
    updatedAt?: ConditionDate
  }

  sort?: {
    id?: 'ASC' | 'DESC'
    name?: 'ASC' | 'DESC'
  }

  static toQuery(instance: Partial<EaMql5GetQuery>) {
    return {
      page: instance?.page,
      limit: instance?.limit,
      relation: instance.relation ? JSON.stringify(instance.relation) : undefined,
      filter: instance.filter ? JSON.stringify(instance.filter) : undefined,
      sort: instance.sort ? JSON.stringify(instance.sort) : undefined,
    }
  }
}

export class EaMql5PaginationQuery extends EaMql5GetQuery { }
export class EaMql5ListQuery extends OmitClass(EaMql5GetQuery, ['page']) { }
export class EaMql5DetailQuery extends PickClass(EaMql5GetQuery, ['relation']) { }
