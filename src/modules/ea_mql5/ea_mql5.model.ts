import { BaseModel } from '../_base/base.model'

export class EaMql5 extends BaseModel {
  id: string
  name: string
  description: string
  mql5Code: string
  updatedAt: number


  static init(): EaMql5 {
    const ins = new EaMql5()
    ins.id = ''
    ins._localId = Math.random().toString(36).substring(2)
    ins.mql5Code = ''

    return ins
  }

  static blank(): EaMql5 {
    const ins = EaMql5.init()
    return ins
  }

  static basic(source: EaMql5) {
    const target = new EaMql5()
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

  static basicList(sources: EaMql5[]): EaMql5[] {
    return sources.map((i) => EaMql5.basic(i))
  }

  static from(source: EaMql5) {
    const target = EaMql5.basic(source)

    return target
  }

  static fromList(sourceList: EaMql5[]): EaMql5[] {
    return sourceList.map((i) => EaMql5.from(i))
  }
}
