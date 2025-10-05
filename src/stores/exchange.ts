import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useExchangeStore = defineStore('exchange', () => {
  const usdKrw = ref<number | null>(null)

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get('https://cors.iinfo.kr:7403/https://m.stock.naver.com/front-api/marketIndex/productDetail?category=exchange&reutersCode=FX_USDKRW')
      usdKrw.value = response.data.result.calcPrice
      console.log('calcPrice:', usdKrw.value)
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
    }
  }

  return {
    usdKrw,
    fetchExchangeRate
  }
})