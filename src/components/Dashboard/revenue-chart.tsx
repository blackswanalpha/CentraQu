'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';

interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  growth: number;
}

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate from USD
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 129.5 },
];

export function RevenueChart() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from your API
      // For now, we'll generate sample data that simulates API response
      const mockData: RevenueData[] = [
        { month: 'Jan', revenue: 45000, target: 50000, growth: 12 },
        { month: 'Feb', revenue: 52000, target: 55000, growth: 15 },
        { month: 'Mar', revenue: 48000, target: 52000, growth: 8 },
        { month: 'Apr', revenue: 61000, target: 58000, growth: 22 },
        { month: 'May', revenue: 58000, target: 60000, growth: 18 },
        { month: 'Jun', revenue: 67000, target: 65000, growth: 25 },
      ];
      
      setRevenueData(mockData);
      setError(null);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = (amount: number): number => {
    return amount * selectedCurrency.rate;
  };

  const formatCurrency = (value: number): string => {
    const convertedValue = convertCurrency(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedValue);
  };

  const convertedData = revenueData.map(item => ({
    ...item,
    revenue: convertCurrency(item.revenue),
    target: convertCurrency(item.target),
  }));

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTarget = revenueData.reduce((sum, item) => sum + item.target, 0);
  const averageGrowth = revenueData.reduce((sum, item) => sum + item.growth, 0) / revenueData.length;
  const performanceVsTarget = ((totalRevenue / totalTarget) * 100).toFixed(1);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-white">
              Revenue Trend
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              6-month progression with target overlay
            </p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center animate-pulse">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchRevenueData}
              className="mt-2 text-sm text-primary hover:text-primary/80"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Revenue Trend
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            6-month progression with target overlay
          </p>
        </div>
        
        {/* Currency Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCurrency.code}
            onChange={(e) => {
              const currency = CURRENCIES.find(c => c.code === e.target.value);
              if (currency) setSelectedCurrency(currency);
            }}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalRevenue)}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            {averageGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg Growth</p>
          </div>
          <p className={`text-lg font-bold ${averageGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {averageGrowth.toFixed(1)}%
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">vs Target</p>
          <p className={`text-lg font-bold ${parseFloat(performanceVsTarget) >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
            {performanceVsTarget}%
          </p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={convertedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickFormatter={(value) => `${selectedCurrency.symbol}${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: any, name: string) => [
                formatCurrency(value),
                name === 'revenue' ? 'Actual Revenue' : 'Target Revenue'
              ]}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#targetGradient)"
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}