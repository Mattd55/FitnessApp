import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (response.ok) {
        alert('Password reset successfully! You can now login with your new password.');
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
          <h1 className="text-h2 text-white mb-4">Invalid Reset Link</h1>
          <p className="text-body text-light mb-6">
            This password reset link is invalid or has expired.
          </p>
          <button onClick={() => navigate('/forgot-password')} className="btn btn-primary w-full">
            Request New Link
          </button>
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
        <h1 className="text-h2 text-white mb-2">Reset Password</h1>
        <p className="text-body text-light mb-6">
          Enter your new password below.
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
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full"
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                border: '1.5px solid #D1D5DB',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)'
              }}
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4">
            <label className="text-body-sm font-semibold text-white mb-2" style={{ display: 'block' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full"
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                border: '1.5px solid #D1D5DB',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'var(--color-background-card)',
                color: 'var(--color-text-white)'
              }}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
