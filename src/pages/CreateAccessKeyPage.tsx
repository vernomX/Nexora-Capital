import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import logoUrl from '../assets/icons/logo.svg';

const CreateAccessKeyPage = () => {
  const navigate = useNavigate();
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'done' | 'error'>('idle');
  const [accessKey, setAccessKey] = useState('');

  // Security Gate: Set to "ON" to allow generation, "OFF" to block it.
  const key_generation_gate = "ON" as "ON" | "OFF";

  useEffect(() => {
    document.title = 'Generate Access Key | Nexora Capital';

    // Add the Google Fonts for Material Icons and Spline Sans
    const materialIcons = document.createElement('link');
    materialIcons.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    materialIcons.rel = 'stylesheet';

    const splineSans = document.createElement('link');
    splineSans.href = 'https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap';
    splineSans.rel = 'stylesheet';

    document.head.appendChild(materialIcons);
    document.head.appendChild(splineSans);

    return () => {
      document.head.removeChild(materialIcons);
      document.head.removeChild(splineSans);
    };
  }, []);

  const handleGenerateKey = () => {
    setGenerationStatus('generating');

    // Simulate High-Tension Delay (4.5 seconds)
    setTimeout(() => {

      // Check the Security Gate
      if (key_generation_gate === "OFF") {
        setGenerationStatus('error');
        return;
      }

      setGenerationStatus('success');

      // Brief pause on success message before showing key
      setTimeout(() => {
        const newKey = `NXR-${Math.floor(1000 + Math.random() * 9000)}-KLAX-${Math.floor(1000 + Math.random() * 9000)}`;
        setAccessKey(newKey);
        setGenerationStatus('done');
        sessionStorage.setItem('valid_generated_key', newKey);
      }, 1000);
    }, 4500);
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!accessKey) return;

    const handleSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // Primary method: Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(accessKey)
        .then(handleSuccess)
        .catch(err => {
          console.warn('Clipboard API failed, trying fallback...', err);
          fallbackCopyText(accessKey);
        });
    } else {
      // Fallback method for older browsers / non-secure contexts (mobile HTTP)
      fallbackCopyText(accessKey);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Ensure element is not visible but part of DOM
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Fallback copy failed.');
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#102217]">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-full bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuC58DkpBiTRpTWTuckET04B7zcKibmsZnPX45KajN-3MLFyYc_kpVMgsTbG3yd8SSHh_Tqc6TQ5pDnJb2EELOABRDjT2fb4okd0oHcDwMIurrrR-vIhX-dNahbVBK218nsjxt6jfv7qDJbg16bNDjOF5XvgwfwrVzm2sChVZnVjdZWKx0Z1ykcOoPWJaQnyV9VKSGbQy-ZNTKNenE0iFDz4VfnjHvbo0c_b4yv_0TSoYZrpz1-BS2pyriCNZUZSUNTJadcDDcWDYXGR')] opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#102217] via-[#102217]/95 to-[#102217]/80"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2bee79]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 w-full max-w-[520px] px-4 py-6 md:py-12 my-auto">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm shadow-lg">
            <img src="./assets/logo.svg" alt="Nexora Capital" className="w-4 h-4 md:w-5 md:h-5 object-contain shadow-[0_0_10px_rgba(43,238,121,0.2)]" />
            <span className="text-white font-semibold tracking-wide text-xs md:text-sm">NEXORA CAPITAL</span>
          </div>
        </div>

        <div className="glass-panel border border-white/10 dark:border-white/5 rounded-lg shadow-2xl p-5 sm:p-8 md:p-10 flex flex-col gap-5 sm:gap-6 md:gap-8 relative overflow-hidden bg-[#0d1612]/80 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2bee79] to-transparent opacity-50"></div>

          {generationStatus === 'error' ? (
            <div className="flex flex-col gap-6 text-center animate-fade-in py-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2 border border-red-500/20">
                <span className="material-symbols-outlined text-red-500 text-3xl">gpp_bad</span>
              </div>

              <h2 className="text-white text-xl sm:text-2xl font-bold">Access Denied</h2>

              <p className="text-[#9db9a8] text-sm leading-relaxed px-4">
                Our security protocol has detected an existing cryptographic signature for this terminal. Each secure session is restricted to a single master key generation.
              </p>

              <div className="pt-4">
                <button
                  className="text-[#587363] hover:text-[#9db9a8] text-xs sm:text-sm font-medium transition-colors py-2 uppercase tracking-wide border-b border-transparent hover:border-[#587363]"
                  onClick={() => navigate('/')}
                >
                  Return to Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 md:gap-3 text-center">
                <h1 className="text-white text-xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                  Generate Access Key
                </h1>
                <p className="text-[#9db9a8] text-xs sm:text-base font-normal leading-relaxed px-0 sm:px-2">
                  Nexora Capital is an invite-only environment. Your access key is your unique identifier for institutional liquidity pools.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex flex-col w-full">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-white text-xs sm:text-sm font-medium pl-1">Your Private Access Key</p>
                    {generationStatus === 'done' && (
                      <span className="text-[10px] sm:text-xs text-[#2bee79] bg-[#2bee79]/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider animate-fade-in">Active</span>
                    )}
                  </div>
                  <div className={`flex w-full items-stretch rounded-xl shadow-lg shadow-black/20 group transition-all duration-300 ${generationStatus === 'done' ? 'focus-within:ring-2 focus-within:ring-[#2bee79]/50' : ''}`}>
                    <div className="flex w-full flex-1 relative overflow-hidden rounded-xl rounded-r-none border border-[#3b5445] bg-[#0d1612]">
                      <input
                        className={`w-full h-12 sm:h-14 bg-transparent text-white focus:outline-0 p-3 sm:p-[15px] pr-2 text-base sm:text-lg font-mono tracking-wider sm:tracking-widest text-center placeholder:text-[#3b5445] transition-all duration-500
                          ${generationStatus === 'generating' ? 'opacity-50 blur-sm' : 'opacity-100'}
                          ${generationStatus === 'success' ? 'text-[#2bee79]' : ''}
                        `}
                        readOnly
                        type="text"
                        value={
                          generationStatus === 'idle' ? '---- ---- ---- ----' :
                            generationStatus === 'generating' ? 'GENERATING KEY...' :
                              generationStatus === 'success' ? 'KEY GENERATED!' :
                                accessKey
                        }
                      />
                      {generationStatus === 'generating' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="material-symbols-outlined animate-spin text-[#2bee79]">sync</span>
                        </div>
                      )}
                    </div>

                    <button
                      aria-label="Copy to clipboard"
                      className={`text-[#9db9a8] hover:text-[#2bee79] hover:bg-[#15231c] transition-colors flex border border-[#3b5445] bg-[#0d1612] items-center justify-center px-3 sm:px-4 rounded-r-xl border-l-0 cursor-pointer group/btn ${generationStatus !== 'done' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                      onClick={copyToClipboard}
                      disabled={generationStatus !== 'done'}
                    >
                      <span className={`material-symbols-outlined transition-transform group-active/btn:scale-90 text-[20px] sm:text-[24px] ${copied ? 'text-[#2bee79]' : ''}`}>
                        {copied ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-3 sm:p-4 flex gap-3 items-start">
                <span className="material-symbols-outlined text-yellow-500 shrink-0" style={{ fontSize: '20px' }}>warning</span>
                <p className="text-[#dcdedc] text-xs sm:text-sm font-normal leading-snug">
                  <strong className="text-yellow-500 block mb-0.5">Security Alert</strong>
                  Save this key immediately. It will not be shown again once you leave this secure session.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 mt-1 sm:mt-2">

                {generationStatus !== 'done' ? (
                  <button
                    className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 sm:h-14 px-8 bg-[#2bee79] hover:bg-[#3af585] transition-all duration-300 shadow-[0_0_20px_rgba(43,238,121,0.15)] hover:shadow-[0_0_35px_rgba(43,238,121,0.3)] ${generationStatus !== 'idle' ? 'opacity-80 cursor-wait' : ''}`}
                    onClick={handleGenerateKey}
                    disabled={generationStatus !== 'idle'}
                  >
                    <span className="relative z-10 text-[#111814] text-base sm:text-lg font-bold leading-normal tracking-wide flex items-center gap-2">
                      {generationStatus === 'idle' ? 'Generate Access Key' : 'Processing...'}
                      {generationStatus === 'idle' && <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">bolt</span>}
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                  </button>
                ) : (
                  <div className="flex flex-col gap-3 animate-fade-in-up">
                    <button
                      className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 sm:h-14 px-8 bg-[#2bee79] hover:bg-[#3af585] transition-all duration-300 shadow-[0_0_20px_rgba(43,238,121,0.15)] hover:shadow-[0_0_35px_rgba(43,238,121,0.3)]"
                      onClick={() => navigate('/')}
                    >
                      <span className="relative z-10 text-[#111814] text-base sm:text-lg font-bold leading-normal tracking-wide flex items-center gap-2">
                        Enter Platform
                        <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </span>
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                    </button>

                    <button
                      className="text-[#587363] hover:text-[#9db9a8] text-xs sm:text-sm font-medium transition-colors py-2"
                      onClick={() => navigate('/')}
                    >
                      Back to Login
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 md:mt-8 flex justify-center opacity-60">
          <div className="flex items-center gap-2 text-xs text-[#587363]">
            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">lock</span>
            <span>End-to-end encrypted session</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAccessKeyPage;
