import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Heart, Clipboard, Calendar, Settings, HeadphonesIcon, Home, PieChart, HelpCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Vitals from './components/Vitals';
import Appointments from './components/Appointments';
import Records from './components/Records';
import SettingsPage from './components/Settings';
import Support from './components/Support';

function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 p-4">
      <div className="flex items-center space-x-4 mb-8">
        <img
          src="Dp.png"
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="font-semibold">Rahul Mishra</h2>
          <p className="text-sm text-gray-400">Patient ID: #0069</p>
        </div>
      </div>

      <nav className="space-y-4">
        <Link
          to="/"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive('/') ? 'text-teal-400 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/vitals"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive('/vitals') ? 'text-teal-400 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Vitals</span>
        </Link>
        <Link
          to="/appointments"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive('/appointments') ? 'text-teal-400 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Appointments</span>
        </Link>
        <Link
          to="/records"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive('/records') ? 'text-teal-400 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Clipboard className="w-5 h-5" />
          <span>Records</span>
        </Link>
        <Link
          to="/settings"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive('/settings') ? 'text-teal-400 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <Link
          to="/support"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive('/support') ? 'text-teal-400 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </Link>
      </nav>

      <div className="absolute bottom-4 left-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-teal-400" />
          <span className="text-xl font-bold text-teal-400">HealthTrack</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/records" element={<Records />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;