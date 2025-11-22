import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/customers', {
          headers: { 'x-auth-token': token },
        });
        setCustomers(response.data);
      } catch (err) {
        setError('Failed to fetch customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/customers/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setCustomers(customers.filter(customer => customer._id !== id));
    } catch (err) {
      setError('Failed to delete customer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-black text-gray-800 mb-2">👥 Customers</h1>
              <p className="text-gray-600 text-lg">Manage all your customers</p>
            </div>
            <Link to="/customers/new" className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <span className="text-xl">+</span> Add Customer
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md mb-6">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Customers Display */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-6">Add your first customer to get started.</p>
            <Link to="/customers/new" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition">
              Create First Customer
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-green-50 transition duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                            {customer.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800 group-hover:text-green-600 transition">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{customer.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{customer.phone || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                          <Link
                            to={`/customers/${customer._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
