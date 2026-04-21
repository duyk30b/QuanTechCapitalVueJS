import { BaseModel } from '../_base/base.model'

export class EaMql5 extends BaseModel {
  id: string
  name: string
  description: string
  mql5Code: string
  compiled: boolean
  userId: number
  configIni: {
    symbol: string
    period: string
    fromDate: number
    toDate: number
    deposit: number
    currency: string
    leverage: number
    model: number
    optimization: number
    optimizationCriterion: number
  }


  static init(): EaMql5 {
    const ins = new EaMql5()
    ins.id = ''
    ins._localId = Math.random().toString(36).substring(2)
    ins.mql5Code = ''
    ins.compiled = false
    ins.configIni = {
      symbol: 'EURUSD',
      period: 'H1',
      fromDate: Date.now() - 30 * 24 * 3600 * 1000,
      toDate: Date.now(),
      deposit: 10_000,
      currency: 'USD',
      leverage: 100,
      model: 0,
      optimization: 0,
      optimizationCriterion: 0,
    }

    return ins
  }

  static blank(): EaMql5 {
    const ins = EaMql5.init()
    return ins
  }

  static basic(source: EaMql5) {
    const target = new EaMql5()
    Object.assign(target, source)

    Object.keys(target).forEach((key) => {
      const value = target[key as keyof typeof target]
      if (value === undefined) delete target[key as keyof typeof target]
    })
    target.configIni = {
      symbol: source.configIni?.symbol,
      period: source.configIni?.period,
      fromDate: source.configIni?.fromDate,
      toDate: source.configIni?.toDate,
      deposit: source.configIni?.deposit,
      currency: source.configIni?.currency,
      leverage: source.configIni?.leverage,
      model: source.configIni?.model,
      optimization: source.configIni?.optimization,
      optimizationCriterion: source.configIni?.optimizationCriterion,
    }
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

  static equal(a: EaMql5, b: EaMql5) {
    if (a.id != b.id) return false
    if (a.name != b.name) return false
    if (a.description != b.description) return false
    if (a.mql5Code != b.mql5Code) return false
    if (a.userId != b.userId) return false
    if (a.compiled != b.compiled) return false

    if (a.configIni.symbol != b.configIni.symbol) return false
    if (a.configIni.period != b.configIni.period) return false
    if (a.configIni.fromDate != b.configIni.fromDate) return false
    if (a.configIni.toDate != b.configIni.toDate) return false
    if (a.configIni.deposit != b.configIni.deposit) return false
    if (a.configIni.currency != b.configIni.currency) return false
    if (a.configIni.leverage != b.configIni.leverage) return false
    if (a.configIni.model != b.configIni.model) return false
    if (a.configIni.optimization != b.configIni.optimization) return false
    if (a.configIni.optimizationCriterion != b.configIni.optimizationCriterion) return false

    return true
  }
}
