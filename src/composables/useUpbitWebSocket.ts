import { onUnmounted, ref } from 'vue'
import { useCoinStore } from '../stores/coin'
import type { UpbitTickerSimple } from '../types/upbit'
import short from 'short-uuid'
import axios from 'axios'

interface UpbitMarket {
  market: string
  korean_name: string
  english_name: string
}

export function useUpbitWebSocket() {
  const coinStore = useCoinStore()
  let webSocket: WebSocket | null = null
  const markets = ref<Record<string, UpbitMarket>>({})
  const isMarketsLoaded = ref(false)

  // 거래액을 억/조 단위로 변환
  const formatTradeAmount = (amount: number): string => {
    const hundredMillion = 100000000
    const trillion = 1000000000000

    if (amount < hundredMillion) return '1억'

    if (amount >= trillion) {
      const value = Math.floor(amount / trillion)
      return `${value.toLocaleString()}조`
    }

    const value = Math.floor(amount / hundredMillion)
    return `${value.toLocaleString()}억`
  }

  // 마켓 목록 조회
  const fetchMarkets = async () => {
    if (isMarketsLoaded.value) return markets.value

    try {
      const response = await axios.get<UpbitMarket[]>('https://api.upbit.com/v1/market/all')
      // 배열을 객체로 변환 (market을 key로 사용)
      markets.value = response.data.reduce((acc, market) => {
        acc[market.market] = market
        return acc
      }, {} as Record<string, UpbitMarket>)
      isMarketsLoaded.value = true
      console.log(`Upbit markets loaded: ${Object.keys(markets.value).length} markets`, markets.value)
      return markets.value
    } catch (error) {
      console.error('Failed to fetch Upbit markets:', error)
      return {}
    }
  }

  const connect = async (symbols?: string[]) => {
    // 마켓 목록이 없으면 먼저 가져오기
    if (!isMarketsLoaded.value) {
      await fetchMarkets()
    }

    // symbols가 제공되지 않으면 KRW 마켓 전체 구독
    const codesToSubscribe = symbols || Object.values(markets.value)
      .filter(m => m.market.startsWith('KRW-'))
      .map(m => m.market);
    webSocket = new WebSocket('https://api.upbit.com/websocket/v1');


    webSocket.onopen = () => {
      console.log('Upbit WebSocket connected')
      coinStore.setConnected(true)

      // 구독 메시지 전송
      const subscribeMessage = [
        { ticket: short.generate() },
        { type: 'ticker', codes: codesToSubscribe },
        { format: 'SIMPLE_LIST' }
      ]
      webSocket?.send(JSON.stringify(subscribeMessage))
    }

    webSocket.onmessage = async (event) => {
      const blob = event.data
      const text = await blob.text()
      const dataArray: UpbitTickerSimple[] = JSON.parse(text)

      // 배열로 전달되는 ticker 데이터 처리
      dataArray.forEach(data => {
        if (data.ty === 'ticker') {
          // 이전 가격 가져오기
          const oldPrice = coinStore.getPrice('upbit', data.cd)?.price

          coinStore.updatePrice('upbit', data.cd, {
            symbol: data.cd,
            cd : data.cd.split('-')[1] || data.cd,
            kn: markets.value[data.cd]?.korean_name || data.cd,
            price: data.tp,
            change24h: data.scp,
            changePercent24h: data.scr * 100,
            atp24h : formatTradeAmount(data.atp24h),
            atp24hRaw: data.atp24h,
            timestamp: data.tms
          })

          // 가격 변동 시 DOM 직접 조작으로 플래시 효과
          if (oldPrice !== undefined && oldPrice !== data.tp) {
            const priceRefs = (window as any).upbitPriceRefs
            if (priceRefs) {
              const element = priceRefs.get(data.cd)
              if (element) {
                const className = data.tp > oldPrice ? 'price-flash-up' : 'price-flash-down'
                element.classList.add(className)
                setTimeout(() => {
                  element.classList.remove(className)
                }, 300)
              }
            }
          }
        }
      })
    }

    webSocket.onerror = (error) => {
      console.error('Upbit WebSocket error:', error)
      coinStore.setConnected(false)
    }

    webSocket.onclose = () => {
      console.log('Upbit WebSocket closed')
      coinStore.setConnected(false)

      // 5초 후 재연결 시도 (비동기)
      setTimeout(async () => {
        if (webSocket?.readyState === WebSocket.CLOSED) {
          await connect(symbols)
        }
      }, 1000)
    }
  }

  const disconnect = () => {
    if (webSocket) {
      webSocket.close()
      webSocket = null
    }
  }

  // 컴포넌트 언마운트 시 자동으로 연결 해제
  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    markets,
    fetchMarkets
  }
}