import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import logoUrl from '../assets/icons/logo.svg';
import Sidebar from '../components/Sidebar';
import {
    Menu,
    ShieldCheck,
    ArrowUpRight,
    QrCode,
    Shield,
    Copy,
    CheckCircle2,
    AlertTriangle,
    Timer,
    Lock
} from 'lucide-react';

interface Asset {
    id: string;
    symbol: string;
    name: string;
    network: string;
    image: string;
    color: string;
    address: string;
    instruction: string;
}

const assets: Asset[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        network: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        color: '#f7931a',
        address: 'bc1qq675uyxhhjxkqhy96vsxas334gasa6n39eejgx',
        instruction: 'Only send BTC to this address on the Bitcoin network. Sending other assets may result in permanent loss.'
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        network: 'Ethereum (ERC-20)',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        color: '#627eea',
        address: '0x462b2948041deCb05f26D818201B5b1dA0dE92Bb',
        instruction: 'Only send ETH to this address on the Ethereum (ERC-20) network. Sending other assets may result in permanent loss.'
    },
    {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether',
        network: 'TRC-20 (Tron Network)',
        image: 'https://assets.coingecko.com/coins/images/325/large/tether.png',
        color: '#26a17b',
        address: 'TDqfcCCLKwzadBvdmBs4UrgRrMQgJm8CX3',
        instruction: 'Strictly TRC-20 (Tron). Sending USDT via other networks will result in the permanent loss of funds.'
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        network: 'Solana',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        color: '#14f195',
        address: '385zWNCGmMiG5Y44WLyrqteRUR726gzFWBeFdoc1FeVb',
        instruction: 'Only send SOL to this address on the Solana network. Sending other assets may result in permanent loss.'
    }
];

const FundingPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset>(assets[0]);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    // Secure Vault States
    const [isGenerating, setIsGenerating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
    const [copySuccess, setCopySuccess] = useState(false);
    const [refId, setRefId] = useState('');


    useEffect(() => {
        const timeTimer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timeTimer);
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (showModal && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showModal, timeLeft]);

    useEffect(() => {
        document.title = 'Account Funding | Nexora Capital';
        const key = sessionStorage.getItem('nexora_access_key');
        if (!key) {
            navigate('/');
            return;
        }
    }, [navigate]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        const delay = Math.floor(Math.random() * (10000 - 7000 + 1)) + 7000;

        setTimeout(() => {
            setIsGenerating(false);
            setShowModal(true);
            setTimeLeft(3600);
        }, delay);
    };

    const getNetworkFee = (symbol: string) => {
        switch (symbol) {
            case 'BTC': return '0.0004 BTC';
            case 'ETH': return '0.0021 ETH';
            case 'SOL': return '0.00005 SOL';
            case 'USDT': return '1.00 USDT';
            default: return '0.0000 ETH';
        }
    };

    const handleCompleteTransfer = () => {
        const randomRef = `NX-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
        setRefId(randomRef);
        setShowModal(false);
        setShowSuccessModal(true);
    };
    const handleCopy = async (text: string) => {
        const performCopy = async () => {
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (err) {
                    console.error('Clipboard API failed, trying fallback', err);
                }
            }

            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                textArea.style.top = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                console.error('Fallback copy failed', err);
                return false;
            }
        };

        const success = await performCopy();
        if (success) {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

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
                    activePage="none"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#102217] w-full">
                    {/* Top Gradient Overlay */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#2bee79]/5 to-transparent pointer-events-none z-0"></div>

                    <div className="flex-1 overflow-y-auto z-10 custom-scrollbar">
                        <div className="w-full max-w-7xl mx-auto flex flex-col gap-0 min-h-full">
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
                                            <Link to="/dashboard" className="md:hidden flex items-center justify-center">
                                                <div className="h-9 w-9 relative flex items-center justify-center">
                                                    <img src="./assets/logo.svg" alt="Nexora" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(43,238,121,0.3)]" />
                                                </div>
                                            </Link>

                                            <h1 className="text-white text-2xl md:text-5xl font-bold leading-tight tracking-tight">Fund Your Account</h1>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base max-w-2xl font-medium mt-1">
                                        Select an asset to generate a secure deposit address for your institutional portfolio.
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                        <ShieldCheck size={16} className="text-[#2bee79]/70" />
                                        <span id="current-time">UTC {currentTime}</span>
                                    </div>
                                </div>
                            </header>

                            <div className="px-6 md:px-8 pb-12 flex flex-col lg:flex-row items-start gap-6 md:gap-8 min-h-0">
                                {/* Section 1: Select Funding Asset */}
                                <div className="flex flex-col gap-6 flex-1">
                                    <h3 className="text-lg font-bold text-white tracking-tight shrink-0">1. Select Asset</h3>
                                    <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-4">
                                        {assets.map((asset) => (
                                            <button
                                                key={asset.id}
                                                onClick={() => setSelectedAsset(asset)}
                                                className={`
                                                    relative group flex flex-col items-center justify-center gap-1 md:gap-4 rounded-xl md:rounded-2xl p-2 md:p-4 transition-all duration-300 border aspect-square md:aspect-auto
                                                    ${selectedAsset.id === asset.id
                                                        ? 'bg-[#2bee79]/5 border-[#2bee79] shadow-[0_0_20px_rgba(43,238,121,0.15)] scale-[1.02]'
                                                        : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                                    }
                                                `}
                                            >
                                                {selectedAsset.id === asset.id && (
                                                    <div className="absolute top-3 right-3 text-[#2bee79] animate-fade-in hidden md:block">
                                                        <Shield size={16} fill="currentColor" className="opacity-80" />
                                                    </div>
                                                )}
                                                <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-black/40 flex items-center justify-center p-1.5 md:p-2.5 shadow-inner border border-white/10 shrink-0">
                                                    <img src={asset.image} alt={asset.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex flex-col items-center text-center">
                                                    <span className="hidden md:block text-sm font-black text-white tracking-tight leading-tight">{asset.name}</span>
                                                    <span className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest md:mt-0.5">{asset.symbol}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 2: Deposit Details */}
                                <div className="flex-[1.2] flex flex-col">
                                    <div className="flex flex-col gap-6 p-6 md:p-8 rounded-2xl bg-[#16261f] border border-white/5 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2bee79]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-1000 group-hover:bg-[#2bee79]/10"></div>

                                        <div className="flex flex-wrap gap-y-4 justify-between items-center relative z-10 font-display shrink-0">
                                            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">2. Deposit Details</h3>
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2bee79]/10 border border-[#2bee79]/20">
                                                <ShieldCheck size={14} className="text-[#2bee79]" />
                                                <span className="text-[10px] font-bold text-[#2bee79] uppercase tracking-wider">Secure Transfer</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 relative z-10 pt-2 flex-1 justify-center">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                <p className="text-[13px] md:text-sm text-gray-400 leading-relaxed font-medium">
                                                    You have selected <strong className="text-white">{selectedAsset.name} ({selectedAsset.symbol})</strong>.
                                                    Please ensure you are sending only {selectedAsset.symbol} to this address.
                                                </p>
                                                <div className="mt-3 flex flex-col gap-2">
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#2bee79]/70">
                                                        <span>Network</span>
                                                        <span className="text-white">{selectedAsset.network}</span>
                                                    </div>
                                                    <div className="h-px bg-white/5 w-full"></div>
                                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                        <span>Status</span>
                                                        <span className="text-[#2bee79]">3 Confirmations Required</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center justify-center gap-4 py-6 md:py-8 bg-black/20 rounded-2xl border border-white/5">
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/5 flex items-center justify-center p-5 shadow-inner border border-dashed border-white/20 group/qr cursor-pointer hover:bg-white/10 transition-all duration-500">
                                                    <QrCode size={48} className="text-gray-600 group-hover/qr:text-[#2bee79] transition-colors duration-500" strokeWidth={1.5} />
                                                </div>

                                                <div className="flex flex-col gap-3 w-full px-6 md:px-10">
                                                    <button
                                                        onClick={handleGenerate}
                                                        disabled={isGenerating}
                                                        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-12 px-6 ${isGenerating ? 'bg-[#2bee79]/50' : 'bg-[#2bee79]'} text-[#102217] text-sm md:text-base font-black tracking-tight hover:bg-[#3af585] hover:shadow-[0_0_30px_rgba(43,238,121,0.3)] transition-all active:scale-[0.98] disabled:cursor-not-allowed`}
                                                    >
                                                        {isGenerating ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-4 h-4 border-2 border-[#102217]/30 border-t-[#102217] rounded-full animate-spin"></div>
                                                                <span>Generating Secure Vault...</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span>Generate {selectedAsset.symbol} Address</span>
                                                                <ArrowUpRight size={18} />
                                                            </>
                                                        )}
                                                    </button>
                                                    <p className="text-[9px] md:text-[10px] text-center text-gray-500 font-bold uppercase tracking-[0.2em]">
                                                        Encrypted Generation Active
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 text-center relative z-10 shrink-0">
                                            <p className="text-[10px] md:text-xs text-gray-500 font-medium italic">
                                                Funds will be reflected automatically in your portfolio after network verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secure Vault Modal Overlay */}
                    {showModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[12px] brightness-[0.5]" onClick={() => setShowModal(false)}></div>

                            <div className="relative w-full max-w-[500px] rounded-2xl bg-[#16261f] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5 border-t-2 border-t-[#2bee79] animate-fade-in scale-in flex flex-col md:w-[80%] mx-auto md:max-h-[85vh] md:h-auto overflow-hidden">
                                {/* Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex flex-col gap-6">
                                    <div className="flex flex-col items-center border-b border-white/5 pb-6 bg-black/5 -mx-8 -mt-8 pt-8">
                                        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-white px-8">Deposit Address Generated</h2>
                                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-gray-400 mb-6 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5"><Lock size={12} className="text-[#2bee79]" /> ID: 8823-X9</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                            <span className="text-[#2bee79]">Awaiting Funds</span>
                                        </div>

                                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${timeLeft <= 300 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#2bee79]/10 border-[#2bee79]/20'}`}>
                                            <Timer size={18} className={timeLeft <= 300 ? 'text-amber-500 animate-pulse' : 'text-[#2bee79]'} />
                                            <span className={`text-[10px] md:text-xs font-semibold uppercase tracking-wide ${timeLeft <= 300 ? 'text-amber-500' : 'text-gray-400'}`}>Expires in</span>
                                            <span className={`font-mono text-lg md:text-xl font-bold tracking-widest tabular-nums ${timeLeft <= 300 ? 'text-amber-500' : 'text-white'}`}>{formatTime(timeLeft)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-2">
                                        <label className="block text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-500 pl-2">
                                            {selectedAsset.network} Deposit Address
                                        </label>
                                        <div className="group flex items-center gap-2 rounded-xl bg-black/40 p-2 pl-4 border border-white/5 hover:border-[#2bee79]/30 transition-all">
                                            <p className="flex-1 font-mono text-xs md:text-sm text-[#2bee79] truncate break-all selection:bg-[#2bee79] selection:text-[#102217]">
                                                {selectedAsset.address}
                                            </p>
                                            <button
                                                onClick={() => handleCopy(selectedAsset.address)}
                                                className="flex items-center justify-center size-10 md:size-11 rounded-lg bg-white/5 text-white shadow-sm hover:bg-[#2bee79] hover:text-[#102217] active:bg-[#2bee79] active:text-[#102217] active:scale-90 transition-all shrink-0"
                                            >
                                                {copySuccess ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex gap-3 rounded-xl p-4 border items-start transition-all ${selectedAsset.symbol === 'USDT' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                        <div className="relative flex-shrink-0 mt-0.5">
                                            <AlertTriangle size={18} className={selectedAsset.symbol === 'USDT' ? 'text-red-500' : 'text-amber-500'} />
                                            {selectedAsset.symbol === 'USDT' && <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>}
                                        </div>
                                        <div className="text-xs md:text-sm leading-relaxed font-medium">
                                            <span className={`font-bold block mb-0.5 ${selectedAsset.symbol === 'USDT' ? 'text-red-500' : 'text-amber-500'}`}>Network Warning:</span>
                                            <span className="text-gray-300">{selectedAsset.instruction}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Persistent Footer Actions */}
                                <div className="p-6 md:p-8 pt-0 flex flex-col gap-4 bg-transparent mt-2">
                                    <button
                                        onClick={handleCompleteTransfer}
                                        className="w-full rounded-full bg-[#2bee79] h-12 md:h-14 text-[#102217] font-black text-sm md:text-base hover:bg-[#3af585] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(43,238,121,0.2)] flex items-center justify-center gap-2"
                                    >
                                        <span>I’ve Completed the Transfer</span>
                                        <CheckCircle2 size={18} />
                                    </button>

                                    <div className="text-center">
                                        <button className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#2bee79] transition-colors">
                                            <span>Secure Institutional Portal • TLS 1.3 Active</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transfer Submitted Success Modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-[12px] brightness-[0.5]" onClick={() => setShowSuccessModal(false)}></div>

                            <div className="relative w-full max-w-[480px] rounded-3xl bg-[#16261f] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5 animate-fade-in scale-in flex flex-col mx-auto text-center md:max-h-[85vh] md:h-auto overflow-hidden">
                                {/* Decorative Top Gradient */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2bee79] to-transparent opacity-50 z-20"></div>

                                {/* Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 flex flex-col items-center">
                                    {/* Success Icon */}
                                    <div className="mb-6 relative shrink-0">
                                        <div className="absolute inset-0 bg-[#2bee79]/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                                        <div className="relative w-20 h-20 rounded-full border-2 border-[#2bee79]/30 flex items-center justify-center bg-[#1A2E22] shadow-[0_0_30px_rgba(43,238,121,0.2)]">
                                            <CheckCircle2 size={40} className="text-[#2bee79]" strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-3">Transfer Submitted</h2>
                                    <p className="text-gray-400 text-sm md:text-base font-normal leading-relaxed mb-8 max-w-[320px]">
                                        Your transfer has been successfully queued on the blockchain. Your balance will reflect the changes within 5 minutes.
                                    </p>

                                    {/* Receipt Mini-Card */}
                                    <div className="w-full bg-black/30 rounded-2xl p-5 border border-white/5 text-left mb-2">
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                            <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Recipient</span>
                                            <span className="text-[#2bee79] font-mono text-xs font-medium">
                                                {selectedAsset.address.substring(0, 6)}...{selectedAsset.address.substring(selectedAsset.address.length - 4)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Network Fee</span>
                                            <span className="text-gray-300 font-mono text-xs font-medium">{getNetworkFee(selectedAsset.symbol)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Persistent Footer Actions */}
                                <div className="p-8 md:p-10 pt-0 flex flex-col items-center gap-6 bg-transparent">
                                    {/* Reference ID */}
                                    <div className="inline-flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                        <Shield size={12} className="text-gray-500" />
                                        <span className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-wider">Ref: {refId}</span>
                                    </div>

                                    <button
                                        onClick={() => navigate('/portfolio')}
                                        className="w-full h-12 md:h-14 rounded-full bg-[#2bee79] hover:bg-[#3af585] text-[#102217] text-sm md:text-base font-black tracking-wide transition-all shadow-[0_0_20px_rgba(43,238,121,0.2)] hover:shadow-[0_0_30px_rgba(43,238,121,0.4)] active:scale-[0.98]"
                                    >
                                        Return to Portfolio
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>


        </div>
    );
};

export default FundingPage;
