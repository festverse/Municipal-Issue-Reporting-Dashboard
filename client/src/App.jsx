import Login from './components/Login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans">
        
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Civic Infrastructure Portal
            </h1>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Report Issue
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Engineer Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<TicketForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;