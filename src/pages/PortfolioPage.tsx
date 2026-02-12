import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import logoUrl from '../assets/icons/logo.svg';
import Sidebar from '../components/Sidebar';
import {
    Menu,
    ShieldCheck,
    Plus,
    ArrowUpRight,
    Wallet,
    Landmark,
    Building2,
    MoreVertical,
    ChevronDown,
    Search,
    User
} from 'lucide-react';

interface CoinHolding {
    id: string;
    symbol: string;
    name: string;
    image: string;
    price: number;
    change24h: number;
    quantity: number;
    value: number;
}

import { INITIAL_VALUES_USD } from '../config/portfolio';


const PortfolioPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    // Portfolio State
    const [depositedCapital] = useState(5000.00); // User requested $200 for demo, but HTML says $250,000. I'll use $250,000 for visual consistency with screenshot but follow the 30% logic.
    // Wait, user specifically said: "Allocation = Deposited Capital * 1.30. (e.g., If Deposit is $200, Allocation displays $60 and available balance display 260)."
    // So Institutional Allocation is 30% of Deposited Capital, and Total is 130%.

    const [holdings, setHoldings] = useState<CoinHolding[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const institutionalAllocation = depositedCapital * 0.30;
    // Actually, I'll just follow the user's formula: Allocation = 30%, Total = 130%.
    const totalInstitutionalValue = depositedCapital + institutionalAllocation;

    const fetchHoldingsData = useCallback(async () => {
        setIsUpdating(true);
        try {
            // Fetch top 10 to ensure we have BTC, ETH, USDT, BNB, SOL
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
            if (!response.ok) throw new Error('Fetch failed');
            const data = await response.json();

            // Persist for caching
            localStorage.setItem('nexora_market_data', JSON.stringify(data));

            const targetSymbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'];
            const filteredHoldings = data
                .filter((coin: any) => coin && coin.symbol && targetSymbols.includes(coin.symbol.toUpperCase()))
                .map((coin: any) => {
                    const symbol = (coin.symbol || '').toUpperCase();
                    const targetValueUSD = INITIAL_VALUES_USD[symbol] || 0;
                    const price = coin.current_price || 0;
                    const quantity = price > 0 ? targetValueUSD / price : 0;

                    return {
                        id: coin.id || Math.random().toString(),
                        symbol: symbol,
                        name: coin.name || 'Unknown',
                        image: coin.image || '',
                        price: price,
                        change24h: coin.price_change_percentage_24h || 0,
                        quantity: quantity,
                        value: targetValueUSD
                    };
                });


            setHoldings(filteredHoldings);
            setIsUpdating(false);
            setIsLoading(false);
        } catch (error) {
            console.error('Portfolio Fetch Error:', error);
            setIsUpdating(false);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        document.title = 'Digital Portfolio | Nexora Capital';
        const key = sessionStorage.getItem('nexora_access_key');
        if (!key) {
            navigate('/');
            return;
        }

        // Phase 3: Immediate bootstrap from cache
        const cachedData = localStorage.getItem('nexora_market_data');
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                if (Array.isArray(parsed)) {
                    const targetSymbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'];
                    const filtered = parsed
                        .filter((coin: any) => coin && coin.symbol && targetSymbols.includes(coin.symbol.toUpperCase()))
                        .map((coin: any) => {
                            const symbol = (coin.symbol || '').toUpperCase();
                            const targetValueUSD = INITIAL_VALUES_USD[symbol] || 0;
                            const price = coin.current_price || 0;
                            const quantity = price > 0 ? targetValueUSD / price : 0;

                            return {
                                id: coin.id || Math.random().toString(),
                                symbol: symbol,
                                name: coin.name || 'Unknown',
                                image: coin.image || '',
                                price: price,
                                change24h: coin.price_change_percentage_24h || 0,
                                quantity: quantity,
                                value: targetValueUSD
                            };
                        });

                    if (filtered.length > 0) {
                        setHoldings(filtered);
                        setIsLoading(false);
                    }
                }
            } catch (e) {
                console.error("Cache bootstrap failed", e);
            }
        }

        fetchHoldingsData();
        const interval = setInterval(fetchHoldingsData, 60000);
        return () => clearInterval(interval);
    }, [navigate, fetchHoldingsData]);

    return (
        <div className="h-screen w-full bg-[#102217] text-white font-display overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Main Layout */}
            <div className="flex h-full w-full flex-row">
                {/* Side Navigation */}
                <Sidebar
                    activePage="portfolio"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#102217] w-full">
                    {/* Top Gradient Overlay */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#2bee79]/5 to-transparent pointer-events-none z-0"></div>

                    <div className="flex-1 overflow-y-auto z-10 custom-scrollbar shadow-inner">
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
                                                    <img src="./assets/logo.svg" alt="Nexora" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(43,238,121,0.3)] animate-pulse-slow" />
                                                </div>
                                            </div>

                                            <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight tracking-tight">My Portfolio</h2>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px] sm:text-sm font-medium">
                                        <ShieldCheck size={16} className="text-[#2bee79]/70 shrink-0" />
                                        <span className="truncate">Institutional Grade Analytics</span>
                                        <span className="mx-1 text-gray-600 shrink-0">•</span>
                                        <span id="current-time" className="shrink-0">UTC {currentTime}</span>
                                    </div>
                                </div>

                                {/* Header Actions - Hidden on Mobile for Purification */}
                                <div className="hidden md:flex items-center gap-3 self-end md:self-auto">
                                    <Link
                                        to="/search"
                                        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 hover:border-[#2bee79]/50 text-gray-400 hover:text-[#2bee79] transition-all"
                                    >
                                        <Search size={20} />
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 hover:border-[#2bee79]/50 text-gray-400 hover:text-[#2bee79] transition-all relative"
                                    >
                                        <User size={20} />
                                        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#2bee79] rounded-full border-2 border-[#102217]"></div>
                                    </Link>
                                </div>
                            </header>

                            {/* Portfolio Stats Section */}
                            <div className="px-4 md:px-8 pb-8 flex flex-col gap-4 md:gap-8">
                                <section className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
                                    {/* Deposited Capital Card */}
                                    <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#16261f] border border-white/5 shadow-sm flex flex-col justify-between min-h-[120px] md:min-h-[160px] relative overflow-hidden group">
                                        <div className="flex justify-between items-start relative z-10">
                                            <span className="text-gray-400 font-medium text-[10px] md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal">
                                                Deposited <span className="hidden md:inline">Capital</span>
                                            </span>
                                            <span className="p-1.5 md:p-2 bg-white/5 rounded-full text-gray-500">
                                                <Landmark size={14} className="md:w-5 md:h-5" />
                                            </span>
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-white text-base md:text-2xl lg:text-3xl font-bold tracking-tight">
                                                ${depositedCapital.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <ArrowUpRight size={12} className="text-[#2bee79]" />
                                                <span className="text-[#2bee79] text-[10px] md:text-[13px] font-bold tracking-tight">+5.0%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Institutional Allocation Card */}
                                    <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#16261f] border border-white/5 shadow-sm flex flex-col justify-between min-h-[120px] md:min-h-[160px] relative overflow-hidden group">
                                        <div className="flex justify-between items-start relative z-10">
                                            <span className="text-gray-400 font-medium text-[10px] md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal">
                                                Allocation <span className="hidden md:inline">Institutional</span>
                                            </span>
                                            <span className="p-1.5 md:p-2 bg-white/5 rounded-full text-gray-500">
                                                <Building2 size={14} className="md:w-5 md:h-5" />
                                            </span>
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-white text-base md:text-2xl lg:text-3xl font-bold tracking-tight">
                                                ${institutionalAllocation.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">1.30x Leverage</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Available Balance Card */}
                                    <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#28392f] border border-[#2bee79]/20 shadow-lg flex flex-col justify-between min-h-[120px] md:min-h-[160px] relative overflow-hidden group">
                                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2bee79]/20 blur-[60px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[#2bee79]/30"></div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <span className="text-white/80 font-medium text-[10px] md:text-sm uppercase tracking-wider md:normal-case md:tracking-normal whitespace-nowrap">
                                                Available <span className="hidden md:inline">Balance</span>
                                            </span>
                                            <span className="p-1.5 md:p-2 bg-[#2bee79]/20 rounded-full text-[#2bee79]">
                                                <Wallet size={14} className="md:w-5 md:h-5" />
                                            </span>
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-white text-base md:text-2xl lg:text-3xl font-bold tracking-tight">
                                                ${totalInstitutionalValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2bee79] animate-pulse"></div>
                                                <span className="text-[#2bee79] text-[10px] font-bold uppercase tracking-tighter">Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:hidden flex flex-col justify-end h-full">
                                        <div className="flex flex-row items-center gap-2 w-full h-11">
                                            <Link to="/funding" className="flex-1 flex flex-row items-center justify-center gap-2 h-full rounded-xl bg-[#2bee79]/90 text-[#102217] active:scale-[0.95] transition-all shadow-lg overflow-hidden">
                                                <Plus size={16} strokeWidth={3} />
                                                <span className="text-[12px] font-black uppercase tracking-tight whitespace-nowrap">Top Up</span>
                                            </Link>
                                            <Link to="/withdraw" className="flex-1 flex flex-row items-center justify-center gap-2 h-full rounded-xl bg-white/5 border border-white/10 text-white active:scale-[0.95] transition-all overflow-hidden">
                                                <ArrowUpRight size={16} strokeWidth={2.5} />
                                                <span className="text-[12px] font-black uppercase tracking-tight whitespace-nowrap">Out</span>
                                            </Link>
                                        </div>
                                    </div>
                                </section>

                                <section className="hidden md:flex items-center gap-4">
                                    <Link to="/funding" className="flex items-center gap-2 px-10 py-3.5 rounded-full bg-[#2bee79] text-[#102217] font-black text-sm uppercase tracking-widest hover:bg-[#3af585] transition-all shadow-[0_4px_20px_rgba(43,238,121,0.3)] active:scale-[0.98]">
                                        <Plus size={18} strokeWidth={3} />
                                        Top Up
                                    </Link>
                                    <Link to="/withdraw" className="flex items-center gap-2 px-10 py-3.5 rounded-full bg-white/5 text-white font-bold text-sm border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]">
                                        <ArrowUpRight size={18} strokeWidth={2.5} />
                                        Withdraw
                                    </Link>
                                </section>

                                {/* Holdings Table Section */}
                                <section className="flex flex-col gap-4 mt-2 md:mt-4">
                                    <div className="flex items-center justify-between px-1 md:px-0">
                                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Holdings</h3>
                                    </div>
                                    <div className="w-[calc(100%+2rem)] -ml-4 md:w-full md:ml-0 overflow-x-auto md:rounded-2xl border-y border-x-0 md:border border-white/10 md:border-white/5 bg-transparent md:bg-[#16261f]/50 backdrop-blur-sm shadow-sm md:shadow-none">
                                        <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
                                            <thead>
                                                <tr className="border-b border-white/5 text-gray-500 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em]">
                                                    <th className="py-3 md:py-4 pl-4 md:pl-8 pr-2 font-bold whitespace-nowrap w-[100px] md:w-[25%] min-w-[100px] max-w-[100px] md:min-w-0 md:max-w-none sticky left-0 z-40 bg-[#102217] md:bg-[#0d1612] sticky-shadow">Asset</th>
                                                    <th className="py-3 md:py-4 px-2 md:px-6 font-bold text-right whitespace-nowrap bg-[#102217] md:bg-[#0d1612]">Price</th>
                                                    <th className="py-3 md:py-4 px-2 md:px-6 font-bold text-right whitespace-nowrap bg-[#102217] md:bg-[#0d1612]">Quantity</th>
                                                    <th className="py-3 md:py-4 px-2 md:px-6 font-bold text-right whitespace-nowrap bg-[#102217] md:bg-[#0d1612]">Value</th>
                                                    <th className="py-3 md:py-4 px-2 md:px-6 font-bold text-right whitespace-nowrap bg-[#102217] md:bg-[#0d1612]">24h Change</th>
                                                    <th className="py-3 md:py-4 px-4 md:px-6 font-bold text-center whitespace-nowrap bg-[#102217] md:bg-[#0d1612]">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 font-display">
                                                {!isLoading ? holdings.map((coin) => (
                                                    <tr key={coin.id} className="group hover:bg-white/[0.04] transition-all cursor-pointer h-[72px] md:h-[80px]">
                                                        <td className="py-3 md:py-4 pl-4 md:pl-8 pr-2 sticky left-0 z-30 bg-[#102217] group-hover:bg-[#162a1e] transition-colors sticky-shadow w-[110px] min-w-[110px] max-w-[110px] md:w-auto md:min-w-0 md:max-w-none">
                                                            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                                                <div className="w-7 h-7 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-lg border border-white/5">
                                                                    <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="text-white font-black text-[13px] md:text-base tracking-tight truncate">{coin.name}</span>
                                                                    <span className="text-[#2bee79]/70 text-[9px] md:text-[10px] font-black tracking-widest uppercase">{coin.symbol}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-6 text-right whitespace-nowrap">
                                                            <span className="text-white font-bold text-[13px] md:text-sm tabular-nums tracking-wide">
                                                                ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-6 text-right whitespace-nowrap">
                                                            <span className="text-gray-300 font-medium text-[13px] md:text-sm tabular-nums">
                                                                {coin.symbol === 'USDT'
                                                                    ? Math.floor(coin.quantity).toLocaleString('en-US')
                                                                    : coin.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {coin.symbol}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-6 text-right whitespace-nowrap">
                                                            <span className="text-white font-black text-[13px] md:text-sm tabular-nums">
                                                                ${(coin.quantity * coin.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-6 text-right whitespace-nowrap">
                                                            <div className={`inline-flex items-center gap-1 font-bold text-[13px] md:text-sm tabular-nums ${coin.change24h >= 0 ? 'text-[#2bee79]' : 'text-[#ff5c5c]'}`}>
                                                                {coin.change24h >= 0 ? (
                                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M12 4l-10 16h20z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M12 20l10-16h-20z" />
                                                                    </svg>
                                                                )}
                                                                {Math.abs(coin.change24h).toFixed(2)}%
                                                            </div>
                                                        </td>
                                                        <td className="py-3 md:py-4 px-2 md:px-6 text-center whitespace-nowrap">
                                                            <button className="w-8 h-8 rounded-full hover:bg-white/10 inline-flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                                                <MoreVertical size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    Array.from({ length: 5 }).map((_, i) => (
                                                        <tr key={`skeleton-${i}`} className="animate-pulse h-[72px] md:h-[80px]">
                                                            <td className="py-3 md:py-4 pl-4 md:pl-8 pr-2 sticky left-0 z-30 bg-[#102217] sticky-shadow w-[110px] min-w-[110px] max-w-[110px] md:w-auto md:min-w-0 md:max-w-none">
                                                                <div className="flex items-center gap-2 md:gap-4">
                                                                    <div className="w-7 h-7 md:w-11 md:h-11 rounded-full bg-white/10"></div>
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="h-3 md:h-4 w-16 md:w-24 bg-white/10 rounded"></div>
                                                                        <div className="h-2 md:h-3 w-8 md:w-12 bg-white/5 rounded"></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 md:px-6 text-right"><div className="h-3 md:h-4 w-14 md:w-20 bg-white/10 rounded ml-auto"></div></td>
                                                            <td className="px-2 md:px-6 text-right"><div className="h-3 md:h-4 w-14 md:w-16 bg-white/10 rounded ml-auto"></div></td>
                                                            <td className="px-2 md:px-6 text-right"><div className="h-3 md:h-4 w-16 md:w-24 bg-white/10 rounded ml-auto"></div></td>
                                                            <td className="px-2 md:px-6 text-right"><div className="h-3 md:h-4 w-10 md:w-16 bg-white/10 rounded ml-auto"></div></td>
                                                            <td className="px-4 md:px-6 text-center"><div className="h-8 w-8 rounded-full bg-white/10 mx-auto"></div></td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Performance & Analytics Section */}
                                <section className="flex flex-row md:grid md:grid-cols-2 gap-2 md:gap-6 pb-6">
                                    {/* Performance Analytics Card */}
                                    <div className="flex-1 p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#16261f] border border-white/5 shadow-sm min-h-[160px] md:min-h-0 flex flex-col justify-between overflow-hidden">
                                        <div className="flex items-center justify-between mb-4 md:mb-8">
                                            <h4 className="font-bold text-white text-[13px] md:text-lg tracking-tight">Performance</h4>
                                            <button className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] md:text-xs font-bold text-gray-400 hover:text-white transition-colors">
                                                <span className="md:hidden">7D</span>
                                                <span className="hidden md:inline">Last 7 Days</span>
                                                <ChevronDown size={12} className="opacity-50 md:w-[14px] md:h-[14px]" />
                                            </button>
                                        </div>
                                        <div className="h-24 md:h-44 w-full flex items-end gap-1.5 md:gap-3 px-1 md:px-2 pb-1">
                                            {[45, 60, 40, 75, 50, 65, 90].map((h, i) => (
                                                <div key={i} className="flex-1 group relative h-full flex items-end">
                                                    <div
                                                        className={`w-full rounded-t-full transition-all duration-700 cursor-pointer ${i === 6 ? 'bg-[#2bee79] shadow-[0_0_25px_rgba(43,238,121,0.3)]' : 'bg-white/10 hover:bg-white/20'}`}
                                                        style={{ height: `${h}%` }}
                                                    ></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Asset Allocation Card */}
                                    <div className="flex-1 p-3 md:p-6 rounded-xl md:rounded-2xl bg-[#16261f] border border-white/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 min-h-[140px] md:min-h-0 overflow-hidden">
                                        <div className="w-full md:w-auto">
                                            <h4 className="font-bold text-white text-[10px] md:text-base tracking-tight mb-0.5 md:mb-2 truncate">Allocation</h4>
                                            <p className="hidden md:block text-sm text-gray-400 mb-6 font-medium">Diversified across 5 assets</p>
                                            <ul className="space-y-1 md:space-y-4">
                                                <li className="flex items-center gap-1.5 md:gap-3 text-[8px] md:text-xs font-bold text-gray-300 uppercase tracking-widest truncate">
                                                    <span className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-[#f7931a]"></span>
                                                    BTC (38%)
                                                </li>
                                                <li className="flex items-center gap-1.5 md:gap-3 text-[8px] md:text-xs font-bold text-gray-300 uppercase tracking-widest truncate">
                                                    <span className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-[#627eea]"></span>
                                                    ETH (44%)
                                                </li>
                                                <li className="hidden md:flex items-center gap-3 text-xs font-bold text-gray-300 uppercase tracking-widest">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#2bee79]"></span>
                                                    NEX (18%)
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="relative w-12 h-12 md:w-40 md:h-40 flex items-center justify-center shrink-0">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="100.48" className="text-[#627eea] md:stroke-[10] stroke-[8]" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="md:text-lg font-black text-white text-[9px] tracking-tighter">100%</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PortfolioPage;
