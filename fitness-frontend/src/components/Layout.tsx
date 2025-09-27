import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Dumbbell,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Users,
  Shield
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/exercises', icon: Dumbbell, label: 'Exercises' },
    { path: '/workouts', icon: Activity, label: 'Workouts' },
    { path: '/progress', icon: BarChart3, label: 'Progress' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const adminItems = [
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
    { path: '/admin/system', icon: Settings, label: 'System' },
  ];

  const trainerItems = [
    { path: '/trainer/clients', icon: Users, label: 'My Clients' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Dumbbell className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FitnessApp</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || 'User'}
              </span>
              <div className="flex items-center space-x-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user?.role}
                </span>
                {user?.role === 'ADMIN' && (
                  <Shield className="h-4 w-4 text-red-500" />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      isActive(item.path)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <Icon
                      className={`${
                        isActive(item.path) ? 'text-indigo-500' : 'text-gray-400'
                      } mr-3 h-5 w-5`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Trainer Navigation */}
            {(user?.role === 'TRAINER' || user?.role === 'ADMIN') && (
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trainer
                </h3>
                <div className="mt-1 space-y-1">
                  {trainerItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`${
                          isActive(item.path)
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                      >
                        <Icon
                          className={`${
                            isActive(item.path) ? 'text-indigo-500' : 'text-gray-400'
                          } mr-3 h-5 w-5`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Navigation */}
            {user?.role === 'ADMIN' && (
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
                <div className="mt-1 space-y-1">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`${
                          isActive(item.path)
                            ? 'bg-red-100 text-red-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                      >
                        <Icon
                          className={`${
                            isActive(item.path) ? 'text-red-500' : 'text-gray-400'
                          } mr-3 h-5 w-5`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;