import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        toast.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Toast already handled in AuthContext
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-primary mb-4">User Profile</h2>
      {profile ? (
        <div className="card p-4">
          <h5>Name: {profile.name}</h5>
          <p>Email: {profile.email}</p>
          <button className="btn btn-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left me-2"></i>Logout
          </button>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default Profile;