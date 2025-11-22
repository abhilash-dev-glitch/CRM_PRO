import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token } = useAuth();
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
        const response = await fetch(`/api/users/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-lg shadow-lg text-center">
        <p className="text-gray-700 text-xl">Loading user information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-lg shadow-lg text-center">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-lg shadow-lg text-center">
        <p className="text-gray-700 text-xl">No user information available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Name</h2>
          <p className="text-gray-700">{profileData.name}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Email</h2>
          <p className="text-gray-700">{profileData.email}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Role</h2>
          <p className="text-gray-700 capitalize">{profileData.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
