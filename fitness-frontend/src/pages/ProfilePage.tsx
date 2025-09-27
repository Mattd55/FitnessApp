import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { User } from '../types/api';
import { useAuth } from '../contexts/AuthContext';
import ProfileOverview from '../components/profile/ProfileOverview';
import EditProfileModal from '../components/profile/EditProfileModal';
import AccountSettings from '../components/profile/AccountSettings';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const { user: authUser, updateUser } = useAuth();

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await userApi.getProfile();
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Error loading user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleProfileUpdated = (updatedProfile: User) => {
    console.log('ProfilePage: Received updated profile:', updatedProfile);
    setUserProfile(updatedProfile);
    updateUser(updatedProfile); // Update global auth state
    console.log('ProfilePage: Updated auth context');
    setShowEditModal(false);
  };

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#ef4444';
      case 'TRAINER': return '#f59e0b';
      case 'USER': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return '👑 Admin';
      case 'TRAINER': return '💪 Trainer';
      case 'USER': return '🏃 User';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ color: '#ef4444', fontSize: '18px' }}>
          {error || 'Profile not found'}
        </div>
        <button
          onClick={loadUserProfile}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '32px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Avatar */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          {getInitials(userProfile.firstName, userProfile.lastName, userProfile.username)}
        </div>

        {/* User Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
              {userProfile.firstName && userProfile.lastName
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : userProfile.username}
            </h1>
            <span style={{
              padding: '4px 12px',
              backgroundColor: getRoleColor(userProfile.role),
              color: 'white',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {getRoleBadge(userProfile.role)}
            </span>
          </div>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '16px' }}>
            @{userProfile.username}
          </p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            {userProfile.email}
          </p>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ✏️ Edit Profile
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === 'overview' ? '#4f46e5' : '#6b7280',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'settings' ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === 'settings' ? '#4f46e5' : '#6b7280',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Account Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <ProfileOverview userProfile={userProfile} />
      )}

      {activeTab === 'settings' && (
        <AccountSettings userProfile={userProfile} onProfileUpdated={handleProfileUpdated} />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          userProfile={userProfile}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default ProfilePage;