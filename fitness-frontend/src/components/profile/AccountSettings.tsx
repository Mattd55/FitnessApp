import React, { useState } from 'react';
import { User } from '../../types/api';
import { useAuth } from '../../contexts/AuthContext';

interface AccountSettingsProps {
  userProfile: User;
  onProfileUpdated: (updatedProfile: User) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ userProfile, onProfileUpdated }) => {
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const { logout } = useAuth();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError(null);
    if (passwordSuccess) setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    // Validate password strength
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      // TODO: Implement password change API call
      // await userApi.changePassword({
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword
      // });

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
    );

    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'This is your final warning. Deleting your account will permanently remove all your workouts, progress data, and personal information. Are you absolutely sure?'
      );

      if (doubleConfirmed) {
        // TODO: Implement account deletion API call
        alert('Account deletion feature will be implemented soon. Please contact support for now.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Security */}
      <div className="card hover-lift" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
        <h3 className="text-h4 text-white mb-4">
          Account Security
        </h3>

        {passwordSuccess && (
          <div className="card card-compact mb-4" style={{ backgroundColor: '#d1fae5', border: '1.5px solid rgba(16, 185, 129, 0.3)' }}>
            <p className="text-body text-success">✅ Password changed successfully!</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Password Section */}
          <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: showPasswordSection ? 'var(--space-md)' : '0'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div className="text-body font-semibold text-white">
                  Password
                </div>
                <div className="text-body-sm text-light">
                  Last updated: {formatDate(userProfile.updatedAt)}
                </div>
              </div>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className={`btn ${showPasswordSection ? 'btn-ghost' : 'btn-primary'}`}
                style={{ width: '160px' }}
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {passwordError && (
                  <div className="card card-compact" style={{ backgroundColor: '#fee2e2', border: '1.5px solid rgba(239, 68, 68, 0.3)' }}>
                    <p className="text-body text-error">{passwordError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-body-sm font-semibold text-white mb-2" style={{ display: 'block' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full"
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        border: '1.5px solid rgba(178, 190, 195, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        backgroundColor: 'var(--color-background-card)',
                        color: 'var(--color-text-white)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-body-sm font-semibold text-white mb-2" style={{ display: 'block' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="w-full"
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        border: '1.5px solid rgba(178, 190, 195, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        backgroundColor: 'var(--color-background-card)',
                        color: 'var(--color-text-white)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-body-sm font-semibold text-white mb-2" style={{ display: 'block' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full"
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        border: '1.5px solid rgba(178, 190, 195, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        backgroundColor: 'var(--color-background-card)',
                        color: 'var(--color-text-white)'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className={`btn ${passwordLoading ? 'btn-ghost' : 'btn-primary'}`}
                    style={{ cursor: passwordLoading ? 'not-allowed' : 'pointer', minWidth: '160px' }}
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Session Management */}
          <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div className="text-body font-semibold text-white">
                  Session Management
                </div>
                <div className="text-body-sm text-light">
                  Log out of this device and clear stored session data
                </div>
              </div>
              <button
                onClick={logout}
                className="btn btn-primary"
                style={{ width: '160px' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="card hover-lift" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
        <h3 className="text-h4 text-white mb-4">
          Privacy & Data
        </h3>

        <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, marginRight: '16px', textAlign: 'left' }}>
              <div className="text-body font-semibold text-white mb-1">
                Download Your Data
              </div>
              <div className="text-body-sm text-light">
                Export all your workout data, progress measurements, and account information
              </div>
            </div>
            <button
              onClick={() => alert('Data export feature will be implemented soon')}
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap', width: '160px' }}
            >
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card hover-lift" style={{ border: '2px solid rgba(239, 68, 68, 0.5)', backgroundColor: '#2D3436' }}>
        <h3 className="text-h4 mb-4" style={{ color: 'var(--color-error)' }}>
          Danger Zone
        </h3>

        <div className="card card-compact" style={{ border: '1.5px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, marginRight: '16px', textAlign: 'left' }}>
              <div className="text-body font-semibold text-white mb-1">
                Delete Account
              </div>
              <div className="text-body-sm text-light">
                Permanently delete your account and all associated data. This action cannot be undone.
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="btn"
              style={{
                backgroundColor: 'var(--color-error)',
                color: 'white',
                whiteSpace: 'nowrap',
                width: '160px'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;