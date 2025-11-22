import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from './LandingPage';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    // If not authenticated, show landing page
    if (!isAuthenticated) {
        return <LandingPage />;
    }

    // If authenticated, redirect based on role
    if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    // Regular users go to their dashboard
    return <Navigate to="/home" replace />;
};

export default Home;
