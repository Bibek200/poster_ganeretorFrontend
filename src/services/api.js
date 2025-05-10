import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

// Request interceptor to add token (skip for public routes)
api.interceptors.request.use(config => {
	debugger;
	const isPublicEndpoint =
		config.url.includes('/auth/register') ||
		config.url.includes('/auth/login') ||
		config.url.includes('/customers');
	return config;
});

// Auth APIs
export const authAPI = {
	register: async userData => {
		try {
			const response = await api.post('/auth/register', userData);
			return response;
		} catch (error) {
			throw error;
		}
	},

	login: async credentials => {
		try {
			const response = await api.post('/auth/login', credentials);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getProfile: async () => {
		try {
			const response = await api.get('/auth/profile');
			return response;
		} catch (error) {
			throw error;
		}
	},

	logout: async () => {
		try {
			const response = await api.get('/auth/logout');
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// Poster APIs
export const posterAPI = {
	upload: async formData => {
		try {
			const response = await api.post('/posters/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response;
		} catch (error) {
			throw error;
		}
	},

	getByCategory: async (category, customerId) => {
		try {
			const response = await api.get(`/posters/${category}/${customerId}`);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// Customer APIs
export const customerAPI = {
	add: async formData => {
		try {
			const response = await api.post('/customers/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response;
		} catch (error) {
			throw error;
		}
	},

	getCustomers: async () => {
		try {
			const response = await api.get('/customers');
			return response;
		} catch (error) {
			throw error;
		}
	},

	updateCustomer: async (id, formData) => {
		try {
			const response = await api.put(`/customers/edit/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response;
		} catch (error) {
			throw error;
		}
	},

	deleteCustomer: async id => {
		try {
			const response = await api.delete(`/customers/${id}`);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// Schedule APIs
export const scheduleAPI = {
	create: async scheduleData => {
		try {
			const response = await api.post('/schedule/create', scheduleData);
			return response;
		} catch (error) {
			throw error;
		}
	},

	getByCustomer: async customerId => {
		try {
			const response = await api.get(`/schedule/customer/${customerId}`);
			return response;
		} catch (error) {
			throw error;
		}
	},
};

// Dashboard API
export const dashboardAPI = {
	getMetrics: async () => {
		try {
			const response = await api.get('/dashboard');
			return response;
		} catch (error) {
			throw error;
		}
	},
};

export default api;
