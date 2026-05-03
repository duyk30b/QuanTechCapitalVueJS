<script setup lang="ts">
import { useGlobalStore } from '@/modules/_me/global.store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const globalStore = useGlobalStore()
const { mt5ProcessStatus } = storeToRefs(globalStore)

const statusClass = computed(() => {
  if (!mt5ProcessStatus.value.pid) return 'status-offline'
  if (mt5ProcessStatus.value.cpuPercent > 5 || mt5ProcessStatus.value.memoryMb > 500)
    return 'status-busy'
  return 'status-running'
})

const statusLabel = computed(() => {
  if (!mt5ProcessStatus.value.pid) return 'Stopped'
  if (mt5ProcessStatus.value.cpuPercent > 5 || mt5ProcessStatus.value.memoryMb > 500) return 'Busy'
  return 'Running'
})

const processName = computed(() => mt5ProcessStatus.value.name || 'MT5 Process')
</script>

<template>
  <div
    class="mt5-status-inline"
    :class="statusClass"
    :title="statusLabel"
  >
    <span class="mt5-dot"></span>
    <span class="mt5-name">{{ processName }} (PID: {{ mt5ProcessStatus.pid }})</span>
    <span class="mt5-badge">{{ statusLabel }}</span>
    <span class="mt5-metric">CPU {{ mt5ProcessStatus.cpuPercent }}%</span>
    <span class="mt5-metric">RAM {{ mt5ProcessStatus.memoryMb }}MB</span>
  </div>
</template>

<style scoped>
.mt5-status-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  max-width: 100%;
  border-radius: 999px;
  padding: 0 12px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  font-size: 12px;
  white-space: nowrap;
}

.mt5-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
}

.mt5-name {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

.mt5-badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.mt5-metric {
  font-weight: 600;
  opacity: 0.9;
}

.status-running {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #14532d;
}

.status-running .mt5-dot {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.16);
  animation: pulse-running 1.6s infinite;
}

.status-running .mt5-badge {
  background: rgba(22, 163, 74, 0.14);
  color: #166534;
}

.status-busy {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #7c2d12;
}

.status-busy .mt5-dot {
  background: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.18);
  animation: pulse-busy 0.9s infinite;
}

.status-busy .mt5-badge {
  background: rgba(234, 88, 12, 0.14);
  color: #9a3412;
}

.status-offline {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.status-offline .mt5-dot {
  background: #94a3b8;
}

.status-offline .mt5-badge {
  background: rgba(71, 85, 105, 0.14);
  color: #334155;
}

@keyframes pulse-running {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.16);
  }
}

@keyframes pulse-busy {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.28);
  }
}

@media (max-width: 640px) {
  .mt5-status-inline {
    padding: 0 10px;
    gap: 6px;
    font-size: 11px;
  }

  .mt5-name {
    max-width: 88px;
  }

  .mt5-metric {
    display: none;
  }
}
</style>
