import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface AlertNotificationProps {
  type: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  metric: string;
  value: number | string;
  threshold: string;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
  type,
  message,
  metric,
  value,
  threshold,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'danger':
        return 'bg-red-500/10 border-red-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <div className={`${getBgColor()} border rounded-lg p-4 mb-4 animate-pulse`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className="font-semibold text-white">{message}</h3>
          <p className="text-sm text-gray-300 mt-1">
            {metric}: {value} (Threshold: {threshold})
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertNotification; 