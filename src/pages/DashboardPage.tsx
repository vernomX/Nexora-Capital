import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import logoUrl from '../assets/icons/logo.svg';
import Sidebar from '../components/Sidebar';
import {
    BarChart3,
    PieChart,
    Menu,
    ShieldCheck,
    Download,
    LayoutGrid,
    List,
    Search,
    User
} from 'lucide-react';

interface GlobalData {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_change_percentage_24h_usd: number;
}

interface CoinMarketRow {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
    total_volume: number;
}

const DashboardPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [dashboardBlurred, setDashboardBlurred] = useState(false);

    // CoinGecko API State
    const [displayedCoins, setDisplayedCoins] = useState<any[]>(() => {
        const cached = localStorage.getItem('nexora_market_data');
        return cached ? JSON.parse(cached) : [];
    });
    const [globalData, setGlobalData] = useState<GlobalData | null>(() => {
        const cached = localStorage.getItem('nexora_global_data');
        return cached ? JSON.parse(cached) : null;
    });
    const [lastUpdated, setLastUpdated] = useState<string>(() => {
        return localStorage.getItem('nexora_last_sync') || 'Never';
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastMarketFetchRef = useRef<number>(0);

    const updateSyncTimestamp = () => {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastUpdated(timestamp);
        localStorage.setItem('nexora_last_sync', timestamp);
    };

    const fetchGlobalData = async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/global');
            if (response.status === 429) {
                console.warn('Nexora: Rate limit hit - using cached global data');
                setIsUpdating(true);
                return;
            }
            if (!response.ok) throw new Error('Global fetch failed');

            const data = await response.json();
            setGlobalData(data.data);
            localStorage.setItem('nexora_global_data', JSON.stringify(data.data));
            updateSyncTimestamp();
            setIsUpdating(false);
        } catch (error) {
            console.error('Nexora: Cache fallback active (Global Fetch Error)');
            setIsUpdating(true);
        }
    };

    const fetchMarketData = useCallback(async (isInitial = false) => {
        // Throttling: 5 second cool-down for infinite scroll
        const now = Date.now();
        if (!isInitial && now - lastMarketFetchRef.current < 5000) {
            return;
        }

        if (isLoading || (!hasMore && !isInitial)) return;

        setIsLoading(true);
        const currentPage = isInitial ? 1 : page;

        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${currentPage}`);
            if (response.status === 429) {
                console.warn('Nexora: Rate limit hit - using cached market data');
                setIsUpdating(true);
                setIsLoading(false);
                return;
            }
            if (!response.ok) throw new Error('Market fetch failed');

            const data: CoinMarketRow[] = await response.json();

            if (data.length === 0) {
                setHasMore(false);
            } else {
                const mappedCoins = data.map(coin => ({
                    id: coin.id,
                    symbol: coin.symbol.toUpperCase(),
                    name: coin.name,
                    price: coin.current_price,
                    change24h: coin.price_change_percentage_24h,
                    marketCap: coin.market_cap,
                    volume24h: coin.total_volume,
                    image: coin.image
                }));

                setDisplayedCoins(prev => {
                    const newList = isInitial ? mappedCoins : [...prev, ...mappedCoins];
                    localStorage.setItem('nexora_market_data', JSON.stringify(newList));
                    return newList;
                });
                setPage(currentPage + 1);
                lastMarketFetchRef.current = Date.now();

                // Limit to top 50
                if (isInitial && data.length >= 50) {
                    setHasMore(false);
                } else if (!isInitial && displayedCoins.length + data.length >= 50) {
                    setHasMore(false);
                }
            }
            setIsUpdating(false);
        } catch (error) {
            console.error('Nexora: Cache fallback active (Market Fetch Error)');
            setIsUpdating(true);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, page, displayedCoins.length]);

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        document.title = 'Institutional Dashboard | Nexora Capital';
        const key = sessionStorage.getItem('nexora_access_key');
        if (!key) {
            navigate('/');
            return;
        }

        const welcomeSeen = sessionStorage.getItem('nexora_welcome_seen');
        if (!welcomeSeen) {
            setShowWelcomeModal(true);
            setDashboardBlurred(true);
        } else {
            setShowWelcomeModal(false);
            setDashboardBlurred(false);
        }

        fetchGlobalData();
        fetchMarketData(true);

        // 60 second refresh interval
        const interval = setInterval(() => {
            fetchGlobalData();
            // We only refresh the current displayed list in a real app, 
            // but for this dashboard we'll just refresh global data mostly
            // to avoid resetting infinite scroll state unexpectedly.
        }, 60000);

        return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
        if (showWelcomeModal) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [showWelcomeModal]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 200) {
            fetchMarketData();
        }
    };

    const handleDismissModal = () => {
        setShowWelcomeModal(false);
        setDashboardBlurred(false);
        sessionStorage.setItem('nexora_welcome_seen', 'true');
    };

    return (
        <div className="h-screen w-full bg-[#102217] text-white font-display overflow-hidden relative">
            {/* Welcome Modal Overlay */}
            {showWelcomeModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-all duration-500 animate-fade-in" aria-hidden="true"></div>

                    <div className="relative transform overflow-y-auto max-h-[calc(100vh-2rem)] rounded-2xl bg-[#0d1612]/95 backdrop-blur-2xl border border-white/10 text-left shadow-2xl transition-all w-full sm:max-w-lg p-6 sm:p-10 animate-slide-up-fade">
                        <div className="flex flex-col gap-6 text-center">
                            <div className="flex justify-center mb-2">
                                <img src="./assets/logo.svg" alt="Nexora Capital" className="w-10 h-10 sm:w-12 sm:h-12 object-contain animate-bounce-subtle" />
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                Welcome to Nexora
                            </h2>

                            <div className="space-y-4 text-[#9db9a8] text-[13px] sm:text-sm leading-relaxed text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <p>
                                    At Nexora Capital, our mission is to provide qualified participants with the structure, tools, and capital environment required to develop long-term financial discipline and market confidence.
                                </p>
                                <p>
                                    This platform is designed as a controlled investment workspace — combining real-time market exposure, professional portfolio management tools, and guided capital allocation frameworks.
                                </p>
                                <p className="hidden sm:block">
                                    Your account reflects a premium market-accurate environment, allowing you to explore portfolio decisions, capital allocation, and trading behavior under professional conditions.
                                </p>
                                <p className="font-medium text-white pt-2">
                                    You are now part of a private ecosystem built for precision, and progression.
                                </p>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleDismissModal}
                                    className="w-full py-4 px-6 rounded-full bg-[#2bee79] text-[#111814] font-bold text-sm tracking-widest uppercase hover:bg-[#3af585] transition-all duration-300 shadow-[0_0_30px_rgba(43,238,121,0.2)] hover:shadow-[0_0_50px_rgba(43,238,121,0.4)]"
                                >
                                    Skip & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Dashboard Layout */}
            <div className={`flex h-full w-full flex-row transition-all duration-700 ${dashboardBlurred ? 'filter blur-xl' : ''}`}>
                {/* Side Navigation */}
                <Sidebar
                    activePage="market"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#102217] w-full">
                    {/* Top Gradient Overlay */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#2bee79]/5 to-transparent pointer-events-none z-0"></div>

                    <div
                        className="flex-1 overflow-y-auto z-10"
                        onScroll={handleScroll}
                        ref={scrollContainerRef}
                    >
                        {/* Subtle Floating Update Indicator */}
                        {isUpdating && (
                            <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16261f]/80 backdrop-blur-md border border-[#2bee79]/20 shadow-lg animate-fade-in">
                                <div className="w-2 h-2 rounded-full bg-[#2bee79] animate-pulse shadow-[0_0_8px_#2bee79]"></div>
                                <span className="text-[10px] font-bold text-[#2bee79] tracking-widest uppercase">Live Sync Active</span>
                            </div>
                        )}
                        <div className="w-full flex flex-col gap-0 min-h-full">
                            {/* Page Heading & Mobile Menu Trigger */}
                            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 p-6 md:p-8 shrink-0 relative">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between md:justify-start gap-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                className="md:hidden p-2 -ml-2 rounded-xl text-white hover:bg-white/10 transition-colors bg-white/5 flex items-center justify-center"
                                                onClick={() => setIsMobileMenuOpen(true)}
                                            >
                                                <Menu size={24} />
                                            </button>

                                            {/* Mobile Logo */}
                                            <div className="md:hidden flex items-center justify-center">
                                                <div className="h-9 w-9 relative flex items-center justify-center">
                                                    <img src="./assets/logo.svg" alt="Nexora" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(43,238,121,0.3)]" />
                                                </div>
                                            </div>

                                            <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight tracking-tight">Market Overview</h2>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px] sm:text-sm font-medium">
                                        <ShieldCheck size={16} className="text-[#2bee79]/70 shrink-0" />
                                        <span className="truncate">Institutional Grade Analytics</span>
                                        <span className="mx-1 text-gray-600 shrink-0">•</span>
                                        <span id="current-time" className="shrink-0">UTC {currentTime}</span>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                    <button className="flex items-center justify-center gap-2 h-12 md:h-10 px-6 rounded-full border border-white/10 bg-[#16261f]/40 backdrop-blur-md text-white text-sm font-medium hover:bg-white/5 transition-all w-full md:w-auto group">
                                        <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                                        <span>Export Report</span>
                                    </button>
                                    <button className="flex items-center justify-center h-12 md:h-10 px-6 rounded-full bg-[#2bee79] text-[#102217] text-sm font-black tracking-wider uppercase hover:bg-[#3af585] transition-all shadow-[0_4px_20px_rgba(43,238,121,0.4)] w-full md:w-auto active:scale-[0.98]">
                                        Trade Execution
                                    </button>
                                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                                    <Link
                                        to="/search"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#2bee79]/50 text-gray-400 hover:text-[#2bee79] transition-all"
                                    >
                                        <Search size={18} />
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#2bee79]/50 text-gray-400 hover:text-[#2bee79] transition-all relative"
                                    >
                                        <User size={18} />
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-[#2bee79] rounded-full border-2 border-[#102217]"></div>
                                    </Link>
                                </div>
                            </header>

                            {/* Stats Row - Bento Pyramid Grid */}
                            <section className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 px-4 md:px-8 mb-8">
                                {/* Stat Card 1 */}
                                <div className="flex flex-col gap-2 rounded-xl p-[10px] md:p-6 bg-[#16261f] border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-400 text-[10px] md:text-sm font-medium uppercase tracking-widest opacity-80">Global Market Cap</p>
                                        <div className="flex items-center gap-2 text-gray-500 group-hover:text-[#2bee79] transition-colors">
                                            <BarChart3 size={16} className="md:w-5 md:h-5" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-white text-[0.85rem] sm:text-2xl md:text-3xl font-medium md:font-bold tracking-[-0.5px] md:tracking-tight mb-0.5">
                                            {globalData ? `$${globalData.total_market_cap.usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '---'}
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-[#2bee79] shadow-[0_0_8px_rgba(43,238,121,0.5)]'}`}></div>
                                            <p className="text-[9px] text-gray-500 font-bold tracking-wider uppercase">
                                                Synced: <span className="text-white/40">{lastUpdated}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Stat Card 2 */}
                                <div className="flex flex-col gap-2 rounded-xl p-[10px] md:p-6 bg-[#16261f] border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-400 text-[10px] md:text-sm font-medium uppercase tracking-widest opacity-80">24h Volume</p>
                                        <BarChart3 size={16} className="md:w-5 md:h-5 text-gray-500 group-hover:text-[#2bee79] transition-colors" />
                                    </div>
                                    <p className="text-white text-[0.85rem] sm:text-2xl md:text-3xl font-medium md:font-bold tracking-[-0.5px] md:tracking-tight">
                                        {globalData ? `$${globalData.total_volume.usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '---'}
                                    </p>
                                </div>
                                {/* Stat Card 3 - Pyramid Base */}
                                <div className="col-span-2 md:col-span-1 flex flex-col gap-2 rounded-xl p-[10px] md:p-6 bg-[#16261f] border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-400 text-[10px] md:text-sm font-medium uppercase tracking-widest opacity-80">24h Market Change</p>
                                        <PieChart size={16} className="md:w-5 md:h-5 text-gray-500 group-hover:text-[#2bee79] transition-colors" />
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <p className="text-white text-[0.85rem] sm:text-2xl md:text-3xl font-medium md:font-bold tracking-[-0.5px] md:tracking-tight">
                                            {globalData ? `${globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%` : '---'}
                                        </p>
                                        {globalData && (
                                            <div className={`flex h-5 items-center px-1.5 rounded-md ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'bg-[#2bee79]/20 shadow-[0_0_15px_rgba(43,238,121,0.1)]' : 'bg-[#ff5c5c]/20'}`}>
                                                <div className={`w-full h-0.5 relative overflow-hidden rounded-full bg-white/10 min-w-[30px] md:min-w-[40px]`}>
                                                    <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'bg-[#2bee79]' : 'bg-[#ff5c5c]'}`} style={{ width: '60%' }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Filters and Table Section */}
                            <section className="flex flex-col gap-0 flex-1">
                                {/* Chips / Filters */}
                                <div className="flex items-center justify-between px-4 md:px-8 mb-4 mt-8 md:mt-0">
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                        <button className="h-8 md:h-9 px-4 md:px-5 rounded-full bg-white/5 md:bg-[#2bee79] border border-[#2bee79]/30 md:border-none text-[#2bee79] md:text-[#102217] text-[11px] md:text-sm font-medium md:font-bold transition-all hover:bg-[#2bee79]/10 md:hover:bg-[#3af585] shadow-sm whitespace-nowrap">Cryptocurrency Stock</button>
                                    </div>
                                    <div className="hidden md:flex gap-2">
                                        <button className="p-2 rounded-lg bg-[#16261f] border border-white/5 text-gray-400 hover:text-white transition-colors">
                                            <LayoutGrid size={20} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-[#16261f] border border-white/5 text-[#2bee79]">
                                            <List size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Data Table */}
                                <div className="w-full flex-1 border-t border-white/5 bg-[#16261f]/50 backdrop-blur-sm overflow-x-auto overflow-y-hidden">
                                    <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
                                        <thead className="sticky top-0 z-[40] shadow-sm shadow-black/20">
                                            <tr className="border-b border-white/5">
                                                <th className="py-4 pl-4 md:pl-8 pr-2 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest w-[110px] md:w-[30%] min-w-[110px] max-w-[110px] md:min-w-0 md:max-w-none sticky left-0 z-[45] bg-[#0d1612] sticky-shadow">Asset</th>
                                                <th className="py-4 px-2 md:px-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest text-right bg-[#0d1612]">Price</th>
                                                <th className="py-4 px-2 md:px-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest text-right bg-[#0d1612]">24h Change</th>
                                                <th className="py-4 px-2 md:px-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest text-right bg-[#0d1612]">Market Cap</th>
                                                <th className="py-4 pl-2 md:pl-4 pr-4 md:pr-8 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest text-right bg-[#0d1612]">Volume (24h)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 relative z-10 font-display">
                                            {displayedCoins.map((coin) => {
                                                const price = coin.price ?? coin.current_price ?? 0;
                                                const change24h = coin.change24h ?? coin.price_change_percentage_24h ?? 0;
                                                const marketCap = coin.marketCap ?? coin.market_cap ?? 0;
                                                const volume24h = coin.volume24h ?? coin.total_volume ?? 0;
                                                const image = coin.image ?? '';
                                                const name = coin.name ?? 'Unknown';
                                                const symbol = coin.symbol?.toUpperCase() ?? '???';

                                                return (
                                                    <tr key={coin.id} className="hover:bg-white/[0.04] transition-all group cursor-pointer h-[72px] md:h-[80px]" data-coin-id={coin.id}>
                                                        <td className="py-3 md:py-4 pl-4 md:pl-8 pr-2 sticky left-0 z-30 bg-[#102217] group-hover:bg-[#162a1e] transition-colors sticky-shadow w-[110px] min-w-[110px] max-w-[110px] md:w-auto md:min-w-0 md:max-w-none">
                                                            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                                                <div className="w-7 h-7 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-lg">
                                                                    <img
                                                                        src={image}
                                                                        alt={name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${symbol}&background=random&color=fff&size=64`;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <div className="text-white font-black text-[13px] md:text-base tracking-tight truncate">{name}</div>
                                                                    <div className="text-[#2bee79]/70 text-[9px] md:text-xs font-black tracking-[0.05em] uppercase">{symbol}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                                                            <div className="text-white font-medium text-[13px] md:text-sm tabular-nums tracking-wide">
                                                                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: price < 1 ? 6 : 2 })}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                                                            <div className={`font-bold text-[13px] md:text-sm tabular-nums flex items-center justify-end gap-1 ${change24h >= 0 ? 'text-[#2bee79]' : 'text-[#ff5c5c]'}`}>
                                                                {change24h >= 0 ? (
                                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#2bee79" className="md:w-[10px] md:h-[10px]">
                                                                        <path d="M12 4l-10 16h20z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#ff5c5c" className="md:w-[10px] md:h-[10px]">
                                                                        <path d="M12 20l10-16h-20z" />
                                                                    </svg>
                                                                )}
                                                                {Math.abs(change24h).toFixed(2)}%
                                                            </div>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                                                            <div className="text-gray-300 text-[13px] md:text-sm tabular-nums">
                                                                ${marketCap.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 md:py-4 pl-2 md:pl-4 pr-4 md:pr-8 text-right">
                                                            <div className="text-gray-400 text-[12px] md:text-sm tabular-nums font-medium">
                                                                ${volume24h.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* Skeleton Loading State */}
                                            {isLoading && (
                                                Array.from({ length: 3 }).map((_, i) => (
                                                    <tr key={`skeleton-${i}`} className="animate-pulse h-[72px] md:h-[80px]">
                                                        <td className="py-3 md:py-4 pl-4 md:pl-8 pr-2 sticky left-0 z-30 bg-[#102217] sticky-shadow w-[110px] min-w-[110px] max-w-[110px] md:w-auto md:min-w-0 md:max-w-none">
                                                            <div className="flex items-center gap-2 md:gap-4">
                                                                <div className="w-7 h-7 md:w-11 md:h-11 rounded-full bg-white/10 shadow-lg"></div>
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="h-3 md:h-4 w-16 md:w-24 bg-white/10 rounded"></div>
                                                                    <div className="h-2 md:h-3 w-8 md:w-12 bg-white/5 rounded"></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 md:px-4 text-right"><div className="h-3 md:h-4 w-14 md:w-20 bg-white/10 rounded ml-auto"></div></td>
                                                        <td className="px-2 md:px-4 text-right"><div className="h-3 md:h-4 w-10 md:w-16 bg-white/10 rounded ml-auto"></div></td>
                                                        <td className="px-2 md:px-4 text-right"><div className="h-3 md:h-4 w-20 md:w-32 bg-white/10 rounded ml-auto"></div></td>
                                                        <td className="pl-2 md:pl-4 pr-4 md:pr-8 text-right"><div className="h-3 md:h-4 w-16 md:w-28 bg-white/10 rounded ml-auto"></div></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
