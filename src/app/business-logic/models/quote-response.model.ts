export interface TradierQuoteResponse {
    quotes: TradierQuotes;
  }

  export interface TradierQuotes {
  quote: TradierQuote[];
}

export  interface TradierQuote {
    symbol: string;
    description: string;
    exch: string;
    type: string;
    last?: number;
    change?: number;
    volume: number;
    open?: number;
    high?: number;
    low?: number;
    close?: any;
    bid: number;
    ask: number;
    change_percentage?: number;
    average_volume: number;
    last_volume: number;
    trade_date: number;
    prevclose?: number;
    week_52_high: number;
    week_52_low: number;
    bidsize: number;
    bidexch: string;
    bid_date: number;
    asksize: number;
    askexch: string;
    ask_date: number;
    root_symbols?: string;
    underlying?: string;
    strike?: number;
    open_interest?: number;
    contract_size?: number;
    expiration_date?: string;
    expiration_type?: string;
    option_type?: string;
    root_symbol?: string;
  }

  export   interface AlphaVantageQuote {
    symbol: string;
    open: string;
    high: string;
    low: string;
    price: string;
    volume: string;
    latest_trading_day: string;
    previous_close: string;
    change: string;
    change_percent: string;
}

