import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    Menu,
    ShieldCheck,
    Search as SearchIcon,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react';

interface CoinSearchResult {
    id: string;
    symbol: string;
    name: string;
    image: string;
    price: number;
    change24h: number;
    market_cap: number;
    total_volume: number;
}

const SearchPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CoinSearchResult[]>(() => {
        const cached = localStorage.getItem('nexora_search_results');
        return cached ? JSON.parse(cached) : [];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    useEffect(() => {
        document.title = 'Market Intelligence | Nexora Capital';
        const key = sessionStorage.getItem('nexora_access_key');
        if (!key) {
            navigate('/');
            return;
        }
    }, [navigate]);

    const formatCompact = (num: number) => {
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toLocaleString()}`;
    };

    const fetchSearchData = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            // Fetch trending or top coins by default
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
                const data = await response.json();
                const mapped = data.map((c: any) => ({
                    id: c.id,
                    symbol: c.symbol.toUpperCase(),
                    name: c.name,
                    image: c.image,
                    price: c.current_price,
                    change24h: c.price_change_percentage_24h,
                    market_cap: c.market_cap,
                    total_volume: c.total_volume
                }));
                setResults(mapped);
                localStorage.setItem('nexora_search_results', JSON.stringify(mapped));
            } catch (e) {
                console.error("Default fetch failed", e);
            }
            return;
        }

        setIsLoading(true);
        try {
            // 1. Search for IDs
            const searchResponse = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`);
            const searchData = await searchResponse.json();
            const coinIds = searchData.coins.slice(0, 20).map((c: any) => c.id).join(',');

            if (!coinIds) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            // 2. Fetch detailed market data for those IDs
            const marketResponse = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc`);
            const marketData = await marketResponse.json();

            const mappedResults = marketData.map((c: any) => ({
                id: c.id,
                symbol: (c.symbol || '').toUpperCase(),
                name: c.name,
                image: c.image,
                price: c.current_price,
                change24h: c.price_change_percentage_24h,
                market_cap: c.market_cap,
                total_volume: c.total_volume
            }));

            setResults(mappedResults);
            localStorage.setItem('nexora_search_results', JSON.stringify(mappedResults));
        } catch (error) {
            console.error("Search API Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSearchData(query);
        }, 300); // 300ms Debounce

        return () => clearTimeout(timer);
    }, [query, fetchSearchData]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timeInterval);
    }, []);

    return (
        <div className="h-screen w-full bg-[#102217] text-white font-display overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <div className="flex h-full w-full flex-row">
                <Sidebar
                    activePage="search"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#102217] w-full">
                    {/* Top Gradient Overlay */}
                    <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#2bee79]/5 to-transparent pointer-events-none z-0"></div>

                    <div className="flex-1 overflow-y-auto z-10 custom-scrollbar shadow-inner">
                        <div className="w-full flex flex-col gap-0 min-h-full">
                            {/* Page Header */}
                            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 p-6 md:p-8 shrink-0 relative">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="md:hidden p-2 -ml-2 rounded-xl text-white hover:bg-white/10 transition-colors bg-white/5"
                                            onClick={() => setIsMobileMenuOpen(true)}
                                        >
                                            <Menu size={24} />
                                        </button>
                                        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Market Intel</h2>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px] sm:text-sm font-medium">
                                        <ShieldCheck size={16} className="text-[#2bee79]/70" />
                                        <span>Institutional Data Stream</span>
                                        <span className="mx-1 text-gray-600">•</span>
                                        <span className="shrink-0">UTC {currentTime}</span>
                                    </div>
                                </div>
                            </header>

                            {/* Search Terminal */}
                            <div className="px-6 md:px-8 pb-4 flex flex-col items-center">
                                <div className="w-full max-w-[600px] relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#2bee79] transition-colors">
                                        <SearchIcon size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search asset, symbol, or protocol..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/5 focus:border-[#2bee79]/50 focus:ring-1 focus:ring-[#2bee79]/20 rounded-2xl h-16 md:h-20 pl-16 pr-6 text-base md:text-[16px] font-medium text-white placeholder-gray-500 transition-all outline-none backdrop-blur-md"
                                    />
                                    {isLoading && (
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                            <div className="w-5 h-5 border-2 border-[#2bee79]/20 border-t-[#2bee79] rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Results Table (PC) / List (Mobile) */}
                            <div className="px-4 md:px-8 py-8">
                                {/* Desktop/Tablet Table */}
                                <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-white/5 bg-[#16261f]/40 backdrop-blur-[12px] shadow-2xl">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] bg-black/20">
                                                <th className="py-5 pl-8 pr-4">Asset</th>
                                                <th className="py-5 px-4 text-right">Price</th>
                                                <th className="py-5 px-4 text-right">24h Change</th>
                                                <th className="py-5 px-4 text-right">Market Cap</th>
                                                <th className="py-5 pl-4 pr-8 text-right">24h Volume</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {results.length > 0 ? results.map((coin) => (
                                                <tr key={coin.id} className="group hover:bg-white/[0.04] transition-all cursor-pointer animate-fade-in duration-300">
                                                    <td className="py-5 pl-8 pr-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent p-0.5 shrink-0 overflow-hidden shadow-lg border border-white/5">
                                                                <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-bold text-base tracking-tight">{coin.name}</span>
                                                                <span className="text-[#2bee79]/70 text-[11px] font-black tracking-widest uppercase">{coin.symbol}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-right tabular-nums">
                                                        <span className="text-white font-medium text-base">
                                                            ${coin.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: coin.price < 1 ? 6 : 2 })}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-4 text-right tabular-nums">
                                                        <div className={`inline-flex items-center gap-1.5 font-bold ${coin.change24h >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                                            {coin.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                            {Math.abs(coin.change24h || 0).toFixed(2)}%
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-4 text-right">
                                                        <span className="text-gray-400 font-mono text-sm tracking-tighter">
                                                            {formatCompact(coin.market_cap)}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 pl-4 pr-8 text-right">
                                                        <span className="text-gray-500 font-mono text-xs uppercase tracking-tight">
                                                            {formatCompact(coin.total_volume)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : !isLoading && (
                                                <tr>
                                                    <td colSpan={5} className="py-20 text-center">
                                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                                            <Activity size={48} />
                                                            <p className="text-sm font-medium tracking-widest uppercase">No assets identified</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile List */}
                                <div className="md:hidden flex flex-col gap-3">
                                    {results.length > 0 ? results.map((coin) => (
                                        <div key={coin.id} className="p-5 rounded-[24px] bg-[#16261f]/60 backdrop-blur-[12px] border border-white/5 flex items-center justify-between animate-fade-in">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-12 h-12 rounded-full bg-white/5 p-1 shrink-0 overflow-hidden shadow-inner border border-white/5">
                                                    <img src={coin.image} alt={coin.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <h3 className="text-white font-bold text-[15px] truncate tracking-tight">{coin.name}</h3>
                                                    <p className="text-gray-400 text-[13px] font-medium tabular-nums">
                                                        ${coin.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: coin.price < 1 ? 6 : 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase ${coin.change24h >= 0 ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'}`}>
                                                {coin.change24h > 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                                            </div>
                                        </div>
                                    )) : !isLoading && (
                                        <div className="py-20 flex flex-col items-center gap-4 opacity-20">
                                            <Activity size={40} />
                                            <p className="text-xs font-black tracking-[0.2em] uppercase text-center">Protocol Standby<br />Awaiting Input</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SearchPage;
