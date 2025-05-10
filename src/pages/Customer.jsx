import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { toast } from 'react-toastify';

const Customer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    logo: null,
    website: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('companyName', formData.companyName);
    data.append('logo', formData.logo);
    data.append('website', formData.website);
    data.append('whatsapp', formData.whatsapp);

    try {
      console.log('CustomerForm.jsx: Submitting formData:', formData);
      const response = await customerAPI.add(data);
      toast.success('Customer added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-primary mb-4">Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="logo" className="form-label">Logo</label>
          <input
            type="file"
            className="form-control"
            id="logo"
            accept="image/*"
            onChange={handleFileChange}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="website" className="form-label">Website</label>
          <input
            type="url"
            className="form-control"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Enter website URL"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="whatsapp" className="form-label">WhatsApp</label>
          <input
            type="text"
            className="form-control"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="Enter WhatsApp number"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
};

export default Customer;