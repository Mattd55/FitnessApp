import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { User } from '../types/api';
import { useAuth } from '../contexts/AuthContext';
import ProfileOverview from '../components/profile/ProfileOverview';
import EditProfileModal from '../components/profile/EditProfileModal';
import AccountSettings from '../components/profile/AccountSettings';
import { Edit, User as UserIcon, Settings, RotateCcw, Crown, Dumbbell, Target } from 'lucide-react';

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

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'badge-error';
      case 'TRAINER': return 'badge-secondary';
      case 'USER': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return Crown;
      case 'TRAINER': return Dumbbell;
      case 'USER': return Target;
      default: return UserIcon;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: 'var(--color-primary)' }}></div>
          <p style={{ color: 'var(--color-text-light)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="page-container">
        <div className="card p-12 text-center">
          <div className="bg-primary p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
            {error || 'Profile not found'}
          </h3>
          <p className="text-lg mb-6" style={{ color: 'var(--color-text-light)' }}>
            There was an issue loading your profile information.
          </p>
          <button
            onClick={loadUserProfile}
            className="btn btn-primary"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper fade-in">
        {/* Profile Header Card */}
        <div className="card card-elevated hover-lift">
          {/* User Info - Centered */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h1 className="text-h1 text-primary" style={{ lineHeight: '1', marginBottom: 'var(--space-sm)' }}>
              {userProfile.firstName && userProfile.lastName
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : userProfile.username}
            </h1>
            <p className="text-body-lg text-light" style={{ margin: 0 }}>
              @{userProfile.username}
            </p>
            <p className="text-body text-light" style={{ margin: 0, marginTop: 'var(--space-xs)' }}>
              {userProfile.email}
            </p>
          </div>

          {/* Account Information - Horizontal Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
            <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-md)', textAlign: 'center' }}>
              <div className="text-caption text-light mb-2">Member Since</div>
              <div className="text-body font-semibold text-white">
                {formatDate(userProfile.createdAt)}
              </div>
            </div>
            <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-md)', textAlign: 'center' }}>
              <div className="text-caption text-light mb-2">Last Updated</div>
              <div className="text-body font-semibold text-white">
                {formatDate(userProfile.updatedAt)}
              </div>
            </div>
            <div className="card card-compact" style={{ border: '1.5px solid rgba(178, 190, 195, 0.3)', padding: 'var(--space-md)', textAlign: 'center' }}>
              <div className="text-caption text-light mb-2">Account Status</div>
              <div className="text-body font-semibold text-white">
                ✅ Active
              </div>
            </div>
          </div>

          {/* Navigation Tabs and Edit Button - Centered */}
          <div className="flex items-center justify-center gap-md">
            <button
              onClick={() => setActiveTab('overview')}
              className={`btn hover-lift ${
                activeTab === 'overview' ? 'btn-primary' : 'btn-outline'
              } flex items-center gap-xs`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`btn hover-lift ${
                activeTab === 'settings' ? 'btn-primary' : 'btn-outline'
              } flex items-center gap-xs`}
            >
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn btn-primary hover-glow"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            <ProfileOverview userProfile={userProfile} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="fade-in">
            <AccountSettings userProfile={userProfile} onProfileUpdated={handleProfileUpdated} />
          </div>
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
    </div>
  );
};

export default ProfilePage;