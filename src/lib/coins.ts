interface Asset {
    id: string // coingecko id, e.g., "bitcoin"
    symbol: string // e.g., "BTC"
    name: string // e.g., "Bitcoin"
    defaultApy: number // APY forecast
}

export const coins: Asset[] = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", defaultApy: 12.0 },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", defaultApy: 14.0 },
    { id: "cardano", symbol: "ADA", name: "Cardano", defaultApy: 9.0 },
    { id: "solana", symbol: "SOL", name: "Solana", defaultApy: 11.0 },
    { id: "polkadot", symbol: "DOT", name: "Polkadot", defaultApy: 10.0 },
    { id: "cosmos", symbol: "ATOM", name: "Cosmos", defaultApy: 18.0 },
    { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", defaultApy: 15.0 },
];

export const currencies: string[] = ["usd", "eur"];