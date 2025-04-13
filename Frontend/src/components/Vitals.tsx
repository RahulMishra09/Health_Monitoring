import React, { useState, useEffect } from 'react';
import { Heart, Activity, PieChart, HeadphonesIcon, AlertCircle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VitalRecord {
  time: string;
  heartRate: number;
  bloodPressure: string;
  bloodSugar: number;
  spO2: number;
}

interface VitalStats {
  current: VitalRecord;
  history: VitalRecord[];
}

// Fallback hardcoded data
const fallbackVitalStats: VitalStats = {
  current: {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heartRate: 72,
    bloodPressure: '120/80',
    bloodSugar: 95,
    spO2: 98
  },
  history: [
    { time: '08:00 AM', heartRate: 72, bloodPressure: '120/80', bloodSugar: 95, spO2: 98 },
    { time: '10:00 AM', heartRate: 75, bloodPressure: '122/82', bloodSugar: 98, spO2: 97 },
    { time: '12:00 PM', heartRate: 78, bloodPressure: '121/81', bloodSugar: 102, spO2: 98 },
    { time: '02:00 PM', heartRate: 73, bloodPressure: '119/79', bloodSugar: 94, spO2: 99 },
    { time: '04:00 PM', heartRate: 71, bloodPressure: '118/78', bloodSugar: 92, spO2: 98 },
  ]
};

const Vitals: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [vitalStats, setVitalStats] = useState<VitalStats>(fallbackVitalStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/vitals?period=${selectedPeriod}`);
        if (!response.ok) {
          throw new Error('Failed to fetch vitals data');
        }
        const data = await response.json();
        setVitalStats(data);
        setError(null);
        setUsingFallback(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setVitalStats(fallbackVitalStats);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
    // Set up polling for real-time updates
    const interval = setInterval(fetchVitals, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const chartData = {
    labels: vitalStats.history.map(record => record.time),
    datasets: [
      {
        label: 'Heart Rate',
        data: vitalStats.history.map(record => record.heartRate),
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.4,
      },
      {
        label: 'Blood Sugar',
        data: vitalStats.history.map(record => record.bloodSugar),
        borderColor: 'rgb(234, 179, 8)',
        tension: 0.4,
      },
      {
        label: 'SpO2',
        data: vitalStats.history.map(record => record.spO2),
        borderColor: 'rgb(168, 85, 247)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {usingFallback && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-500 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>Using fallback data as API is not available</span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Vitals Monitor
        </h1>
        <div className="flex space-x-2">
          {(['day', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-lg font-semibold">Heart Rate</h3>
            </div>
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
          <div className="text-3xl font-bold mb-2">{vitalStats.current.heartRate} BPM</div>
          <div className="text-sm text-green-400">Normal Range</div>
          <div className="text-xs text-gray-400 mt-2">60-100 BPM</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Blood Pressure</h3>
            </div>
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
          <div className="text-3xl font-bold mb-2">{vitalStats.current.bloodPressure}</div>
          <div className="text-sm text-green-400">Optimal</div>
          <div className="text-xs text-gray-400 mt-2">Systolic/Diastolic</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold">Blood Sugar</h3>
            </div>
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
          <div className="text-3xl font-bold mb-2">{vitalStats.current.bloodSugar} mg/dL</div>
          <div className="text-sm text-green-400">Normal</div>
          <div className="text-xs text-gray-400 mt-2">70-100 mg/dL</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <HeadphonesIcon className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold">SpO2</h3>
            </div>
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
          <div className="text-3xl font-bold mb-2">{vitalStats.current.spO2}%</div>
          <div className="text-sm text-green-400">Normal Range</div>
          <div className="text-xs text-gray-400 mt-2">95-100%</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Vital History</h2>
        <div className="h-64 mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left pb-3">Time</th>
                <th className="text-left pb-3">Heart Rate</th>
                <th className="text-left pb-3">Blood Pressure</th>
                <th className="text-left pb-3">Blood Sugar</th>
                <th className="text-left pb-3">SpO2</th>
              </tr>
            </thead>
            <tbody>
              {vitalStats.history.map((record, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3">{record.time}</td>
                  <td>{record.heartRate} BPM</td>
                  <td>{record.bloodPressure}</td>
                  <td>{record.bloodSugar} mg/dL</td>
                  <td>{record.spO2}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vitals;