import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CoinPrice {
  symbol: string
  cd : string
  kn: string
  price: number
  change24h: number
  changePercent24h: number
  atp24h : string
  atp24hRaw: number
  timestamp: number
  priceFlash?: 'up' | 'down' | null
}

export const useCoinStore = defineStore('coin', () => {
  // 거래소별 코인 가격: Map<거래소, Map<코인심볼, CoinPrice>>
  const prices = ref<Map<string, Map<string, CoinPrice>>>(new Map())
  const connected = ref(false)

  const updatePrice = (exchange: string, symbol: string, data: CoinPrice) => {
    if (!prices.value.has(exchange)) {
      prices.value.set(exchange, new Map())
    }
    prices.value.get(exchange)!.set(symbol, data)
  }

  const getPrice = (exchange: string, symbol: string): CoinPrice | undefined => {
    return prices.value.get(exchange)?.get(symbol)
  }

  const getExchangePrices = (exchange: string): Map<string, CoinPrice> | undefined => {
    return prices.value.get(exchange)
  }

  const setConnected = (status: boolean) => {
    connected.value = status
  }

  return {
    prices,
    connected,
    updatePrice,
    getPrice,
    getExchangePrices,
    setConnected
  }
})