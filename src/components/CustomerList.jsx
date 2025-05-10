import { useState, useEffect } from 'react';
import { customerAPI } from '../services/api.js';
import { toast } from 'react-toastify';

// Debug the import
console.log('Imported customerAPI:', customerAPI);

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (!customerAPI.getCustomers) {
          throw new Error('customerAPI.getCustomers is not a function');
        }
        const response = await customerAPI.getCustomers();
        console.log('Fetched customers:', response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error('Fetch error:', error.message);
        console.error('Error details:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to fetch customers', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleEdit = (id) => {
    alert(`Edit Customer ID ${id}`);
    // Future: Navigate to an edit form, e.g., navigate(`/customers/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerAPI.deleteCustomer(id);
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== id));
      toast.success('Customer deleted successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete customer', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5 fade-in">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Fetching customers...</p>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div className="card-body">
        <h3 className="card-title mb-4">
          <i className="bi bi-people me-2"></i>📋 Customer List
        </h3>
        {customers.length === 0 ? (
          <div className="text-center text-muted">
            <i className="bi bi-exclamation-circle me-2"></i>No customers found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Company Name</th>
                  <th scope="col">WhatsApp</th>
                  <th scope="col">Website</th>
                  <th scope="col">Logo</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td>{index + 1}</td>
                    <td>{customer.companyName}</td>
                    <td>{customer.whatsapp}</td>
                    <td>
                      {customer.website ? (
                        <a
                          href={customer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          Visit
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      {customer.logoUrl ? (
                        <img
                          src={customer.logoUrl}
                          alt={`${customer.companyName} logo`}
                          style={{ width: '50px', height: 'auto' }}
                        />
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(customer._id)}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="btn btn-sm btn-outline-danger me-2"
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
