import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createJob } from '../services/jobService';

export default function CreateJob() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: '',
    location: '',
    lastDate: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) throw new Error('Job title is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (!formData.eligibility.trim()) throw new Error('Eligibility is required');
      if (!formData.location.trim()) throw new Error('Location is required');
      if (!formData.lastDate) throw new Error('Last date is required');

      const jobData = {
        ...formData,
        lastDate: new Date(formData.lastDate),
      };

      await createJob(jobData, currentUser.uid);
      navigate('/admin');
      alert('Job created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Create New Job</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Job description and responsibilities"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="eligibility">Eligibility Criteria</label>
            <input
              type="text"
              id="eligibility"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="e.g., 7+ CGPA, BE/B.Tech"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore, India"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastDate">Last Date to Apply</label>
            <input
              type="date"
              id="lastDate"
              name="lastDate"
              value={formData.lastDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creating Job...' : 'Create Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
