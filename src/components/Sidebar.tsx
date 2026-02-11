import { useNavigate, Link } from 'react-router-dom';
import {
    BarChart3,
    PieChart,
    Search,
    User,
    LogOut
} from 'lucide-react';

interface SidebarProps {
    activePage: 'market' | 'portfolio' | 'search' | 'profile' | 'settings' | 'none';
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ activePage, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        setIsMobileMenuOpen(false);
        sessionStorage.removeItem('nexora_access_key');
        navigate('/');
    };

    return (
        <aside
            className={`
                fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-64 h-full flex flex-col justify-between bg-[#0d1612] md:bg-[#16261f] border-r border-white/5 p-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.8)]' : '-translate-x-full'}
            `}
        >
            <div className="flex flex-col gap-8">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2">
                    <div className="h-10 w-10 relative flex items-center justify-center">
                        <img src="./assets/logo.svg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-lg font-bold leading-tight">Nexora</h1>
                        <p className="text-gray-400 text-xs font-normal tracking-wide uppercase">Capital</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group cursor-pointer ${activePage === 'market'
                            ? 'bg-[#2bee79]/10 text-[#2bee79]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <BarChart3 size={20} strokeWidth={activePage === 'market' ? 2.5 : 2} />
                        <span className={`text-sm ${activePage === 'market' ? 'font-semibold' : 'font-medium'}`}>Market</span>
                    </Link>
                    <Link
                        to="/portfolio"
                        className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group cursor-pointer ${activePage === 'portfolio'
                            ? 'bg-[#2bee79]/10 text-[#2bee79]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <PieChart size={20} strokeWidth={activePage === 'portfolio' ? 2.5 : 2} />
                        <span className={`text-sm ${activePage === 'portfolio' ? 'font-semibold' : 'font-medium'}`}>Portfolio</span>
                    </Link>
                    <Link
                        to="/search"
                        className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group cursor-pointer ${activePage === 'search'
                            ? 'bg-[#2bee79]/10 text-[#2bee79]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Search size={20} strokeWidth={activePage === 'search' ? 2.5 : 2} />
                        <span className={`text-sm ${activePage === 'search' ? 'font-semibold' : 'font-medium'}`}>Search</span>
                    </Link>
                    <Link
                        to="/profile"
                        className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group cursor-pointer ${activePage === 'profile'
                            ? 'bg-[#2bee79]/10 text-[#2bee79]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <User size={20} strokeWidth={activePage === 'profile' ? 2.5 : 2} />
                        <span className={`text-sm ${activePage === 'profile' ? 'font-semibold' : 'font-medium'}`}>Profile</span>
                    </Link>
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 px-2">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 text-left">
                    <p className="text-xs text-gray-400 mb-2">Nexora Pro</p>
                    <p className="text-sm font-medium text-white mb-3">Institutional access granted.</p>
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate('/settings');
                        }}
                        className={`text-xs font-bold hover:underline text-left transition-colors ${activePage === 'settings' ? 'text-[#2bee79] underline' : 'text-[#2bee79] hover:text-emerald-400'
                            }`}
                    >
                        View Settings
                    </button>
                </div>
                <button
                    className="flex items-center gap-3 text-gray-500 hover:text-white cursor-pointer px-2 py-2 transition-colors w-full text-left"
                    onClick={handleSignOut}
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
