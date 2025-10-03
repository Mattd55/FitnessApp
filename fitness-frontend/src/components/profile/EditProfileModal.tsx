import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { User } from '../../types/api';
import { userApi } from '../../services/api';

interface EditProfileModalProps {
  userProfile: User;
  onClose: () => void;
  onProfileUpdated: (updatedProfile: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  userProfile,
  onClose,
  onProfileUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
    email: userProfile.email || '',
    username: userProfile.username || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create updated user object (only include fields that can be updated)
      const updatedProfile = {
        ...userProfile,
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        email: formData.email.trim(),
        username: formData.username.trim()
      };

      console.log('Submitting profile update:', updatedProfile);

      const result = await userApi.updateProfile(updatedProfile);
      console.log('Profile update result:', result);

      onProfileUpdated(result);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      console.error('Error details:', err.response);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const isFormValid = () => {
    return formData.firstName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.username.trim() !== '' &&
           formData.email.includes('@');
  };

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          backgroundColor: 'var(--color-background-elevated)',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1.5px solid rgba(178, 190, 195, 0.3)',
          position: 'relative'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#000000' }}>
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              position: 'absolute',
              right: '24px'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* First Name */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
                placeholder="Enter your last name"
              />
            </div>

            {/* Username */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
                placeholder="Enter your username"
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid rgba(178, 190, 195, 0.5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--color-background-card)',
                  color: 'var(--color-text-white)',
                }}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1.5px solid #FF6B6B',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: '#FF6B6B',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#FF6B6B',
                color: 'white',
                cursor: (isFormValid() && !loading) ? 'pointer' : 'not-allowed',
                opacity: (isFormValid() && !loading) ? 1 : 0.6
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default EditProfileModal;
