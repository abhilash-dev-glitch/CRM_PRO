import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CustomerForm = () => {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5001/api/customers/${id}`, {
            headers: { 'x-auth-token': token },
          });
          setCustomer(response.data);
        } catch (err) {
          setError('Failed to fetch customer');
        }
      };
      fetchCustomer();
    }
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (id) {
        await axios.put(`http://localhost:5001/api/customers/${id}`, values, {
          headers: { 'x-auth-token': token },
        });
      } else {
        await axios.post('http://localhost:5001/api/customers', values, {
          headers: { 'x-auth-token': token },
        });
      }
      navigate('/customers');
    } catch (err) {
      setError('Failed to save customer');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Customer' : 'Add Customer'}</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <Formik
        initialValues={customer}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <Field name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-xs italic" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <Field name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-xs italic" />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <Field name="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <ErrorMessage name="phone" component="div" className="text-red-500 text-xs italic" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CustomerForm;
