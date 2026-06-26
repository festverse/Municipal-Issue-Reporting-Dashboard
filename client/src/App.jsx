import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import AuthProvider from './context/AuthContext';
import ToastProvider from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import TicketForm from './components/TicketForm';
import Dashboard from './components/Dashboard';
import TicketDetail from './components/TicketDetail';
import AnalyticsPanel from './components/AnalyticsPanel';
import CityMap from './components/CityMap';
import LegalPage from './components/LegalPage';
import CommunityFeed from './components/CommunityFeed';
import CivicRewards from './components/CivicRewards';
import MapSolutions from './components/MapSolutions';
import AIChatAgent from './components/AIChatAgent';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
      <span className="text-6xl mb-4">🚧</span>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-500">Page not found.</p>
      <a href="/" className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
        ← Back to Home
      </a>
    </div>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Navbar />
            {/* Spacer for fixed navbar */}
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<TicketForm />} />
                <Route path="/map" element={<CityMap />} />
                <Route path="/map-solutions" element={<MapSolutions />} />
                <Route path="/feed" element={<CommunityFeed />} />
                <Route path="/rewards" element={<CivicRewards />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/legal/:policyId" element={<LegalPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute restrictTo={['ENGINEER', 'ADMIN']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/tickets/:id" element={<TicketDetail />} />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPanel />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <AIChatAgent />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;