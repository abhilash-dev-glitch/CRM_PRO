import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter]);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/leads', {
        headers: { 'x-auth-token': token },
      });
      setLeads(response.data);
    } catch (err) {
      setError('Failed to fetch leads');
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/leads/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setLeads(leads.filter(lead => lead._id !== id));
      } catch (err) {
        setError('Failed to delete lead');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-black text-gray-800 mb-2">📊 Leads Pipeline</h1>
              <p className="text-gray-600 text-lg">Manage and track all your leads</p>
            </div>
            <Link to="/leads/new" className="group bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-primary text-white font-bold py-3 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <span className="text-xl">+</span> Add New Lead
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md mb-6">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-8 border border-primary/10">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3">🔍 Search Leads</label>
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition duration-200 text-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-3">Filter by Status</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'new', 'contacted', 'in-progress', 'won', 'lost'].map(status => {
                const statusEmojis = {
                  all: '📋',
                  new: '⭐',
                  contacted: '📞',
                  'in-progress': '🔄',
                  won: '🏆',
                  lost: '❌'
                };
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 transform hover:scale-105 flex items-center gap-2 ${statusFilter === status
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary/10'
                      }`}
                  >
                    <span>{statusEmojis[status]}</span>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leads Display */}
        {filteredLeads.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-primary/10">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters or create a new lead to get started.</p>
            <Link to="/leads/new" className="inline-block bg-primary hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition">
              Create First Lead
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-primary">
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-3xl font-bold text-primary">{filteredLeads.length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Won Deals</p>
                <p className="text-3xl font-bold text-green-600">{filteredLeads.filter(l => l.status === 'won').length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{filteredLeads.filter(l => l.status === 'in-progress').length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-accent">
                <p className="text-gray-600 text-sm">Total Value</p>
                <p className="text-3xl font-bold text-accent">${filteredLeads.reduce((sum, lead) => sum + (lead.value || 0), 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden border-2 border-primary/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-secondary to-slate-800 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Priority</th>
                      <th className="px-6 py-4 text-right text-sm font-bold">Value</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead, idx) => (
                      <tr key={lead._id} className="hover:bg-primary/5 transition duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary group-hover:bg-primary/30 transition">
                              {lead.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-800 group-hover:text-primary transition">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600 text-sm">{lead.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600">{lead.company || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-lg text-sm font-bold inline-block ${getStatusBadge(lead.status)}`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold capitalize ${lead.priority === 'high' ? 'bg-red-100 text-red-700' :
                              lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-bold text-gray-800">${(lead.value || 0).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                            <Link
                              to={`/leads/${lead._id}`}
                              className="bg-primary hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDelete(lead._id)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadList;
