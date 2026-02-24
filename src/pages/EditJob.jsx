import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJob, updateJob } from '../services/jobService';

export default function EditJob() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: '',
    location: '',
    lastDate: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const job = await getJob(id);
      setFormData({
        title: job.title,
        description: job.description,
        eligibility: job.eligibility,
        location: job.location,
        lastDate: job.lastDate
          ? new Date(job.lastDate.seconds * 1000).toISOString().split('T')[0]
          : '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const updatedData = {
        ...formData,
        lastDate: new Date(formData.lastDate),
      };

      await updateJob(id, updatedData);
      navigate('/admin');
      alert('Job updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Edit Job</h2>
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
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Updating Job...' : 'Update Job'}
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
