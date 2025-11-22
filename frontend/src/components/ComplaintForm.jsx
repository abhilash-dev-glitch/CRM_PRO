import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ComplaintForm = () => {
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setComplaint(response.data);
    } catch (err) {
      setError('Failed to fetch complaint');
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    priority: Yup.string().oneOf(['low', 'medium', 'high', 'urgent'], 'Invalid priority').required('Priority is required'),
    status: Yup.string().oneOf(['open', 'in-progress', 'resolved', 'closed'], 'Invalid status'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (id) {
        await axios.put(`http://localhost:5000/api/complaints/${id}`, values, {
          headers: { 'x-auth-token': token },
        });
      } else {
        await axios.post('http://localhost:5000/api/complaints', values, {
          headers: { 'x-auth-token': token },
        });
      }
      navigate('/complaints');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save complaint');
    } finally {
      setLoading(false);
    }
  };

  if (id && !complaint) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">{id ? 'Edit Complaint' : 'Register a Complaint'}</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <Formik
        initialValues={
          complaint || {
            title: '',
            description: '',
            priority: 'medium',
            status: 'open',
          }
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <Field
              type="text"
              name="title"
              placeholder="Enter complaint title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage name="title" component="div" className="text-red-500 text-xs italic mt-1" />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <Field
              as="textarea"
              name="description"
              placeholder="Enter detailed description of the complaint"
              rows="5"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-xs italic mt-1" />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
              <Field
                as="select"
                name="priority"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Field>
              <ErrorMessage name="priority" component="div" className="text-red-500 text-xs italic mt-1" />
            </div>

            {id && (
              <div>
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-xs italic mt-1" />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Saving...' : id ? 'Update Complaint' : 'Submit Complaint'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/complaints')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ComplaintForm;
