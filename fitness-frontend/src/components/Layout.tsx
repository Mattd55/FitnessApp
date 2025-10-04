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
  Shield,
  Sparkles,
  Target
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
    { path: '/goals', icon: Target, label: 'Goals' },
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
    <div className="min-h-screen bg-background">
      {/* Modern Navigation Header */}
      <nav className="nav-modern sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">RepBase</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-primary">
                Welcome, {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || 'User'}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`badge ${user?.role === 'ADMIN' ? 'badge-error' : user?.role === 'TRAINER' ? 'badge-secondary' : 'badge-primary'}`}>
                  {user?.role}
                </span>
                {user?.role === 'ADMIN' && (
                  <Shield className="h-4 w-4 text-primary" />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-primary p-2"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Modern Sidebar */}
        <div className="w-56 glass-effect min-h-screen border-r border-neutral-200">
          <nav className="p-4">
            {/* Main Navigation */}
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Trainer Navigation */}
            {(user?.role === 'TRAINER' || user?.role === 'ADMIN') && (
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider mb-3 text-secondary">
                  Trainer Tools
                </h3>
                <div className="space-y-2">
                  {trainerItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        style={{
                          background: isActive(item.path)
                            ? 'linear-gradient(135deg, var(--color-secondary-100), var(--color-secondary-50))'
                            : 'transparent'
                        }}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Navigation */}
            {user?.role === 'ADMIN' && (
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider mb-3 text-primary">
                  Administration
                </h3>
                <div className="space-y-2">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                        style={{
                          background: isActive(item.path)
                            ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 107, 107, 0.05))'
                            : 'transparent'
                        }}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <main className="w-full h-full">
            <div className="page-container fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;