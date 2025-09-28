import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const features = [
    {
      name: 'Управление роадмапом',
      description: 'Создавайте и планируйте фичи с учетом приоритетов и зависимостей',
      icon: ChartBarIcon,
    },
    {
      name: 'Продуктовые метрики',
      description: 'Связывайте фичи с ключевыми показателями продукта',
      icon: ArrowTrendingUpIcon,
    },
    {
      name: 'Финансовое моделирование',
      description: 'Рассчитывайте P&L на основе продуктовых метрик',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Командная работа',
      description: 'Приглашайте коллег и работайте вместе над проектами',
      icon: UsersIcon,
    },
  ];

  const plans = [
    {
      name: 'Trial',
      price: 'Бесплатно',
      duration: '14 дней',
      features: [
        '1 проект',
        'Базовые функции',
        'Email поддержка',
        'До 3 пользователей',
      ],
      cta: 'Начать триал',
      popular: false,
    },
    {
      name: 'Basic',
      price: '$29',
      duration: 'в месяц',
      features: [
        '3 проекта',
        'Все функции',
        'Приоритетная поддержка',
        'До 10 пользователей',
        'Экспорт данных',
      ],
      cta: 'Выбрать план',
      popular: true,
    },
    {
      name: 'Pro',
      price: '$99',
      duration: 'в месяц',
      features: [
        '10 проектов',
        'Продвинутая аналитика',
        'API доступ',
        'До 50 пользователей',
        'Интеграции',
        'Персональный менеджер',
      ],
      cta: 'Выбрать план',
      popular: false,
    },
  ];

  return (
    <>
      <Head>
        <title>PL-Roadmap - SaaS для продуктового планирования</title>
        <meta name="description" content="Современный инструмент для связывания продуктовых метрик с финансовыми показателями P&L" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-primary-600">PL-Roadmap</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Регистрация
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                Планируйте продукт с
                <span className="block text-primary-200">финансовой точностью</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-primary-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Связывайте продуктовые метрики с P&L, моделируйте сценарии и находите оптимальные решения для развития продукта
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Начать бесплатно
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-400 md:py-4 md:text-lg md:px-10"
                  >
                    Узнать больше
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Все необходимое для продуктового планирования
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                От создания роадмапа до расчета финансового эффекта - все в одном инструменте
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Простые и прозрачные тарифы
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Выберите план, который подходит вашему бизнесу
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-lg shadow-md p-6 ${
                    plan.popular ? 'ring-2 ring-primary-500 relative' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Популярный
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-1">{plan.duration}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/register"
                      className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                        plan.popular
                          ? 'text-white bg-primary-600 hover:bg-primary-700'
                          : 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Готовы начать планировать продукт?
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-primary-100 mx-auto">
                Присоединяйтесь к сотням продуктовых команд, которые уже используют PL-Roadmap
              </p>
              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  <StarIcon className="h-5 w-5 mr-2" />
                  Начать бесплатный триал
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-4">PL-Roadmap</h3>
              <p className="text-gray-400 text-sm">
                © 2024 PL-Roadmap. Все права защищены.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

