import { useState } from 'react';

const CustomerForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      alert(`Adding Customer: ${formData.name}, ${formData.phone}`);
      setFormData({ name: '', phone: '' });
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">Add New Customer</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Customer Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="10-digit mobile number"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;