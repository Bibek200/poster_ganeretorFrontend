import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		checkAuthStatus();
	}, []);

	// Function to check authentication status
	const checkAuthStatus = async () => {
		try {
			debugger;
			const response = await authAPI.getProfile();
			setUser(response.data);
			setIsAuthenticated(true);
		} catch (error) {
			setIsAuthenticated(false);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	// Function to log in the user
	const login = async credentials => {
		try {
			const response = await authAPI.login(credentials);
			const { user } = response.data;
			setUser(user);
			setIsAuthenticated(true);
			toast.success('Login successful!');
			return { success: true };
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || 'Invalid email or password';
			toast.error(errorMessage);
			return { success: false, error: errorMessage };
		}
	};

	// Function to register the user
	const register = async userData => {
		try {
			console.log('Registering with userData:', userData);
			const response = await authAPI.register(userData);
			const { user } = response.data;
			setUser(user);
			setIsAuthenticated(true);

			toast.success('Registration successful!');
			return { success: true };
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				(error.message.includes('Network Error')
					? 'Unable to connect to server. Please check your network.'
					: 'Registration failed');
			toast.error(errorMessage);
			return { success: false, error: errorMessage };
		}
	};

	// Function to log out the user
	const logout = async () => {
		try {
			await authAPI.logout();
			console.log('Logout successful');
			toast.success('Logged out successfully!');
			localStorage.removeItem('token');
			setUser(null);
			setIsAuthenticated(false);
			navigate('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			toast.error('Logout failed');
		}
	};

	// Auth context value to be shared with components
	const value = {
		isAuthenticated,
		user,
		loading,
		login,
		register,
		logout,
	};

	// Show loading spinner if the app is still determining auth status
	if (loading) {
		return (
			<div className='d-flex justify-content-center p-5'>
				<div
					className='spinner-border text-primary'
					role='status'>
					<span className='visually-hidden'>Loading...</span>
				</div>
			</div>
		);
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
