import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleAPI, customerAPI, posterAPI } from '../services/api';
import { toast } from 'react-toastify';

const Schedule = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerId: '',
        schedules: [{ category: '', posterId: '', date: '', posters: [], livePreviewUrl: '' }],
    });

    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const categories = ['Offers', 'Events', 'Festivals'];
    const baseUrl = 'http://localhost:5000/';

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await customerAPI.getCustomers();
                setCustomers(res.data);
            } catch (error) {
                toast.error('Failed to fetch customers', { autoClose: 3000 });
            }
        };
        fetchCustomers();
    }, []);

    const handleCustomerChange = e => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            customerId: value,
            schedules: prev.schedules.map(s => ({
                ...s,
                posterId: '',
                posters: [],
                livePreviewUrl: '',
            })),
        }));
    };

    const handleScheduleChange = async (index, field, value) => {
        const newSchedules = [...formData.schedules];
        newSchedules[index][field] = value;

        // If category changes, fetch posters
        if (field === 'category') {
            newSchedules[index].posterId = '';
            newSchedules[index].posters = [];
            newSchedules[index].livePreviewUrl = '';
            if (formData.customerId && value) {
                await fetchPosters(index, formData.customerId, value);
            }
        }

        // When posterId changes, show the selected poster as preview
        if (field === 'posterId') {
            const selectedPoster = newSchedules[index].posters.find(p => p._id === value);
            if (selectedPoster) {
                let imageUrl = selectedPoster.imageUrl.replace(/\\/g, '/');
                if (!/^https?:\/\//.test(imageUrl)) {
                    imageUrl = baseUrl + imageUrl;
                }
                newSchedules[index].livePreviewUrl = imageUrl;
            } else {
                newSchedules[index].livePreviewUrl = '';
            }
        }

        setFormData(prev => ({
            ...prev,
            schedules: newSchedules,
        }));
    };

    const fetchPosters = async (index, customerId, category) => {
        try {
            const res = await posterAPI.getByCategory(category.toLowerCase(), customerId);
            const fetched = Array.isArray(res.data.posters) ? res.data.posters : [];
            setFormData(prev => {
                const newSchedules = [...prev.schedules];
                newSchedules[index].posters = fetched;
                return { ...prev, schedules: newSchedules };
            });
        } catch (err) {
            toast.error('Failed to fetch posters', { autoClose: 3000 });
        }
    };

    const addScheduleRow = () => {
        setFormData(prev => ({
            ...prev,
            schedules: [...prev.schedules, { category: '', posterId: '', date: '', posters: [], livePreviewUrl: '' }],
        }));
    };

    const removeScheduleRow = index => {
        if (formData.schedules.length === 1) return;
        const newSchedules = formData.schedules.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, schedules: newSchedules }));
    };

    const validateForm = () => {
        const today = new Date().toISOString().split('T')[0];
        for (let i = 0; i < formData.schedules.length; i++) {
            const sched = formData.schedules[i];
            if (!sched.category || !sched.posterId || !sched.date) {
                toast.error(`Please complete all fields in schedule ${i + 1}`, { autoClose: 3000 });
                return false;
            }
            if (sched.date < today) {
                toast.error(`Schedule date must be in the future (Row ${i + 1})`, { autoClose: 3000 });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const data = {
            customerId: formData.customerId,
            schedules: formData.schedules.map(s => ({
                posterId: s.posterId,
                categories: [s.category],
                dates: [s.date],
            })),
        };

        try {
            await scheduleAPI.create(data);
            toast.success('Schedule created successfully!', { autoClose: 2000 });
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create schedule', {
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container my-5 fade-in'>
            <h2 className='text-primary mb-4'>
                <i className='bi bi-calendar-plus me-2'></i>Create Schedule
            </h2>
            <div className='card shadow'>
                <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        {/* Customer */}
                        <div className='mb-3'>
                            <label className='form-label'>Customer</label>
                            <select
                                className='form-control'
                                name='customerId'
                                value={formData.customerId}
                                onChange={handleCustomerChange}
                                required>
                                <option value=''>Select Customer</option>
                                {customers.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.companyName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Schedule Rows */}
                        {formData.schedules.map((sched, index) => (
                            <div key={index} className='border rounded p-3 mb-3'>
                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                    <strong>Schedule {index + 1}</strong>
                                    {formData.schedules.length > 1 && (
                                        <button
                                            type='button'
                                            className='btn btn-sm btn-danger'
                                            onClick={() => removeScheduleRow(index)}>
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {/* Category */}
                                <div className='mb-3'>
                                    <label className='form-label'>Category</label>
                                    <select
                                        className='form-control'
                                        value={sched.category}
                                        onChange={e =>
                                            handleScheduleChange(index, 'category', e.target.value)
                                        }
                                        required>
                                        <option value=''>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Poster */}
                                {sched.category && (
                                    <div className='mb-3'>
                                        <label className='form-label'>Poster</label>
                                        {sched.posters.length > 0 ? (
                                            <div className='row'>
                                                {sched.posters.map(poster => {
                                                    let imageUrl = poster.imageUrl.replace(/\\/g, '/');
                                                    if (!/^https?:\/\//.test(imageUrl)) {
                                                        imageUrl = baseUrl + imageUrl;
                                                    }
                                                    return (
                                                        <div key={poster._id} className='col-md-4 mb-3'>
                                                            <div
                                                                className={`card h-100 ${
                                                                    sched.posterId === poster._id
                                                                        ? 'border-primary bg-light'
                                                                        : 'border-secondary'
                                                                }`}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() =>
                                                                    handleScheduleChange(
                                                                        index,
                                                                        'posterId',
                                                                        poster._id
                                                                    )
                                                                }>
                                                                <img
                                                                    src={imageUrl}
                                                                    className='card-img-top'
                                                                    alt={`Poster ${poster._id}`}
                                                                    style={{
                                                                        height: '150px',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                                <div className='card-body text-center'>
                                                                    <h6 className='card-title'>
                                                                        Poster #{poster._id}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className='text-muted'>No posters found for this category.</p>
                                        )}
                                    </div>
                                )}

                                {/* Date */}
                                <div className='mb-3'>
                                    <label className='form-label'>Date</label>
                                    <input
                                        type='date'
                                        value={sched.date}
                                        className='form-control'
                                        onChange={e =>
                                            handleScheduleChange(index, 'date', e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                {/* Live Preview */}
                                {sched.livePreviewUrl && (
                                    <div className='mb-3'>
                                        <label className='form-label'>Live Preview</label>
                                        <div className='text-center'>
                                            <img
                                                src={sched.livePreviewUrl}
                                                alt='Live Preview'
                                                className='img-fluid rounded shadow'
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className='mb-3 text-end'>
                            <button
                                type='button'
                                className='btn btn-outline-secondary'
                                onClick={addScheduleRow}>
                                Add Schedule Row
                            </button>
                        </div>

                        {/* Submit */}
                        <div className='mb-3 text-center'>
                            <button
                                type='submit'
                                className='btn btn-primary'
                                disabled={loading || !formData.customerId}>
                                {loading ? 'Submitting...' : 'Create Schedule'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
