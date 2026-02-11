import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  useEffect(() => {
    document.title = 'Login | Nexora Capital';

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

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vh] h-[100vh] bg-primary/5 rounded-full blur-[150px] opacity-40"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%232bee79\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full flex justify-center py-12 my-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
