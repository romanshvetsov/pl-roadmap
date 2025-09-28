import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const { user } = useAuth();

  // Mock data for demonstration
  const mockData = {
    projects: [
      { name: 'Мобильное приложение', value: 35, color: '#3B82F6' },
      { name: 'Веб-платформа', value: 25, color: '#10B981' },
      { name: 'API сервис', value: 20, color: '#F59E0B' },
      { name: 'Админ панель', value: 20, color: '#EF4444' },
    ],
    timeline: [
      { month: 'Янв', features: 5, metrics: 12, revenue: 15000 },
      { month: 'Фев', features: 8, metrics: 18, revenue: 22000 },
      { month: 'Мар', features: 12, metrics: 25, revenue: 28000 },
      { month: 'Апр', features: 15, metrics: 32, revenue: 35000 },
      { month: 'Май', features: 18, metrics: 38, revenue: 42000 },
      { month: 'Июн', features: 22, metrics: 45, revenue: 48000 },
    ],
    metrics: [
      { name: 'MAU', current: 12500, target: 15000, change: 8.5, trend: 'up' },
      { name: 'Retention', current: 68, target: 75, change: -2.1, trend: 'down' },
      { name: 'Conversion', current: 12.5, target: 15, change: 15.2, trend: 'up' },
      { name: 'ARPU', current: 45.2, target: 50, change: 5.8, trend: 'up' },
    ]
  };

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects');
      return response.data;
    },
  });

  return (
    <Layout title="Аналитика">
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Аналитика
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Обзор ключевых метрик и трендов по всем проектам
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockData.metrics.map((metric) => (
            <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {metric.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metric.current.toLocaleString()}
                          {metric.name === 'Retention' || metric.name === 'Conversion' ? '%' : ''}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.trend === 'up' ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="ml-1">{Math.abs(metric.change)}%</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500">
                    Цель: {metric.target.toLocaleString()}
                    {metric.name === 'Retention' || metric.name === 'Conversion' ? '%' : ''}
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(metric.current / metric.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Динамика развития
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="features" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Фичи"
                />
                <Line 
                  type="monotone" 
                  dataKey="metrics" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Метрики"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Рост доходов
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Доход']} />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Распределение по проектам
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.projects}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.projects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Project List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Активные проекты
            </h3>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                    <p className="text-xs text-gray-500">
                      Создан {new Date(project.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">12 фич</div>
                    <div className="text-xs text-gray-500">8 метрик</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Impact Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Анализ влияния фич на метрики
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Фича
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Метрика
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Влияние
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Уверенность
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { feature: 'Push уведомления', metric: 'MAU', impact: '+15%', confidence: 85, status: 'Реализовано' },
                  { feature: 'Социальные функции', metric: 'Retention', impact: '+8%', confidence: 72, status: 'В разработке' },
                  { feature: 'Персонализация', metric: 'Conversion', impact: '+12%', confidence: 90, status: 'Планируется' },
                  { feature: 'Геймификация', metric: 'ARPU', impact: '+20%', confidence: 65, status: 'Исследование' },
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.metric}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {row.impact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.confidence}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.status === 'Реализовано' ? 'bg-green-100 text-green-800' :
                        row.status === 'В разработке' ? 'bg-blue-100 text-blue-800' :
                        row.status === 'Планируется' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

