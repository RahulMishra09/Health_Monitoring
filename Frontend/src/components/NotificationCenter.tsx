import React, { useState } from 'react';
import { Bell, X, Clock, CheckCircle, AlertCircle, Info, Heart } from 'lucide-react';
import AlertNotification from './AlertNotification';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  metric: string;
  value: number | string;
  threshold: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  category: 'health' | 'system' | 'reminder';
}

interface NotificationCenterProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

// Hardcoded notifications
const hardcodedNotifications: Alert[] = [
  {
    id: '1',
    type: 'danger',
    message: 'Critical Heart Rate Alert!',
    metric: 'Heart Rate',
    value: 120,
    threshold: '100 BPM',
    timestamp: '2 minutes ago',
    priority: 'high',
    category: 'health'
  },
  {
    id: '2',
    type: 'warning',
    message: 'Scheduled Medication Reminder',
    metric: 'Medication',
    value: 'Morning Dose',
    threshold: '8:00 AM',
    timestamp: '5 minutes ago',
    priority: 'medium',
    category: 'reminder'
  },
  {
    id: '3',
    type: 'info',
    message: 'System Update Available',
    metric: 'System',
    value: 'v2.1.0',
    threshold: 'Update Now',
    timestamp: '10 minutes ago',
    priority: 'low',
    category: 'system'
  },
  {
    id: '4',
    type: 'success',
    message: 'Daily Exercise Goal Achieved!',
    metric: 'Exercise',
    value: '30 minutes',
    threshold: 'Daily Target',
    timestamp: '1 hour ago',
    priority: 'medium',
    category: 'health'
  }
];

const NotificationCenter: React.FC<NotificationCenterProps> = ({ alerts, onDismiss }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'health' | 'system' | 'reminder'>('all');
  const [showDismissed, setShowDismissed] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const allNotifications = [...alerts, ...hardcodedNotifications];
  const filteredNotifications = allNotifications.filter(alert => {
    if (dismissedAlerts.includes(alert.id)) return false;
    if (activeTab === 'all') return true;
    return alert.category === activeTab;
  });

  const handleDismiss = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
    onDismiss(id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="w-4 h-4" />;
      case 'system': return <Info className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
      >
        <Bell className="w-6 h-6 text-gray-300" />
        {filteredNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {filteredNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex space-x-2 mb-4">
              {(['all', 'health', 'system', 'reminder'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No active notifications
              </div>
            ) : (
              filteredNotifications.map((alert) => (
                <div key={alert.id} className="border-b border-gray-700 last:border-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(alert.category)}
                        <span className={`text-sm ${getPriorityColor(alert.priority)}`}>
                          {alert.priority.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{alert.timestamp}</span>
                    </div>
                    
                    <AlertNotification
                      type={alert.type}
                      message={alert.message}
                      metric={alert.metric}
                      value={alert.value}
                      threshold={alert.threshold}
                    />
                    
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowDismissed(!showDismissed)}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showDismissed ? 'Hide Dismissed' : 'Show Dismissed'} ({dismissedAlerts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 