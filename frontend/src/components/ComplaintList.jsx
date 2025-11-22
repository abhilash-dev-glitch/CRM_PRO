import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/complaints', {
        headers: { 'x-auth-token': token },
      });
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/complaints/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setComplaints(complaints.filter(complaint => complaint._id !== id));
      } catch (err) {
        setError('Failed to delete complaint');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-black text-gray-800 mb-2">📝 Complaints</h1>
              <p className="text-gray-600 text-lg">Manage and track customer complaints</p>
            </div>
            <Link to="/complaints/new" className="group bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-primary text-white font-bold py-3 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <span className="text-xl">+</span> New Complaint
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md mb-6">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-8 border border-primary/10">
          <label className="block text-gray-700 font-bold mb-4">🔍 Filter by Status</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All', emoji: '📋' },
              { value: 'open', label: 'Open', emoji: '🔴' },
              { value: 'in-progress', label: 'In Progress', emoji: '🟡' },
              { value: 'resolved', label: 'Resolved', emoji: '✅' },
              { value: 'closed', label: 'Closed', emoji: '⚫' },
            ].map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-200 transform hover:scale-105 flex items-center gap-2 ${filter === value
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary/10'
                  }`}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Display */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-primary/10">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No complaints found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or create a new complaint.</p>
            <Link to="/complaints/new" className="inline-block bg-primary hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition">
              Create First Complaint
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-red-500">
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-3xl font-bold text-red-600">{filteredComplaints.length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm">Open</p>
                <p className="text-3xl font-bold text-yellow-600">{filteredComplaints.filter(c => c.status === 'open').length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-primary">
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-primary">{filteredComplaints.filter(c => c.status === 'in-progress').length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{filteredComplaints.filter(c => c.status === 'resolved').length}</p>
              </div>
            </div>

            {/* Complaints Cards */}
            <div className="space-y-6">
              {filteredComplaints.map(complaint => (
                <div key={complaint._id} className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border-l-4 border-primary hover:border-teal-600">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition mb-2">
                          📌 {complaint.title}
                        </h3>
                        <p className="text-gray-600">{complaint.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold inline-block ${getStatusColor(complaint.status)}`}>
                        {complaint.status === 'open' && '🔴 Open'}
                        {complaint.status === 'in-progress' && '🟡 In Progress'}
                        {complaint.status === 'resolved' && '✅ Resolved'}
                        {complaint.status === 'closed' && '⚫ Closed'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold inline-block ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority === 'low' && '🟢 Low'}
                        {complaint.priority === 'medium' && '🟡 Medium'}
                        {complaint.priority === 'high' && '🟠 High'}
                        {complaint.priority === 'urgent' && '🔴 Urgent'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      📅 Created: {new Date(complaint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Link
                        to={`/complaints/${complaint._id}`}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(complaint._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintList;
