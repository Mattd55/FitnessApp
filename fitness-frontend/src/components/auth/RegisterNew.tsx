import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterRequest } from '../../types/api';
import { authApi } from '../../services/api';
import { ArrowRight, UserPlus } from 'lucide-react';

const RegisterNew: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors([]);

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      const errorData = err.response?.data;

      if (errorData?.errorCode === 'VALIDATION_ERROR') {
        if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
          setValidationErrors(errorData.details);
        } else {
          setError(errorData.message || 'Validation failed');
        }
      } else {
        setError(errorData?.message || 'Registration failed');
      }
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
        background: 'radial-gradient(circle, var(--color-accent-100) 0%, transparent 70%)',
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
        background: 'radial-gradient(circle, var(--color-primary-100) 0%, transparent 70%)',
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
            Join FitnessApp
          </h1>
          <p className="text-body-lg" style={{ marginBottom: 'var(--space-2xl)', color: '#a0aec0', fontSize: '1.125rem' }}>
            Start your transformation today. Track your progress, build healthy habits, and achieve your fitness goals.
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
              }}>Free Forever</h4>
              <p className="text-body-sm" style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '0.5rem' }}>No credit card required, ever</p>
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
              }}>Secure & Private</h4>
              <p className="text-body-sm" style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '0.5rem' }}>Your data is encrypted and protected</p>
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
              }}>Full Access</h4>
              <p className="text-body-sm" style={{ color: '#a0aec0', fontSize: '0.95rem', marginTop: '0.5rem' }}>Complete workout and progress tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="slide-in-right" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'var(--space-xl)',
        paddingLeft: 'var(--space-2xl)',
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto'
      }}>
        <div className="card card-elevated" style={{
          width: '100%',
          maxWidth: '480px',
          padding: 'var(--space-2xl)',
          margin: 'var(--space-xl) 0'
        }}>
          <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-sm)', color: '#1a202c', fontWeight: 700 }}>
              Create Account
            </h2>
            <p className="text-body" style={{ color: '#4a5568', fontSize: '1rem' }}>
              Join thousands achieving their fitness goals
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
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
            {validationErrors.length > 0 && (
              <div className="fade-in" style={{
                padding: 'var(--space-md)',
                background: 'var(--color-error-50)',
                border: '1px solid var(--color-error)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-error-dark)',
                fontSize: 'var(--font-size-sm)'
              }}>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>Please fix the following:</div>
                <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--space-lg)', margin: 0 }}>
                  {validationErrors.map((error, index) => (
                    <li key={index} style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div>
                <label htmlFor="firstName" className="text-body-sm" style={{
                  display: 'block',
                  marginBottom: 'var(--space-xs)',
                  fontWeight: 600,
                  color: '#2d3748'
                }}>
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="form-input"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '2px solid rgba(45, 52, 54, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="text-body-sm" style={{
                  display: 'block',
                  marginBottom: 'var(--space-xs)',
                  fontWeight: 600,
                  color: '#2d3748'
                }}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 'var(--space-sm) var(--space-md)',
                    border: '2px solid rgba(45, 52, 54, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-base)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

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
                placeholder="johndoe"
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '2px solid rgba(45, 52, 54, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-body-sm" style={{
                display: 'block',
                marginBottom: 'var(--space-xs)',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '2px solid rgba(45, 52, 54, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '2px solid rgba(45, 52, 54, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
                  outline: 'none'
                }}
              />
              <p className="text-body-sm text-light" style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--font-size-xs)' }}>
                8+ characters with uppercase, lowercase, number & special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-body-sm" style={{
                display: 'block',
                marginBottom: 'var(--space-xs)',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '2px solid rgba(45, 52, 54, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-base)',
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus style={{ width: '20px', height: '20px' }} />
                  Create Account
                  <ArrowRight style={{ width: '20px', height: '20px' }} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: 'var(--space-lg)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid rgba(45, 52, 54, 0.1)',
            textAlign: 'center'
          }}>
            <p className="text-body-sm" style={{ color: '#4a5568' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="hover-lift"
                style={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all var(--transition-base)',
                  color: 'var(--color-primary)'
                }}
              >
                Sign In
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

export default RegisterNew;