import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    Menu,
    ShieldCheck,
    Check,
    UserPlus as PersonAdd,
    Headset as SupportAgent,
    Activity
} from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    useEffect(() => {
        document.title = 'Identity & Security | Nexora Capital';
        const key = sessionStorage.getItem('nexora_access_key');
        if (!key) {
            navigate('/');
            return;
        }

        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timeInterval);
    }, [navigate]);

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
                    activePage="profile"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#102217] w-full">
                    {/* Background Accents */}
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#2bee79]/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-[-5%] left-[10%] w-[300px] h-[300px] bg-gradient-to-tr from-[#2bee79]/3 to-transparent rounded-full blur-[80px] pointer-events-none opacity-50"></div>

                    <div className="flex-1 overflow-y-auto z-10 custom-scrollbar shadow-inner">
                        <div className="w-full max-w-[800px] mx-auto flex flex-col gap-8 p-6 md:p-8 lg:p-12 min-h-full">

                            {/* Page Header */}
                            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 shrink-0 relative">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="md:hidden p-2 -ml-2 rounded-xl text-white hover:bg-white/10 transition-colors bg-white/5"
                                            onClick={() => setIsMobileMenuOpen(true)}
                                        >
                                            <Menu size={24} />
                                        </button>
                                        <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Identity & Security</h2>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px] sm:text-sm font-medium">
                                        <ShieldCheck size={16} className="text-[#2bee79]/70" />
                                        <span>Institutional Credentials Active</span>
                                        <span className="mx-1 text-gray-600">•</span>
                                        <span className="shrink-0">UTC {currentTime}</span>
                                    </div>
                                </div>
                            </header>

                            {/* Profile Header Card */}
                            <section className="bg-white/[0.03] backdrop-blur-[12px] border border-white/5 rounded-2xl p-6 md:p-8 glow-soft relative overflow-hidden animate-fade-in">
                                <div className="flex flex-row md:items-center gap-4 md:gap-8">
                                    <div className="relative shrink-0">
                                        {/* Abstract Circular Avatar */}
                                        <div className="w-16 h-16 md:w-32 md:h-32 rounded-full border-2 border-[#2bee79]/30 p-1 flex items-center justify-center relative">
                                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#2bee79]/40 to-emerald-900/40 flex items-center justify-center overflow-hidden">
                                                <Activity size={32} className="md:size-[60px] text-[#2bee79] opacity-50" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-8 md:h-8 bg-[#2bee79] rounded-full flex items-center justify-center border-2 md:border-4 border-[#102217]">
                                                <Check size={10} className="md:size-[14px] text-[#102217] font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left flex-1 space-y-3 min-w-0">
                                        <div className="space-y-1">
                                            <h1 className="text-lg md:text-3xl font-semibold tracking-tight text-white">Access Level: <span className="text-[#2bee79]">Elite Participant</span></h1>
                                            <p className="text-[#9CA3AF] text-[12px] md:text-[13px] font-normal flex items-center gap-2">
                                                <PersonAdd size={14} className="text-gray-500" />
                                                Recruited By: <span className="text-gray-300 font-medium tracking-tight">Michael Scott</span>
                                            </p>
                                        </div>

                                        {/* Status Ribbon (PC: Row, Mobile: Stack/Row) */}
                                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6 pt-1 md:pt-2">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2bee79] shadow-[0_0_8px_#2bee79]"></div>
                                                <span className="text-gray-200 md:text-white text-[12px] md:text-sm font-medium">Active</span>
                                            </div>
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2bee79]/40"></div>
                                                <span className="text-gray-400 md:text-white text-[12px] md:text-sm font-medium">Verified</span>
                                            </div>
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#2bee79]/40"></div>
                                                <span className="text-gray-400 md:text-white text-[12px] md:text-sm font-medium">Institutional Tier</span>
                                            </div>
                                        </div>

                                        {/* Mobile Performance Badge */}
                                        <div className="md:hidden flex items-center gap-2 pt-1">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Portfolio</span>
                                            <span className="text-sm font-bold text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">+30% Weekly</span>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block text-right shrink-0">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Portfolio Standing</div>
                                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                                            <span className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">+30%</span>
                                            <span className="text-[#2bee79]/70 text-sm font-medium uppercase tracking-tighter">Weekly</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Metadata & Security Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                                {/* Membership Metadata */}
                                <div className="space-y-4">
                                    <h2 className="text-sm font-bold flex items-center gap-2 px-1 text-gray-400 uppercase tracking-[0.2em]">
                                        <span className="text-[#2bee79]">Data</span> Metadata
                                    </h2>
                                    <div className="bg-white/[0.03] backdrop-blur-[12px] border border-white/5 p-6 rounded-2xl space-y-4">
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1 font-bold">Program Tier</label>
                                            <p className="text-base font-medium text-gray-200">Elite Capital Program</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1 font-bold">Region</label>
                                            <p className="text-base font-medium text-gray-200">Global Institutional</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1 font-bold">Capital Access Mode</label>
                                            <p className="text-base font-medium text-[#2bee79]">Live Trading</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Protocol */}
                                <div className="space-y-4">
                                    <h2 className="text-sm font-bold flex items-center gap-2 px-1 text-gray-400 uppercase tracking-[0.2em]">
                                        <span className="text-[#2bee79]">Protocol</span> Access
                                    </h2>
                                    <div className="bg-white/[0.03] backdrop-blur-[12px] border border-white/5 p-6 rounded-2xl space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1 font-bold">Access Method</label>
                                                <p className="text-gray-200 font-medium">Invitation Key Auth</p>
                                            </div>
                                            <ShieldCheck size={20} className="text-[#2bee79]/50" />
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2 font-bold">Last Session Activity</label>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#2bee79] animate-pulse"></span>
                                                <span className="text-gray-300 font-mono text-xs">2.144.91.102</span>
                                                <span className="text-gray-500 ml-auto text-[10px] font-bold">2H AGO</span>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all">
                                                Terminate Protocol Access
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Support Section */}
                            <section className="bg-white/[0.03] backdrop-blur-[12px] border border-white/5 rounded-2xl p-6 md:p-8 border-l-4 border-[#2bee79]/50 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                                <div className="space-y-2 text-left">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Access Recovery & Assistance</h3>
                                    <p className="text-gray-400 text-sm max-w-lg leading-relaxed">If institutional credentials are compromised or tier advancement is required, initiate a secure channel with your assigned recruitment handler.</p>
                                </div>
                                <button className="w-full md:w-auto bg-[#2bee79] hover:bg-emerald-400 text-[#102217] font-black text-xs uppercase tracking-widest py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#2bee79]/10 whitespace-nowrap">
                                    <SupportAgent size={18} />
                                    Contact Recruitment Handler
                                </button>
                            </section>

                            {/* Footer */}
                            <footer className="hidden md:flex flex-col md:flex-row items-center justify-between text-[11px] md:text-[10px] text-white/40 md:text-gray-600 uppercase tracking-[0.05em] md:tracking-[0.3em] font-medium md:font-bold pt-8 pb-[60px] md:pb-12 border-t border-white/5 mt-auto w-full gap-6 md:gap-0">
                                <span className="order-1 md:order-none font-normal md:font-bold">© 2026 Nexora Capital Ltd.</span>

                                <div className="flex items-center gap-5 md:gap-6 order-2 md:order-none">
                                    <a className="hover:text-[#2bee79] transition-colors cursor-pointer" href="#">Compliance</a>
                                    <a className="hover:text-[#2bee79] transition-colors cursor-pointer" href="#">Protocol Audit</a>
                                </div>

                                <div className="flex items-center gap-2.5 order-3 md:order-none">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2bee79] animate-pulse shadow-[0_0_8px_#2bee79]"></span>
                                    <span className="font-medium md:font-bold">Encrypted Connection Active</span>
                                </div>
                            </footer>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
