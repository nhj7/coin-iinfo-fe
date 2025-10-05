/** 업비트 WebSocket 티커 데이터 (축약형) */
export interface UpbitTickerSimple {
  /** type: 데이터 항목 */
  ty: 'ticker'
  /** code: 페어 코드 (예: KRW-BTC) */
  cd: string
  /** opening_price: 시가 */
  op: number
  /** high_price: 고가 */
  hp: number
  /** low_price: 저가 */
  lp: number
  /** trade_price: 현재가 */
  tp: number
  /** prev_closing_price: 전일 종가 */
  pcp: number
  /** change: 전일 종가 대비 가격 변동 방향 */
  c: 'RISE' | 'EVEN' | 'FALL'
  /** change_price: 전일 대비 가격 변동의 절대값 */
  cp: number
  /** signed_change_price: 전일 대비 가격 변동 값 */
  scp: number
  /** change_rate: 전일 대비 등락율의 절대값 */
  cr: number
  /** signed_change_rate: 전일 대비 등락율 */
  scr: number
  /** trade_volume: 가장 최근 거래량 */
  tv: number
  /** acc_trade_volume: 누적 거래량(UTC 0시 기준) */
  atv: number
  /** acc_trade_volume_24h: 24시간 누적 거래량 */
  atv24h: number
  /** acc_trade_price: 누적 거래대금(UTC 0시 기준) */
  atp: number
  /** acc_trade_price_24h: 24시간 누적 거래대금 */
  atp24h: number
  /** trade_date: 최근 거래 일자(UTC) yyyyMMdd */
  tdt: string
  /** trade_time: 최근 거래 시각(UTC) HHmmss */
  ttm: string
  /** trade_timestamp: 체결 타임스탬프(ms) */
  ttms: number
  /** ask_bid: 매수/매도 구분 */
  ab: 'ASK' | 'BID'
  /** acc_ask_volume: 누적 매도량 */
  aav: number
  /** acc_bid_volume: 누적 매수량 */
  abv: number
  /** highest_52_week_price: 52주 최고가 */
  h52wp: number
  /** highest_52_week_date: 52주 최고가 달성일 yyyy-MM-dd */
  h52wdt: string
  /** lowest_52_week_price: 52주 최저가 */
  l52wp: number
  /** lowest_52_week_date: 52주 최저가 달성일 yyyy-MM-dd */
  l52wdt: string
  /** trade_status: 거래상태 (Deprecated) */
  ts?: string
  /** market_state: 거래상태 */
  ms: 'PREVIEW' | 'ACTIVE' | 'DELISTED'
  /** market_state_for_ios (Deprecated) */
  msfi?: string
  /** is_trading_suspended (Deprecated) */
  its?: boolean
  /** delisting_date: 거래지원 종료일 */
  dd?: string
  /** market_warning: 유의 종목 여부 */
  mw: 'NONE' | 'CAUTION'
  /** timestamp: 타임스탬프 (ms) */
  tms: number
  /** stream_type: 스트림 타입 */
  st: 'SNAPSHOT' | 'REALTIME'
}

// 업비트 WebSocket 티커 데이터 (전체 필드명)
export interface UpbitTicker {
  type: 'ticker'
  code: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  change: 'RISE' | 'EVEN' | 'FALL'
  change_price: number
  signed_change_price: number
  change_rate: number
  signed_change_rate: number
  trade_volume: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  acc_trade_price: number
  acc_trade_price_24h: number
  trade_date: string
  trade_time: string
  trade_timestamp: number
  ask_bid: 'ASK' | 'BID'
  acc_ask_volume: number
  acc_bid_volume: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  trade_status?: string
  market_state: 'PREVIEW' | 'ACTIVE' | 'DELISTED'
  market_state_for_ios?: string
  is_trading_suspended?: boolean
  delisting_date?: string
  market_warning: 'NONE' | 'CAUTION'
  timestamp: number
  stream_type: 'SNAPSHOT' | 'REALTIME'
}