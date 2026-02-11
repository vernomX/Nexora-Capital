import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccessKeyPage from './pages/CreateAccessKeyPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import FundingPage from './pages/FundingPage';
import WithdrawPage from './pages/WithdrawPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/create-access-key" element={<CreateAccessKeyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/funding" element={<FundingPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
