import { defineStore } from 'pinia'

export type Mt5ProcessStatus = {
  name: string
  pid: number
  cpuPercent: number
  memoryMb: number
}

const defaultMt5ProcessStatus: Mt5ProcessStatus = {
  name: '',
  pid: 0,
  cpuPercent: 0,
  memoryMb: 0,
}

export const useGlobalStore = defineStore('global_store', {
  state: () => {
    return {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 900,
      mt5ProcessStatus: { ...defaultMt5ProcessStatus } as Mt5ProcessStatus,
    }
  },

  actions: {
    setMt5ProcessStatus(data: Partial<Mt5ProcessStatus>) {
      Object.assign(this.mt5ProcessStatus, data)
    },

    resetMt5ProcessStatus() {
      Object.assign(this.mt5ProcessStatus, defaultMt5ProcessStatus)
    },
  },

  getters: {},
})
