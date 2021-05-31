export interface TradierSearchResponse {
    securities: TradierSecurities;
}

export interface TradierSecurities {
    security: TradierSecurity[];
}

export interface TradierSecurity {
    symbol: string;
    exchange: string;
    type: string;
    description: string;
}

export interface AlphaVantageSecurity {
    symbol: string;
    name: string;
    type: string;
    region: string;
    marketOpen: string;
    marketClose: string;
    timezone: string;
    currency: string;
    matchScore: string;
}

export interface AlphaVantageSearchResponse {
    securities: AlphaVantageSecurity[];
}
