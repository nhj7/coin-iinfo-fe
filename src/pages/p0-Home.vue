<script setup lang="ts">
import { computed } from 'vue';
import { useCoinStore } from '../stores/coin';

defineProps<{ msg: string }>()

const coinStore = useCoinStore()

// 가격 요소들을 저장할 Map
const priceRefs = new Map<string, HTMLElement>()

// 전역으로 노출 (useUpbitWebSocket에서 접근)
if (typeof window !== 'undefined') {
  (window as any).upbitPriceRefs = priceRefs
}

// 업비트 코인 목록 가져오기 (거래액 역정렬)
const upbitCoins = computed(() => {
  const prices = coinStore.getExchangePrices('upbit')
  if (!prices) return []

  return Array.from(prices.entries())
    .map(([_, data]) => data)
    .sort((a, b) => b.atp24hRaw - a.atp24hRaw)
})

// ref 설정 함수
const setPriceRef = (el: any, symbol: string) => {
  if (el) {
    priceRefs.set(symbol, el)
  }
}
</script>

<template>
  <div class="w-full h-full p-1 flex flex-col lg:flex-row gap-2 lg:items-start">
    <!-- 업비트 테이블 -->
    <div class="bg-base-100 rounded-box shadow-md flex flex-col w-full sm:max-w-screen-sm" >
      <div class="p-4 pb-2 text-xs opacity-60 tracking-wide">업비트 (Upbit)</div>

      <div class="flex-grow">
        <table class="table table-fixed w-full">
        <thead>
          <tr>
            <th class="text-left">코인명</th>
            <th class="text-right">현재가</th>
            <th class="text-right">전일대비</th>
            <th class="text-right">김프</th>
            <th class="text-right">거래액</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="coin in upbitCoins" :key="coin.symbol">
            <tr class="border-b-0">
              <td class="font-semibold pb-0 max-w-18 truncate">{{ coin.kn }}</td>
              <td class="text-right  pb-0">
                <span :ref="(el) => setPriceRef(el, coin.symbol)">{{ coin.price.toLocaleString() }}</span>
              </td>
              <td class="text-right  pb-0" :class="coin.changePercent24h >= 0 ? 'text-success' : 'text-error'">
                {{ coin.changePercent24h >= 0 ? '+' : '' }}{{ coin.changePercent24h.toFixed(2) }}%
              </td>
              <td class="text-right  pb-0">{{ "" }}</td>
              <td class="text-right  pb-0">{{ coin.atp24h }}</td>
            </tr>
            <tr>
              <td class="opacity-60 pt-0">{{ coin.cd }}</td>
              <td class="text-right pt-0 pb-0 opacity-60" :class="coin.change24h >= 0 ? 'text-success' : 'text-error'">
                {{ coin.change24h >= 0 ? '+' : '' }}{{ coin.change24h.toLocaleString() }}
              </td>
              <td class="pt-0" ></td>
              <td class="pt-0" ></td>
              <td class="pt-0" ></td>
            </tr>
          </template>
          <tr v-if="upbitCoins.length === 0">
            <td colspan="5" class="text-center text-base-content/60">
              데이터를 불러오는 중...
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- 채팅 영역 -->
    <div class="bg-base-100 rounded-box shadow-md flex flex-col flex-grow h-[70vh] sticky top-2">
      <div class="p-4 pb-2 text-xs opacity-60 tracking-wide border-b border-base-300">채팅</div>

      <!-- 채팅 메시지 영역 -->
      <div class="flex-grow overflow-auto p-4">
        <div class="text-xs opacity-60 text-center">채팅 내용이 여기에 표시됩니다.</div>
      </div>

      <!-- 입력 영역 -->
      <div class="p-2 border-t border-base-300">
        <div class="flex gap-2">
          <input type="text" placeholder="메시지를 입력하세요..." class="input input-bordered input-sm flex-grow" />
          <button class="btn btn-sm btn-primary">전송</button>
        </div>
      </div>
      <br /><br /><br />
    </div>
  </div>
</template>

<style scoped>
.price-flash-up {
  /*box-shadow: 0 0 10px 3px var(--color-success);*/
  color : var(--color-success);
}

.price-flash-down {
  /*box-shadow: 0 0 10px 3px var(--color-error);*/
  color : var(--color-error);
}

.table {
  font-size : 0.77em;
}
.table th, td{
  padding-inline: calc(0.25rem * 0.25);
  padding-block: calc(0.25rem * 0.25);
  vertical-align: middle;
}
</style>
