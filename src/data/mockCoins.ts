export interface CoinData {
    id: string;
    rank: number;
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
}

export const TOP_50_COINS: CoinData[] = [
    { id: "bitcoin", rank: 1, symbol: "BTC", name: "Bitcoin", price: 64231.45, change24h: 2.4, marketCap: 1260000000000, volume24h: 32100000000 },
    { id: "ethereum", rank: 2, symbol: "ETH", name: "Ethereum", price: 3452.12, change24h: 1.8, marketCap: 405200000000, volume24h: 15400000000 },
    { id: "tether", rank: 3, symbol: "USDT", name: "Tether", price: 1.00, change24h: 0.01, marketCap: 103000000000, volume24h: 45000000000 },
    { id: "binance-coin", rank: 4, symbol: "BNB", name: "BNB", price: 590.20, change24h: 0.2, marketCap: 87300000000, volume24h: 1200000000 },
    { id: "solana", rank: 5, symbol: "SOL", name: "Solana", price: 145.67, change24h: -0.5, marketCap: 65100000000, volume24h: 2800000000 },
    { id: "xrp", rank: 6, symbol: "XRP", name: "XRP", price: 0.62, change24h: -1.2, marketCap: 34100000000, volume24h: 1800000000 },
    { id: "usdc", rank: 7, symbol: "USDC", name: "USDC", price: 1.00, change24h: 0.00, marketCap: 32000000000, volume24h: 3100000000 },
    { id: "lido-staked-ether", rank: 8, symbol: "STETH", name: "Lido Staked Ether", price: 3450.10, change24h: 1.8, marketCap: 30500000000, volume24h: 120000000 },
    { id: "dogecoin", rank: 9, symbol: "DOGE", name: "Dogecoin", price: 0.16, change24h: 4.5, marketCap: 23000000000, volume24h: 2100000000 },
    { id: "toncoin", rank: 10, symbol: "TON", name: "Toncoin", price: 6.80, change24h: 5.2, marketCap: 22000000000, volume24h: 450000000 },
    { id: "cardano", rank: 11, symbol: "ADA", name: "Cardano", price: 0.45, change24h: -0.8, marketCap: 16000000000, volume24h: 350000000 },
    { id: "shiba-inu", rank: 12, symbol: "SHIB", name: "Shiba Inu", price: 0.000025, change24h: 3.1, marketCap: 14700000000, volume24h: 890000000 },
    { id: "avalanche-2", rank: 13, symbol: "AVAX", name: "Avalanche", price: 35.40, change24h: 1.1, marketCap: 13500000000, volume24h: 420000000 },
    { id: "tron", rank: 14, symbol: "TRX", name: "TRON", price: 0.11, change24h: 0.5, marketCap: 10500000000, volume24h: 310000000 },
    { id: "polkadot", rank: 15, symbol: "DOT", name: "Polkadot", price: 7.20, change24h: -1.5, marketCap: 10200000000, volume24h: 180000000 },
    { id: "bitcoin-cash", rank: 16, symbol: "BCH", name: "Bitcoin Cash", price: 450.00, change24h: 0.8, marketCap: 8800000000, volume24h: 250000000 },
    { id: "chainlink", rank: 17, symbol: "LINK", name: "Chainlink", price: 14.50, change24h: 2.2, marketCap: 8500000000, volume24h: 320000000 },
    { id: "near-protocol", rank: 18, symbol: "NEAR", name: "NEAR Protocol", price: 6.50, change24h: 3.5, marketCap: 6900000000, volume24h: 410000000 },
    { id: "matic-network", rank: 19, symbol: "MATIC", name: "Polygon", price: 0.70, change24h: -0.5, marketCap: 6500000000, volume24h: 220000000 },
    { id: "litecoin", rank: 20, symbol: "LTC", name: "Litecoin", price: 82.00, change24h: 0.2, marketCap: 6100000000, volume24h: 380000000 },
    { id: "internet-computer", rank: 21, symbol: "ICP", name: "Internet Computer", price: 12.50, change24h: -2.1, marketCap: 5800000000, volume24h: 110000000 },
    { id: "dai", rank: 22, symbol: "DAI", name: "Dai", price: 1.00, change24h: 0.00, marketCap: 5300000000, volume24h: 250000000 },
    { id: "uniswap", rank: 23, symbol: "UNI", name: "Uniswap", price: 9.80, change24h: 4.1, marketCap: 5100000000, volume24h: 180000000 },
    { id: "aptos", rank: 24, symbol: "APT", name: "Aptos", price: 8.50, change24h: 1.5, marketCap: 4500000000, volume24h: 150000000 },
    { id: "render-token", rank: 25, symbol: "RNDR", name: "Render", price: 9.20, change24h: 6.5, marketCap: 4200000000, volume24h: 320000000 },
    { id: "cosmos", rank: 26, symbol: "ATOM", name: "Cosmos", price: 8.40, change24h: -0.3, marketCap: 3900000000, volume24h: 120000000 },
    { id: "pepe", rank: 27, symbol: "PEPE", name: "Pepe", price: 0.000008, change24h: 12.4, marketCap: 3800000000, volume24h: 950000000 },
    { id: "ethereum-classic", rank: 28, symbol: "ETC", name: "Ethereum Classic", price: 28.50, change24h: 0.5, marketCap: 3700000000, volume24h: 150000000 },
    { id: "stacks", rank: 29, symbol: "STX", name: "Stacks", price: 2.10, change24h: 3.2, marketCap: 3500000000, volume24h: 90000000 },
    { id: "filecoin", rank: 30, symbol: "FIL", name: "Filecoin", price: 5.80, change24h: -1.2, marketCap: 3200000000, volume24h: 210000000 },
    { id: "arbitrum", rank: 31, symbol: "ARB", name: "Arbitrum", price: 1.10, change24h: -0.8, marketCap: 3100000000, volume24h: 280000000 },
    { id: "stellar", rank: 32, symbol: "XLM", name: "Stellar", price: 0.11, change24h: 0.1, marketCap: 3050000000, volume24h: 85000000 },
    { id: "okb", rank: 33, symbol: "OKB", name: "OKB", price: 45.00, change24h: 0.4, marketCap: 2900000000, volume24h: 12000000 },
    { id: "vechain", rank: 34, symbol: "VET", name: "VeChain", price: 0.035, change24h: 0.9, marketCap: 2800000000, volume24h: 60000000 },
    { id: "imx", rank: 35, symbol: "IMX", name: "Immutable", price: 2.20, change24h: 2.5, marketCap: 2700000000, volume24h: 75000000 },
    { id: "maker", rank: 36, symbol: "MKR", name: "Maker", price: 2800.00, change24h: 1.2, marketCap: 2600000000, volume24h: 95000000 },
    { id: "optimism", rank: 37, symbol: "OP", name: "Optimism", price: 2.50, change24h: -1.5, marketCap: 2500000000, volume24h: 180000000 },
    { id: "injective-protocol", rank: 38, symbol: "INJ", name: "Injective", price: 25.00, change24h: 4.8, marketCap: 2400000000, volume24h: 150000000 },
    { id: "the-graph", rank: 39, symbol: "GRT", name: "The Graph", price: 0.28, change24h: 1.9, marketCap: 2350000000, volume24h: 110000000 },
    { id: "kaspa", rank: 40, symbol: "KAS", name: "Kaspa", price: 0.12, change24h: 5.5, marketCap: 2300000000, volume24h: 55000000 },
    { id: "theta-token", rank: 41, symbol: "THETA", name: "Theta Network", price: 2.10, change24h: 0.5, marketCap: 2100000000, volume24h: 40000000 },
    { id: "fantom", rank: 42, symbol: "FTM", name: "Fantom", price: 0.75, change24h: 3.2, marketCap: 2050000000, volume24h: 180000000 },
    { id: "wif", rank: 43, symbol: "WIF", name: "dogwifhat", price: 2.80, change24h: 15.2, marketCap: 2000000000, volume24h: 650000000 },
    { id: "arweave", rank: 44, symbol: "AR", name: "Arweave", price: 35.00, change24h: 2.8, marketCap: 1950000000, volume24h: 80000000 },
    { id: "thorchain", rank: 45, symbol: "RUNE", name: "THORChain", price: 6.20, change24h: -0.2, marketCap: 1900000000, volume24h: 150000000 },
    { id: "hedera", rank: 46, symbol: "HBAR", name: "Hedera", price: 0.08, change24h: 0.1, marketCap: 1850000000, volume24h: 45000000 },
    { id: "fetch-ai", rank: 47, symbol: "FET", name: "Fetch.ai", price: 2.10, change24h: 8.5, marketCap: 1800000000, volume24h: 220000000 },
    { id: "bonk", rank: 48, symbol: "BONK", name: "Bonk", price: 0.000024, change24h: 6.7, marketCap: 1750000000, volume24h: 180000000 },
    { id: "celestia", rank: 49, symbol: "TIA", name: "Celestia", price: 9.50, change24h: -1.8, marketCap: 1700000000, volume24h: 85000000 },
    { id: "sei", rank: 50, symbol: "SEI", name: "Sei", price: 0.55, change24h: 1.2, marketCap: 1650000000, volume24h: 105000000 }
];
