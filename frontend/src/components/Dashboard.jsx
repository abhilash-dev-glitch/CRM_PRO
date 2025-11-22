import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/complaints', {
        headers: { 'x-auth-token': token },
      });
      const complaints = response.data;
      setComplaints(complaints.slice(0, 5)); // Show last 5 complaints

      // Calculate stats
      const total = complaints.length;
      const open = complaints.filter(c => c.status === 'open').length;
      const inProgress = complaints.filter(c => c.status === 'in-progress').length;
      const resolved = complaints.filter(c => c.status === 'resolved').length;

      setStats({ total, open, inProgress, resolved });
    } catch (err) {
      console.error('Failed to fetch complaints');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-black mb-2">📊 Dashboard</h1>
          <p className="text-blue-100 text-lg">Manage your complaints and customers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Complaints</p>
                <p className="text-4xl font-black text-blue-600 mt-2">{stats.total}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">📋</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Open</p>
                <p className="text-4xl font-black text-red-600 mt-2">{stats.open}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">🔴</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">In Progress</p>
                <p className="text-4xl font-black text-yellow-600 mt-2">{stats.inProgress}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">🟡</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Resolved</p>
                <p className="text-4xl font-black text-green-600 mt-2">{stats.resolved}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">✅</div>
            </div>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/customers" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-green-500 hover:border-green-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition">Customers</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">Manage your customers</p>
            <div className="mt-4 text-green-600 font-semibold group-hover:translate-x-2 transition">View Customers →</div>
          </Link>

          <Link to="/complaints" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-red-500 hover:border-red-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition">Complaints</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">View all complaints</p>
            <div className="mt-4 text-red-600 font-semibold group-hover:translate-x-2 transition">View Complaints →</div>
          </Link>

          <Link to="/complaints/new" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500 hover:border-purple-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition">New Complaint</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">Report a complaint</p>
            <div className="mt-4 text-purple-600 font-semibold group-hover:translate-x-2 transition">Create Complaint →</div>
          </Link>
        </div>

        {/* Recent Complaints */}
        {complaints.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 mb-8">
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-3">📝</div>
              <h3 className="text-2xl font-bold text-gray-800">Recent Complaints</h3>
            </div>
            <div className="space-y-3">
              {complaints.map(complaint => (
                <div key={complaint._id} className="group bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 group-hover:text-blue-600 transition">{complaint.title}</p>
                      <p className="text-gray-600 text-sm">{complaint.description.substring(0, 60)}...</p>
                    </div>
                    <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap ${
                      complaint.status === 'open' ? 'bg-red-100 text-red-700' :
                      complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {complaint.status === 'open' && '🔴 Open'}
                      {complaint.status === 'in-progress' && '🟡 In Progress'}
                      {complaint.status === 'resolved' && '✅ Resolved'}
                      {complaint.status === 'closed' && '⚫ Closed'}
                    </span>
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

export default Dashboard;
