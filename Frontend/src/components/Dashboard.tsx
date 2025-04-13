import React, { useEffect, useState } from 'react';
import { Activity, Heart, Clipboard, HeadphonesIcon, PieChart, Clock, Droplet, Moon, X, Bell, CheckCircle, AlertCircle, Info, User, Settings, Sun } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import AlertNotification from './AlertNotification';
import NotificationCenter from './NotificationCenter';

// Utility to generate fallback/random health metrics
function getRandomHealthMetrics() {
  return {
    heartRate: Math.floor(Math.random() * (90 - 60 + 1)) + 60,
    bloodPressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 70}`,
    bloodSugar: Math.floor(Math.random() * (110 - 80 + 1)) + 80,
    spo2: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
    gyroscope: {
      x: (Math.random() * 2 - 1).toFixed(2),
      y: (Math.random() * 2 - 1).toFixed(2),
      z: (Math.random() * 2 - 1).toFixed(2),
    },
    accelerometer: {
      x: (Math.random() * 10 - 5).toFixed(2),
      y: (Math.random() * 10 - 5).toFixed(2),
      z: (Math.random() * 10 - 5).toFixed(2),
    },
  };
}

// Simulated API fetch function with fallback
async function fetchHealthMetrics() {
  try {
    const response = await fetch('https://your-api-endpoint.com/health-data');
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return {
      heartRate: data.heartRate,
      bloodPressure: data.bloodPressure,
      bloodSugar: data.bloodSugar,
      spo2: data.spo2,
      gyroscope: data.gyroscope || { x: '0.00', y: '0.00', z: '0.00' },
      accelerometer: data.accelerometer || { x: '0.00', y: '0.00', z: '0.00' },
    };
  } catch (error) {
    console.warn('API failed, using fallback data:', error instanceof Error ? error.message : 'Unknown error');
    return getRandomHealthMetrics();
  }
}

// Function to generate random sensor data
function generateRandomSensorData() {
  return {
    gyroscope: {
      x: (Math.random() * 2 - 1).toFixed(2),
      y: (Math.random() * 2 - 1).toFixed(2),
      z: (Math.random() * 2 - 1).toFixed(2),
    },
    accelerometer: {
      x: (Math.random() * 10 - 5).toFixed(2),
      y: (Math.random() * 10 - 5).toFixed(2),
      z: (Math.random() * 10 - 5).toFixed(2),
    },
  };
}

// Function to fetch sensor data from API
async function fetchSensorData() {
  try {
    const response = await fetch('https://your-api-endpoint.com/sensor-data');
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return {
      gyroscope: {
        x: data.gyroscope.x.toFixed(2),
        y: data.gyroscope.y.toFixed(2),
        z: data.gyroscope.z.toFixed(2),
      },
      accelerometer: {
        x: data.accelerometer.x.toFixed(2),
        y: data.accelerometer.y.toFixed(2),
        z: data.accelerometer.z.toFixed(2),
      },
    };
  } catch (error) {
    console.warn('API failed, using fallback data:', error instanceof Error ? error.message : 'Unknown error');
    return generateRandomSensorData();
  }
}

interface SensorDataPoint {
  time: string;
  x: number;
  y: number;
  z: number;
}

interface SensorData {
  gyroscope: SensorDataPoint[];
  accelerometer: SensorDataPoint[];
}

function Dashboard() {
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 0,
    bloodPressure: '0/0',
    bloodSugar: 0,
    spo2: 0,
    gyroscope: { x: '0.00', y: '0.00', z: '0.00' },
    accelerometer: { x: '0.00', y: '0.00', z: '0.00' },
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    gyroscope: [],
    accelerometer: [],
  });

  const [alerts, setAlerts] = useState<Array<{
    type: 'warning' | 'danger' | 'info';
    message: string;
    metric: string;
    value: number | string;
    threshold: string;
  }>>([]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  const weeklyActivityData = [
    { day: 'Mon', hours: 2.5, percentage: 60 },
    { day: 'Tue', hours: 1.8, percentage: 45 },
    { day: 'Wed', hours: 3.0, percentage: 75 },
    { day: 'Thu', hours: 2.0, percentage: 50 },
    { day: 'Fri', hours: 3.2, percentage: 80 },
    { day: 'Sat', hours: 2.6, percentage: 65 },
    { day: 'Sun', hours: 2.8, percentage: 70 },
  ];

  const healthScoreData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 88 },
    { day: 'Wed', score: 82 },
    { day: 'Thu', score: 90 },
    { day: 'Fri', score: 86 },
    { day: 'Sat', score: 89 },
    { day: 'Sun', score: 87 },
  ];

  useEffect(() => {
    const updateMetrics = async () => {
      const data = await fetchHealthMetrics();
      setHealthMetrics(data);
    };
    updateMetrics();
    const interval = setInterval(updateMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSensorData = async () => {
      const data = await fetchSensorData();
      setHealthMetrics(prev => ({
        ...prev,
        gyroscope: data.gyroscope,
        accelerometer: data.accelerometer,
      }));

      // Update time series data
      const now = new Date();
      const time = now.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
      
      setSensorData(prev => ({
        gyroscope: [
          ...prev.gyroscope.slice(-19),
          {
            time,
            x: parseFloat(data.gyroscope.x),
            y: parseFloat(data.gyroscope.y),
            z: parseFloat(data.gyroscope.z),
          },
        ],
        accelerometer: [
          ...prev.accelerometer.slice(-19),
          {
            time,
            x: parseFloat(data.accelerometer.x),
            y: parseFloat(data.accelerometer.y),
            z: parseFloat(data.accelerometer.z),
          },
        ],
      }));
    };

    updateSensorData();
    const interval = setInterval(updateSensorData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkHealthMetrics = () => {
      const newAlerts: Array<{
        type: 'warning' | 'danger' | 'info';
        message: string;
        metric: string;
        value: number | string;
        threshold: string;
      }> = [];

      // Check Heart Rate
      if (healthMetrics.heartRate > 100) {
        newAlerts.push({
          type: 'danger' as const,
          message: 'High Heart Rate Alert!',
          metric: 'Heart Rate',
          value: healthMetrics.heartRate,
          threshold: '100 BPM',
        });
      } else if (healthMetrics.heartRate > 90) {
        newAlerts.push({
          type: 'warning' as const,
          message: 'Elevated Heart Rate',
          metric: 'Heart Rate',
          value: healthMetrics.heartRate,
          threshold: '90 BPM',
        });
      }

      // Check Blood Pressure
      const [systolic, diastolic] = healthMetrics.bloodPressure.split('/').map(Number);
      if (systolic > 140 || diastolic > 90) {
        newAlerts.push({
          type: 'danger' as const,
          message: 'High Blood Pressure Alert!',
          metric: 'Blood Pressure',
          value: healthMetrics.bloodPressure,
          threshold: '140/90 mmHg',
        });
      } else if (systolic > 130 || diastolic > 85) {
        newAlerts.push({
          type: 'warning' as const,
          message: 'Elevated Blood Pressure',
          metric: 'Blood Pressure',
          value: healthMetrics.bloodPressure,
          threshold: '130/85 mmHg',
        });
      }

      // Check Blood Sugar
      if (healthMetrics.bloodSugar > 140) {
        newAlerts.push({
          type: 'danger' as const,
          message: 'High Blood Sugar Alert!',
          metric: 'Blood Sugar',
          value: healthMetrics.bloodSugar,
          threshold: '140 mg/dL',
        });
      } else if (healthMetrics.bloodSugar > 120) {
        newAlerts.push({
          type: 'warning' as const,
          message: 'Elevated Blood Sugar',
          metric: 'Blood Sugar',
          value: healthMetrics.bloodSugar,
          threshold: '120 mg/dL',
        });
      }

      // Check SpO2
      if (healthMetrics.spo2 < 90) {
        newAlerts.push({
          type: 'danger' as const,
          message: 'Low Oxygen Saturation Alert!',
          metric: 'SpO2',
          value: healthMetrics.spo2,
          threshold: '90%',
        });
      } else if (healthMetrics.spo2 < 95) {
        newAlerts.push({
          type: 'warning' as const,
          message: 'Low Oxygen Saturation',
          metric: 'SpO2',
          value: healthMetrics.spo2,
          threshold: '95%',
        });
      }

      setAlerts(newAlerts);
    };

    checkHealthMetrics();
  }, [healthMetrics]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDismissAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Enhanced Header */}
      <div className="bg-gray-800 rounded-lg p-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold">Health Dashboard</h1>
              <p className="text-gray-400 text-sm">{formatDate(currentTime)}</p>
            </div>
            <div className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{formatTime(currentTime)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1 rounded-lg">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Patient #0069</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </button>

            {/* Settings */}
            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>

            {/* Notification Center */}
            <NotificationCenter alerts={alerts} onDismiss={handleDismissAlert} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Today's Steps</span>
              <Activity className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xl font-bold mt-1">6,543</p>
            <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Water Intake</span>
              <Droplet className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xl font-bold mt-1">1.8L</p>
            <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Sleep Duration</span>
              <Moon className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xl font-bold mt-1">7.5h</p>
            <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>

          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Health Score</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xl font-bold mt-1">87/100</p>
            <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
              <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Notifications */}
      {alerts.length > 0 && (
        <div className="mb-8">
          {alerts.map((alert, index) => (
            <div key={index} className="relative group">
              <AlertNotification
                type={alert.type}
                message={alert.message}
                metric={alert.metric}
                value={alert.value}
                threshold={alert.threshold}
              />
              <button
                onClick={() => handleDismissAlert(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Health Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">Heart Rate</h3>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{healthMetrics.heartRate} BPM</p>
          <div className="group relative inline-block">
            <span className="text-green-400 text-sm cursor-help flex items-center hover:text-green-300">
              Normal Range
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 px-4 py-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shadow-xl border border-gray-600 z-50 min-w-[200px]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">Normal Range: 60-100 BPM</span>
              </div>
              <div className="mt-2 text-gray-300 text-xs pl-4">
                Resting heart rate for adults
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-t-8 border-gray-800 border-t-transparent"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">Blood Pressure</h3>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{healthMetrics.bloodPressure}</p>
          <div className="group relative inline-block">
            <span className="text-green-400 text-sm cursor-help flex items-center hover:text-green-300">
              Optimal
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 px-4 py-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shadow-xl border border-gray-600 z-50 min-w-[200px]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">Normal Range: 90-120/60-80 mmHg</span>
              </div>
              <div className="mt-2 text-gray-300 text-xs pl-4">
                Systolic/Diastolic pressure
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-t-8 border-gray-800 border-t-transparent"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">Blood Sugar</h3>
            <PieChart className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{healthMetrics.bloodSugar} mg/dL</p>
          <div className="group relative inline-block">
            <span className="text-green-400 text-sm cursor-help flex items-center hover:text-green-300">
              Normal
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 px-4 py-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shadow-xl border border-gray-600 z-50 min-w-[200px]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">Normal Range: 70-140 mg/dL</span>
              </div>
              <div className="mt-2 text-gray-300 text-xs pl-4">
                Fasting blood glucose level
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-t-8 border-gray-800 border-t-transparent"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">SpO2</h3>
            <HeadphonesIcon className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{healthMetrics.spo2}%</p>
          <div className="group relative inline-block">
            <span className="text-green-400 text-sm cursor-help flex items-center hover:text-green-300">
              Normal Range
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 px-4 py-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shadow-xl border border-gray-600 z-50 min-w-[200px]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">Normal Range: 95-100%</span>
              </div>
              <div className="mt-2 text-gray-300 text-xs pl-4">
                Blood oxygen saturation level
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-t-8 border-gray-800 border-t-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gyroscope and Accelerometer Readings */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Gyroscope Readings */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center">
                <PieChart className="w-5 h-5 text-purple-400 mr-2" />
                Gyroscope Readings
              </h2>
              <p className="text-gray-400 text-sm">Real-time orientation tracking</p>
            </div>
            <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
              Live
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-red-400 font-medium">X-axis</p>
              <p className="text-2xl font-bold">{healthMetrics.gyroscope.x}°/s</p>
              <p className="text-sm text-gray-400">Roll</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-green-400 font-medium">Y-axis</p>
              <p className="text-2xl font-bold">{healthMetrics.gyroscope.y}°/s</p>
              <p className="text-sm text-gray-400">Pitch</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-blue-400 font-medium">Z-axis</p>
              <p className="text-2xl font-bold">{healthMetrics.gyroscope.z}°/s</p>
              <p className="text-sm text-gray-400">Yaw</p>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensorData.gyroscope}>
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis domain={[-1, 1]} stroke="#ccc" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="x" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="y" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="z" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accelerometer Readings */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center">
                <Activity className="w-5 h-5 text-amber-400 mr-2" />
                Accelerometer Readings
              </h2>
              <p className="text-gray-400 text-sm">Real-time motion tracking</p>
            </div>
            <div className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
              Live
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-orange-400 font-medium">X-axis</p>
              <p className="text-2xl font-bold">{healthMetrics.accelerometer.x}m/s²</p>
              <p className="text-sm text-gray-400">Forward/Back</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-lime-400 font-medium">Y-axis</p>
              <p className="text-2xl font-bold">{healthMetrics.accelerometer.y}m/s²</p>
              <p className="text-sm text-gray-400">Left/Right</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-cyan-400 font-medium">Z-axis</p>
              <p className="text-2xl font-bold">{healthMetrics.accelerometer.z}m/s²</p>
              <p className="text-sm text-gray-400">Up/Down</p>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensorData.accelerometer}>
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis domain={[-5, 5]} stroke="#ccc" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="x" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="y" stroke="#a3e635" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="z" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Health Goals</h2>
            <p className="text-gray-400">Track your progress towards better health</p>
          </div>
          <div className="flex space-x-2">
            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
              Weekly Progress
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Steps Goal */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Daily Steps</h3>
                  <p className="text-sm text-gray-400">Target: 10,000 steps</p>
                </div>
              </div>
              <span className="text-green-400 font-medium">6,543 / 10,000</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Exercise Minutes Goal */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Exercise Minutes</h3>
                  <p className="text-sm text-gray-400">Target: 150 minutes/week</p>
                </div>
              </div>
              <span className="text-blue-400 font-medium">120 / 150</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>

          {/* Water Intake Goal */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <Droplet className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Water Intake</h3>
                  <p className="text-sm text-gray-400">Target: 2.5L daily</p>
                </div>
              </div>
              <span className="text-cyan-400 font-medium">1.8L / 2.5L</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          {/* Sleep Goal */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Moon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Sleep Duration</h3>
                  <p className="text-sm text-gray-400">Target: 8 hours/night</p>
                </div>
              </div>
              <span className="text-purple-400 font-medium">7.5 / 8 hours</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
    </>
  );
}

export default Dashboard;
// Helper function to generate time-series data for motion sensors
function generateSensorTimeSeriesData(count = 20) {
  const data = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      x: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      y: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      z: parseFloat((Math.random() * 2 - 1).toFixed(2)),
    });
  }
  
  return data;
}

// Gyroscope Graph Component
function GyroscopeGraph({ data }: { data: Array<{ time: string; x: number; y: number; z: number }> }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex items-center mb-4">
        <PieChart className="text-purple-400 mr-2" size={24} />
        <h3 className="text-xl font-semibold">Gyroscope Readings</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis domain={[-1, 1]} stroke="#ccc" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <CartesianGrid stroke="#444" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="x" stroke="#ef4444" strokeWidth={2} dot={false} name="X-axis (°/s)" />
            <Line type="monotone" dataKey="y" stroke="#22c55e" strokeWidth={2} dot={false} name="Y-axis (°/s)" />
            <Line type="monotone" dataKey="z" stroke="#3b82f6" strokeWidth={2} dot={false} name="Z-axis (°/s)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-red-400 font-medium">X-axis</p>
          <p className="text-xl font-bold">{data[data.length - 1].x} °/s</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-green-400 font-medium">Y-axis</p>
          <p className="text-xl font-bold">{data[data.length - 1].y} °/s</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-blue-400 font-medium">Z-axis</p>
          <p className="text-xl font-bold">{data[data.length - 1].z} °/s</p>
        </div>
      </div>
    </div>
  );
}

// Accelerometer Graph Component
function AccelerometerGraph({ data }: { data: Array<{ time: string; x: number; y: number; z: number }> }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex items-center mb-4">
        <Activity className="text-amber-400 mr-2" size={24} />
        <h3 className="text-xl font-semibold">Accelerometer Readings</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis domain={[-5, 5]} stroke="#ccc" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            <CartesianGrid stroke="#444" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="x" stroke="#f97316" strokeWidth={2} dot={false} name="X-axis (m/s²)" />
            <Line type="monotone" dataKey="y" stroke="#a3e635" strokeWidth={2} dot={false} name="Y-axis (m/s²)" />
            <Line type="monotone" dataKey="z" stroke="#06b6d4" strokeWidth={2} dot={false} name="Z-axis (m/s²)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-orange-400 font-medium">X-axis</p>
          <p className="text-xl font-bold">{data[data.length - 1].x} m/s²</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-lime-400 font-medium">Y-axis</p>
          <p className="text-xl font-bold">{data[data.length - 1].y} m/s²</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg text-center">
          <p className="text-cyan-400 font-medium">Z-axis</p>
          <p className="text-xl font-bold">{data[data.length - 1].z} m/s²</p>
        </div>
      </div>
    </div>
  );
}




