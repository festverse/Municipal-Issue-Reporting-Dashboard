import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;