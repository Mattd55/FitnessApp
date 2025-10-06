import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background-primary)',
        padding: 'var(--space-lg)'
      }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h1 className="text-h2 text-white mb-4">Check Your Email</h1>
          <p className="text-body mb-6" style={{ color: '#B2BEC3' }}>
            We've sent a password reset link to <strong>{email}</strong>.
            Please check your email and follow the instructions.
          </p>
          <Link to="/login" className="btn btn-primary w-full">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-background-primary)',
      padding: 'var(--space-lg)'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-h2 text-white mb-2">Forgot Password</h1>
        <p className="text-body text-light mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="card card-compact mb-4" style={{
            backgroundColor: 'var(--color-error-50)',
            border: '1.5px solid var(--color-error)'
          }}>
            <p className="text-body" style={{ color: 'var(--color-error)' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-body-sm font-semibold text-white mb-2" style={{ display: 'block' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                border: '1.5px solid #D1D5DB',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)'
              }}
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mb-4"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" className="text-body-sm text-primary">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
