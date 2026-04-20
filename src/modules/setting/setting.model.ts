import { BaseModel } from '../_base/base.model'

export enum SettingKey {
  MAIN_PATH = "MAIN_PATH",
  MQL5_FOLDER_PATH = "MQL5_FOLDER_PATH",
}

export const SettingKeyLabelMap: Record<SettingKey, string> = {
  [SettingKey.MAIN_PATH]: "Thư mục lưu dữ liệu chính",
  [SettingKey.MQL5_FOLDER_PATH]: "Thư mục MQL5",
}

export const SettingKeyExampleMap: Record<SettingKey, string> = {
  [SettingKey.MAIN_PATH]: "C:\\QTC_MQL5",
  [SettingKey.MQL5_FOLDER_PATH]: "C:\\Users\\user\\AppData\\Roaming\\MetaQuotes\\Terminal\\D0E8209F77C8CF37AD8BF550E51FF075\\MQL5",
}

export class Setting extends BaseModel {
  id: string
  key: SettingKey
  value: string

  static init(): Setting {
    const ins = new Setting()
    ins.id = ''
    ins.value = ''

    return ins
  }

  static blank(): Setting {
    const ins = Setting.init()
    return ins
  }

  static basic(source: Setting) {
    const target = new Setting()
    Object.keys(target).forEach((key) => {
      const value = target[key as keyof typeof target]
      if (value === undefined) delete target[key as keyof typeof target]
    })
    Object.assign(target, source)
    target._localId = String(
      source.id || source._localId || Math.random().toString(36).substring(2),
    )
    return target
  }

  static basicList(sources: Setting[]): Setting[] {
    return sources.map((i) => Setting.basic(i))
  }

  static from(source: Setting) {
    const target = Setting.basic(source)

    return target
  }

  static fromList(sourceList: Setting[]): Setting[] {
    return sourceList.map((i) => Setting.from(i))
  }

  static equal(a: Setting, b: Setting) {
    if (a.id != b.id) return false
    if (a.key != b.key) return false
    if (a.value != b.value) return false
    return true
  }
}
