import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    ShieldCheck,
    Bell,
    Menu
} from 'lucide-react';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Toggle states
    const [toggles, setToggles] = useState({
        marketAlerts: true,
        portfolioUpdates: true,
        capitalAllocation: true,
        systemStatus: false,
        strategyAnnouncements: true
    });

    useEffect(() => {
        document.title = 'Platform Preferences | Nexora Capital';
        const key = sessionStorage.getItem('nexora_access_key');
        if (!key) {
            navigate('/');
        }
    }, [navigate]);

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
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

            <div className="flex h-full w-full flex-row">
                <Sidebar
                    activePage="settings"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#102217] w-full">
                    <div className="flex-1 overflow-y-auto z-10 custom-scrollbar">
                        <div className="w-[94%] md:w-full max-w-[1200px] mx-auto p-4 md:p-12 flex flex-col gap-8 md:gap-10">

                            {/* Header */}
                            <header className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left pt-6 md:pt-0">
                                <button
                                    className="md:hidden absolute top-6 left-6 p-2 rounded-xl text-white hover:bg-white/10 transition-colors bg-white/5"
                                    onClick={() => setIsMobileMenuOpen(true)}
                                >
                                    <Menu size={20} />
                                </button>
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">Platform Preferences</h1>
                                    <p className="text-gray-400 text-xs md:text-sm">Manage how Nexora Capital communicates with you.</p>
                                </div>
                            </header>

                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                {/* Left Column - Notification Management (70%) */}
                                <div className="flex-1 lg:basis-[70%] flex flex-col gap-4 w-full">
                                    <h2 className="text-[#2bee79] text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 pl-1">
                                        <Bell size={14} />
                                        Notification Management
                                    </h2>

                                    {/* Consolidated List Container */}
                                    <div className="bg-[#0d1612] border border-white/5 rounded-2xl overflow-hidden">
                                        <ToggleRow
                                            label="Market price alerts"
                                            description="Real-time triggers for significant movement in your tracked assets."
                                            isActive={toggles.marketAlerts}
                                            onClick={() => handleToggle('marketAlerts')}
                                        />
                                        <ToggleRow
                                            label="Portfolio updates"
                                            description="Weekly and monthly summaries of your net performance."
                                            isActive={toggles.portfolioUpdates}
                                            onClick={() => handleToggle('portfolioUpdates')}
                                        />
                                        <ToggleRow
                                            label="Capital allocation"
                                            description="Confirmations and execution reports for private placements."
                                            isActive={toggles.capitalAllocation}
                                            onClick={() => handleToggle('capitalAllocation')}
                                        />
                                        <ToggleRow
                                            label="System status"
                                            description="Operational updates and security maintenance logs."
                                            isActive={toggles.systemStatus}
                                            onClick={() => handleToggle('systemStatus')}
                                        />
                                        <ToggleRow
                                            label="Strategy announcements"
                                            description="Invitations to new investment vehicles and white papers."
                                            isActive={toggles.strategyAnnouncements}
                                            onClick={() => handleToggle('strategyAnnouncements')}
                                            isLast={true}
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Institutional Grade Security (30%) */}
                                <div className="flex-1 lg:basis-[30%] flex flex-col gap-4 w-full">
                                    <h2 className="text-[#2bee79] text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 pl-1">
                                        <ShieldCheck size={14} />
                                        Security Protocol
                                    </h2>

                                    <div className="bg-[#0d1612] bg-opacity-50 border-l-2 border-[#10B981] border-y border-r border-white/5 rounded-r-2xl rounded-l-sm p-6 flex flex-col gap-4 relative overflow-hidden group">
                                        {/* Ghost Shield Watermark */}
                                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.05] pointer-events-none">
                                            <ShieldCheck size={120} className="text-[#2bee79]" />
                                        </div>

                                        <div className="flex items-center gap-3 relative z-10">
                                            <ShieldCheck className="text-[#2bee79]" size={20} />
                                            <h3 className="text-base md:text-lg font-medium text-white">Institutional Grade Security</h3>
                                        </div>

                                        <p className="text-gray-500 text-xs md:text-sm leading-relaxed relative z-10 font-normal">
                                            Nexora Capital platform preferences are strictly local to your secure session. For modifications to your registered personal entity data, please contact your account manager directly.
                                        </p>

                                        <div className="mt-2 pt-4 border-t border-white/5 flex items-center gap-2 relative z-10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#2bee79] shadow-[0_0_8px_#2bee79]"></div>
                                            <span className="text-[10px] md:text-xs font-mono text-[#2bee79] tracking-wider">ENCRYPTED SESSION ACTIVE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper Component for Toggle Row
const ToggleRow = ({ label, description, isActive, onClick, isLast = false }: { label: string, description: string, isActive: boolean, onClick: () => void, isLast?: boolean }) => {
    return (
        <div
            onClick={onClick}
            className={`group flex items-center justify-between p-4 md:p-5 hover:bg-white/[0.02] transition-colors cursor-pointer select-none ${!isLast ? 'border-b border-white/[0.05]' : ''}`}
        >
            <div className="flex flex-col gap-1 pr-4">
                <h3 className="text-white font-medium text-sm md:text-base group-hover:text-[#2bee79] transition-colors">{label}</h3>
                <p className="text-gray-500 text-xs md:text-sm font-normal">{description}</p>
            </div>

            <div className={`w-10 h-6 md:w-11 md:h-6 rounded-full relative transition-colors duration-300 shrink-0 ${isActive ? 'bg-[#2bee79]' : 'bg-white/10 group-hover:bg-white/20'}`}>
                <div className={`absolute top-1 w-4 h-4 md:w-4 md:h-4 rounded-full bg-[#102217] shadow-sm transition-all duration-300 ${isActive ? 'left-5 md:left-6' : 'left-1'}`}></div>
            </div>
        </div>
    );
};

export default SettingsPage;
