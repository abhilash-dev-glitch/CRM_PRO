import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setProfileData(data);

        // Update AuthContext with fresh user data
        updateUser({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, token, updateUser]);

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-2xl shadow-lg p-12 text-center border-2 border-primary/20">
          <div className="animate-pulse">
            <div className="h-20 w-20 bg-primary/20 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl font-semibold">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-2xl shadow-lg p-12 text-center border-2 border-red-200">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-700 text-xl font-bold mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card rounded-2xl shadow-lg p-12 text-center border-2 border-primary/20">
          <p className="text-gray-700 text-xl">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border-2 border-primary/20">
          {/* Header with gradient */}
          <div className="relative h-48 bg-gradient-to-r from-primary via-teal-500 to-accent">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 bg-gradient-to-br from-primary to-teal-600 rounded-2xl flex items-center justify-center text-white text-5xl font-black shadow-2xl ring-4 ring-card">
                {getUserInitials(profileData.name)}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-black text-gray-800 mb-2">{profileData.name}</h1>
                <p className="text-primary font-semibold text-lg capitalize">{profileData.role}</p>
              </div>
              <button className="bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-primary text-white font-bold py-3 px-6 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg">
                Edit Profile
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Email */}
              <div className="bg-background p-6 rounded-xl border-l-4 border-primary">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Email Address</p>
                </div>
                <p className="text-gray-800 font-bold text-lg">{profileData.email}</p>
              </div>

              {/* Account ID */}
              <div className="bg-background p-6 rounded-xl border-l-4 border-accent">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Account ID</p>
                </div>
                <p className="text-gray-800 font-mono text-sm break-all">{profileData._id}</p>
              </div>

              {/* Joined Date */}
              <div className="bg-background p-6 rounded-xl border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Joined Date</p>
                </div>
                <p className="text-gray-800 font-bold text-lg">
                  {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              {/* Last Updated */}
              <div className="bg-background p-6 rounded-xl border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Last Updated</p>
                </div>
                <p className="text-gray-800 font-bold text-lg">
                  {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
