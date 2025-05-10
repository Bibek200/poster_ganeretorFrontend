import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; // Import toast

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '', // Changed from 'name' to 'companyName'
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-right',
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Register.jsx: Submitting formData:', formData);
      const result = await register({
        companyName: formData.companyName, // Changed from 'name'
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        toast.success('Registration successful!', {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Register.jsx: Unexpected error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container min-vh-100 d-flex align-items-center justify-content-center">
        <div className="auth-card card fade-in" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-header text-center py-4">
            <h4 className="mb-0 text-primary">
              <i className="bi bi-person-plus me-2"></i>
              Sign Up
            </h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">Company Name</label> {/* Changed label */}
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName" // Changed from 'name'
                    name="companyName" // Changed from 'name'
                    value={formData.companyName} // Changed from 'name'
                    onChange={handleChange}
                    placeholder="Enter your company name" // Updated placeholder
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-key-fill"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Sign Up
                  </>
                )}
              </button>
            </form>
            <div className="text-center">
              <p className="mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-primary text-decoration-none">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;