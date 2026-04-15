import { Role } from '../role/role.model'
import { UserRole } from '../user_role/user_role.model'
import Device from './device.model'

export enum UserType {
  Root = 0,
  Admin = 1,
  User = 2,
}

export class User {
  id: number
  fullName: string
  username: string
  password: string
  secret: string

  userType: UserType
  isActive: 1 | 0 // Trạng thái

  createdAt: number
  updatedAt: number

  userRoleList?: UserRole[]
  devices?: Device[]

  static init(): User {
    const ins = new User()
    ins.id = 0
    ins.isActive = 1
    ins.userType = UserType.User
    return ins
  }

  static blank(): User {
    const ins = User.init()
    return ins
  }

  static basic(source: User) {
    const target = new User()
    Object.keys(target).forEach((key) => {
      const value = target[key as keyof typeof target]
      if (value === undefined) delete target[key as keyof typeof target]
    })
    Object.assign(target, source)
    if (target.secret && !target.password) {
      try {
        // target.password = decrypt(target.secret, target.username)
      } catch (error) {
        console.log('🚀 ~ file: user.model.ts:117 ~ User ~ basic ~ error:', error)
      }
    }
    return target
  }

  static basicList(sources: User[]): User[] {
    return sources.map((i) => User.basic(i))
  }

  static from(source: User) {
    const target = User.basic(source)
    if (target.userRoleList) {
      target.userRoleList = UserRole.basicList(target.userRoleList)
      target.userRoleList.forEach((userRole) => {
        userRole.role = userRole.role ? Role.basic(userRole.role) : userRole.role
        // userRole.user = userRole.user ? User.basic(userRole.user) : userRole.user
      })
    }
    if (target.devices) {
      target.devices = Device.basicList(target.devices)
    }
    return target
  }

  static fromList(sourceList: User[]) {
    return sourceList.map((i) => User.from(i))
  }

  static equal(a: User, b: User) {
    if (a.id != b.id) return false
    if (a.username != b.username) return false
    if (a.password != b.password) return false

    if (a.fullName != b.fullName) return false

    if (a.userType != b.userType) return false
    if (a.isActive != b.isActive) return false
    return true
  }
}
