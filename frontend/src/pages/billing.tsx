import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import { api } from '../lib/api';
import { 
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const plans = [
  {
    id: 'trial',
    name: 'Trial',
    price: 0,
    duration: '14 дней',
    features: [
      '1 проект',
      'Базовые функции',
      'Email поддержка',
      'До 3 пользователей',
    ],
    current: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    duration: 'в месяц',
    features: [
      '3 проекта',
      'Все функции',
      'Приоритетная поддержка',
      'До 10 пользователей',
      'Экспорт данных',
    ],
    current: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    duration: 'в месяц',
    features: [
      '10 проектов',
      'Продвинутая аналитика',
      'API доступ',
      'До 50 пользователей',
      'Интеграции',
      'Персональный менеджер',
    ],
    current: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    duration: 'в месяц',
    features: [
      'Безлимит проектов',
      'Корпоративные интеграции',
      'SAML SSO',
      'Безлимит пользователей',
      'Приоритетная поддержка 24/7',
      'Персональный аккаунт-менеджер',
    ],
    current: false,
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('');

  const { data: tenant } = useQuery({
    queryKey: ['tenant'],
    queryFn: async () => {
      const response = await api.get('/tenants/me');
      return response.data;
    },
  });

  const currentPlan = plans.find(plan => plan.id === tenant?.plan) || plans[0];

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    // В реальном приложении здесь будет интеграция со Stripe
    console.log('Changing plan to:', planId);
  };

  const getPlanStatus = () => {
    if (tenant?.trial_ends_at && new Date(tenant.trial_ends_at) > new Date()) {
      return {
        type: 'trial',
        message: `Триал до ${new Date(tenant.trial_ends_at).toLocaleDateString('ru-RU')}`,
        color: 'text-blue-600',
      };
    }
    if (tenant?.status === 'active') {
      return {
        type: 'active',
        message: 'Активная подписка',
        color: 'text-green-600',
      };
    }
    return {
      type: 'inactive',
      message: 'Подписка неактивна',
      color: 'text-red-600',
    };
  };

  const status = getPlanStatus();

  return (
    <Layout title="Биллинг">
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Биллинг
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Управление подпиской и платежами
            </p>
          </div>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Текущий план
                </h3>
                <div className="mt-2 flex items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {currentPlan.name}
                  </span>
                  <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    status.type === 'trial' ? 'bg-blue-100 text-blue-800' :
                    status.type === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status.message}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {currentPlan.price === 0 ? 'Бесплатно' : `$${currentPlan.price} ${currentPlan.duration}`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Следующий платеж</div>
                <div className="text-lg font-medium text-gray-900">
                  {currentPlan.price === 0 ? 'Не требуется' : `$${currentPlan.price}`}
                </div>
                <div className="text-sm text-gray-500">
                  {status.type === 'trial' ? 'После окончания триала' : '1 января 2024'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCardIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Проекты
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      2 / {currentPlan.id === 'trial' ? '1' : currentPlan.id === 'basic' ? '3' : currentPlan.id === 'pro' ? '10' : '∞'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Пользователи
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      3 / {currentPlan.id === 'trial' ? '3' : currentPlan.id === 'basic' ? '10' : currentPlan.id === 'pro' ? '50' : '∞'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Следующий платеж
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {status.type === 'trial' ? 'После триала' : '1 янв'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Доступные планы
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-6 ${
                    plan.current 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {plan.name}
                    </h4>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 ml-1">{plan.duration}</span>
                    </div>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.current ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        Текущий план
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePlanChange(plan.id)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
                      >
                        {plan.price === 0 ? 'Начать триал' : 'Выбрать план'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              История платежей
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Описание
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { date: '2024-01-01', description: 'Pro Plan - Январь 2024', amount: 99, status: 'Оплачено' },
                    { date: '2023-12-01', description: 'Pro Plan - Декабрь 2023', amount: 99, status: 'Оплачено' },
                    { date: '2023-11-01', description: 'Pro Plan - Ноябрь 2023', amount: 99, status: 'Оплачено' },
                  ].map((payment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-primary-600 hover:text-primary-900">
                          Скачать
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Информация для биллинга
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Способ оплаты</h4>
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">•••• •••• •••• 4242</span>
                  <span className="ml-2 text-xs text-gray-500">Истекает 12/25</span>
                </div>
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-900">
                  Изменить способ оплаты
                </button>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Адрес для счетов</h4>
                <div className="text-sm text-gray-900">
                  <div>ООО "Моя Компания"</div>
                  <div>ул. Примерная, д. 1</div>
                  <div>Москва, 123456</div>
                </div>
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-900">
                  Изменить адрес
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notices */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Важная информация:</p>
              <ul className="mt-1 list-disc list-inside">
                <li>Все цены указаны в долларах США</li>
                <li>Платежи списываются автоматически в начале каждого периода</li>
                <li>Вы можете изменить или отменить подписку в любое время</li>
                <li>При отмене подписки доступ сохраняется до конца текущего периода</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

