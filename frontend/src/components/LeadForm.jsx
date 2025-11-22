import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LeadForm = () => {
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/users', {
        headers: { 'x-auth-token': token },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/leads/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setLead(response.data);
    } catch (err) {
      setError('Failed to fetch lead');
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Valid email required').required('Email is required'),
    phone: Yup.string(),
    company: Yup.string(),
    title: Yup.string(),
    status: Yup.string().oneOf(['new', 'contacted', 'in-progress', 'won', 'lost']),
    priority: Yup.string().oneOf(['low', 'medium', 'high']),
    source: Yup.string().oneOf(['website', 'phone', 'email', 'social', 'referral', 'other']),
    value: Yup.number().min(0),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (id) {
        await axios.put(`http://localhost:5001/api/leads/${id}`, values, {
          headers: { 'x-auth-token': token },
        });
      } else {
        await axios.post('http://localhost:5001/api/leads', values, {
          headers: { 'x-auth-token': token },
        });
      }
      navigate('/leads');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  if (id && !lead) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">{id ? 'Edit Lead' : 'Add New Lead'}</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Formik
        initialValues={
          lead || {
            name: '',
            email: '',
            phone: '',
            company: '',
            title: '',
            status: 'new',
            priority: 'medium',
            source: 'other',
            value: 0,
            expectedCloseDate: '',
            notes: '',
          }
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name *</label>
              <Field type="text" name="name" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs italic mt-1" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
              <Field type="email" name="email" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs italic mt-1" />
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="mb-6">
              <label htmlFor="assignedTo" className="block text-gray-700 text-sm font-bold mb-2">Assign To</label>
              <Field as="select" name="assignedTo" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </Field>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
              <Field type="tel" name="phone" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">Company</label>
              <Field type="text" name="company" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <Field type="text" name="title" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="value" className="block text-gray-700 text-sm font-bold mb-2">Deal Value ($)</label>
              <Field type="number" name="value" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <Field as="select" name="status" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in-progress">In Progress</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </Field>
            </div>
            <div>
              <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
              <Field as="select" name="priority" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="source" className="block text-gray-700 text-sm font-bold mb-2">Source</label>
              <Field as="select" name="source" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="website">Website</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="social">Social Media</option>
                <option value="referral">Referral</option>
                <option value="other">Other</option>
              </Field>
            </div>
            <div>
              <label htmlFor="expectedCloseDate" className="block text-gray-700 text-sm font-bold mb-2">Expected Close Date</label>
              <Field type="date" name="expectedCloseDate" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
            <Field as="textarea" name="notes" rows="4" className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
              {loading ? 'Saving...' : id ? 'Update Lead' : 'Create Lead'}
            </button>
            <button type="button" onClick={() => navigate('/leads')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default LeadForm;
