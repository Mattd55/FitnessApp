import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/api';
import { ArrowRight, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-background)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-primary-100) 0%, transparent 70%)',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--color-secondary-100) 0%, transparent 70%)',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      {/* Left Side - Branding */}
      <div className="fade-in" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 'var(--space-3xl)',
        paddingRight: 'var(--space-2xl)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '480px', textAlign: 'center' }}>
          <h1 className="text-display" style={{ marginBottom: 'var(--space-md)', color: '#ffffff', fontWeight: 800 }}>
            FitnessApp
          </h1>
          <p className="text-body-lg" style={{ marginBottom: 'var(--space-2xl)', color: '#a0aec0', fontSize: '1.125rem' }}>
            Your personal fitness journey starts here. Track workouts, monitor progress, and achieve your goals.
          </p>

          <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', marginTop: 'var(--space-2xl)' }}>
            <div>
              <h4 className="text-h5" style={{
                color: '#ffffff',
                fontWeight: 600,
                marginBottom: '0.5rem',
                background: 'var(--color-primary)',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                display: 'inline-block'
              }}>Track Your Workouts</h4>
              <p className="text-body-sm" style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '0.5rem' }}>Log exercises, sets, and reps in real-time</p>
            </div>

            <div>
              <h4 className="text-h5" style={{
                color: '#ffffff',
                fontWeight: 600,
                marginBottom: '0.5rem',
                background: 'var(--color-primary)',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                display: 'inline-block'
              }}>Monitor Progress</h4>
              <p className="text-body-sm" style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '0.5rem' }}>Watch your strength and endurance improve</p>
            </div>

            <div>
              <h4 className="text-h5" style={{
                color: '#ffffff',
                fontWeight: 600,
                marginBottom: '0.5rem',
                background: 'var(--color-primary)',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                display: 'inline-block'
              }}>Achieve Goals</h4>
              <p className="text-body-sm" style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '0.5rem' }}>Set targets and crush your fitness milestones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="slide-in-right" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'var(--space-xl)',
        paddingLeft: 'var(--space-2xl)',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="card card-elevated" style={{
          width: '100%',
          maxWidth: '480px',
          padding: 'var(--space-2xl)'
        }}>
          <div style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-sm)', color: '#1a202c', fontWeight: 700 }}>
              Welcome Back
            </h2>
            <p className="text-body" style={{ color: '#4a5568', fontSize: '1rem' }}>
              Sign in to continue your fitness journey
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {error && (
              <div className="fade-in" style={{
                padding: 'var(--space-md)',
                background: 'var(--color-error-50)',
                border: '1px solid var(--color-error)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-error-dark)',
                fontSize: 'var(--font-size-sm)'
              }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="text-body-sm" style={{
                display: 'block',
                marginBottom: 'var(--space-xs)',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="form-input"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  border: '2px solid rgba(45, 52, 54, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
                  transition: 'all var(--transition-base)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-body-sm" style={{
                display: 'block',
                marginBottom: 'var(--space-xs)',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  border: '2px solid rgba(45, 52, 54, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
                  transition: 'all var(--transition-base)',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary hover-glow"
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                marginTop: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 600
              }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn style={{ width: '20px', height: '20px' }} />
                  Sign In
                  <ArrowRight style={{ width: '20px', height: '20px' }} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid rgba(45, 52, 54, 0.1)',
            textAlign: 'center'
          }}>
            <p className="text-body-sm" style={{ color: '#4a5568' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="hover-lift"
                style={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all var(--transition-base)',
                  color: 'var(--color-primary)'
                }}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Responsive adjustments for mobile */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="flex: 1"]:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;