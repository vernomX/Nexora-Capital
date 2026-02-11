import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import logoUrl from '../assets/icons/logo.svg';

const LoginForm = () => {
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessKey.trim()) return;

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const validKey = sessionStorage.getItem('valid_generated_key'); // We will set this in CreateAccessKeyPage

      // For demo purposes, we can also accept a hardcoded master key or if it matches the pattern NXR-...-KLAX-...
      const isValidPattern = /^NXR-\d{4}-KLAX-\d{4}$/.test(accessKey);

      if (accessKey === validKey || (isValidPattern && !validKey)) {
        sessionStorage.setItem('nexora_access_key', accessKey); // Log them in
        navigate('/dashboard');
      } else {
        setError('Invalid access key. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-[440px] px-4 sm:px-6 flex flex-col items-center transition-all duration-300">
      <div className="mb-6 md:mb-8 flex flex-col items-center animate-fade-in-down">
        <img
          src="./assets/logo.svg"
          alt="Nexora"
          className="block w-14 h-14 mb-4"
          draggable={false}
        />
      </div>

      <div className="relative w-full bg-[#0b1a12]/75 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)] flex flex-col gap-6 md:gap-8 transition-all duration-500 hover:border-white/15 group">
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/5 via-transparent to-black/20"></div>

        <div className="relative text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white/90">
            Access Nexora Capital
          </h1>
          <p className="text-white/40 text-sm font-normal leading-relaxed">
            Enter your access key to continue
          </p>
          {error && (
            <div className="absolute top-full left-0 w-full mt-2 animate-fade-in">
              <p className="text-[#ff5c5c] text-xs font-medium bg-[#ff5c5c]/10 py-2 rounded-lg border border-[#ff5c5c]/20">
                {error}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4 md:gap-5 w-full">
          <label className="relative block group/input">
            <span className="sr-only">Access Key</span>
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/35 group-focus-within/input:text-primary transition-colors">
              <span className="material-symbols-outlined text-xl">vpn_key</span>
            </div>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="block w-full h-14 pl-12 pr-5 rounded-full bg-black/30 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 font-mono tracking-widest text-base md:text-sm appearance-none"
              placeholder="XXXX-XXXX-XXXX"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full h-14 overflow-hidden rounded-full bg-[#2bee79] text-[#07160f] font-semibold text-base tracking-wide transition-all duration-300 shadow-[0_0_30px_-10px_rgba(43,238,121,0.55)] hover:shadow-[0_0_44px_-12px_rgba(43,238,121,0.70)] active:scale-[0.98] flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Continue</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-hover/btn:translate-x-1 text-lg">
                  arrow_forward
                </span>
              </>
            )}
          </button>

          <div className="text-center pt-2 md:pt-0">
            <a
              href="#"
              className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-primary transition-colors duration-200 py-2"
              onClick={(e) => {
                e.preventDefault();
                navigate('/create-access-key');
              }}
            >
              <span>Create an access key</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </form>
      </div>

      <footer className="mt-8 md:mt-12 text-center opacity-60 hover:opacity-100 transition-opacity">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
          © {new Date().getFullYear()} Nexora Capital
        </p>
        <p className="text-[10px] text-white/25 mt-1">
          Institutional Access Only
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
