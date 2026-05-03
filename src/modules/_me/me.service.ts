import { ref } from 'vue'
import { LocalStorageService } from '../../core/local-storage.service'
import { arrayToKeyValue } from '../../utils'
import type { Permission } from '../permission/permission.model'
import { User } from '../user'
import { MeApi } from './me.api'

export class MeService {
  static user = ref(LocalStorageService.getRefreshToken() ? User.blank() : null)

  static permissionMap = ref<Record<string, Permission>>({})
  static userPermission = ref<Record<string, boolean>>({})

  static reCalculatorPermission(options: {
    permissionAll: Permission[]
    permissionIds: number[]
    user: User
  }) {
    const { permissionAll, permissionIds, user } = options
    MeService.user.value = user

    const permissionMap = arrayToKeyValue(permissionAll, 'id')
    MeService.permissionMap.value = permissionMap

    const userPermission: Record<string, boolean> = {}



    permissionAll.forEach((permission) => {


      const pathIdArr = permission.pathId.split('.').map((i) => Number(i))
      // Kiểm tra API có bị inActive
      for (let i = 0; i < pathIdArr.length; i++) {
        const id = pathIdArr[i]
        const curPermission = permissionMap[id]
        if (!curPermission.isActive) {
          return // chỉ cần 1 thằng inActive thì là false
        }
      }


      if (pathIdArr.some((pid) => permissionIds.includes(pid))) {
        userPermission[permission.id] = true
      }
    })
    MeService.userPermission.value = userPermission
  }

  static async initData() {
    try {
      const {
        permissionAll,
        permissionIds,
        user,
      } = await MeApi.data()

      MeService.reCalculatorPermission({ permissionAll, permissionIds, user })

    } catch (error) {
      console.log('🚀 ~ file: me.service.ts:77 ~ initData ~ error:', error)
    }
  }
}
