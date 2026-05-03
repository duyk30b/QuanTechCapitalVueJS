import { type Mt5ProcessStatus, useGlobalStore } from '@/modules/_me/global.store'

export class SocketService {
  static listenServerEmitDemo(data: any) {
    console.log('🚀 ~ file: socket.service.ts:3 ~ listenServerEmitDemo ~ data:', data)
  }

  static listenSocketMt5Status(data: Partial<Mt5ProcessStatus>) {
    // Cập nhật trạng thái MT5 vào store
    const globalStore = useGlobalStore()
    globalStore.setMt5ProcessStatus({
      name: data.name || "",
      pid: data.pid || 0,
      cpuPercent: data.cpuPercent || 0,
      memoryMb: data.memoryMb || 0,
    })
  }
}
