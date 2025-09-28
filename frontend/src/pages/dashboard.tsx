import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { 
  FolderIcon, 
  ChartBarIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  PlusIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface Tenant {
  id: string;
  name: string;
  plan: string;
  status: string;
  trial_ends_at?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects');
      return response.data;
    },
  });

  const { data: tenant, isLoading: tenantLoading } = useQuery({
    queryKey: ['tenant'],
    queryFn: async () => {
      const response = await api.get('/tenants/me');
      return response.data;
    },
  });

  const stats = [
    {
      name: 'Проекты',
      value: projects.length,
      icon: FolderIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'План',
      value: tenant?.plan || 'trial',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Статус',
      value: tenant?.status || 'active',
      icon: ArrowTrendingUpIcon,
      color: 'bg-purple-500',
    },
  ];

  if (projectsLoading || tenantLoading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Добро пожаловать, {user?.first_name || 'Пользователь'}!
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Управляйте своими продуктами и планируйте развитие
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Новый проект
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 capitalize">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Последние проекты
            </h3>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Нет проектов</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Начните с создания вашего первого проекта.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Создать проект
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((project: Project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Создан {new Date(project.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Быстрые действия
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FolderIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Создать проект</div>
                  <div className="text-xs text-gray-500">Новый продуктовый проект</div>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Аналитика</div>
                  <div className="text-xs text-gray-500">Просмотр метрик</div>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UsersIcon className="h-8 w-8 text-purple-600 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Команда</div>
                  <div className="text-xs text-gray-500">Управление пользователями</div>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Биллинг</div>
                  <div className="text-xs text-gray-500">Управление подпиской</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

