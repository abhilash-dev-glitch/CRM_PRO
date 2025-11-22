import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLeads: 0,
    wonLeads: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [topSalesReps, setTopSalesReps] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'x-auth-token': token };

      const [usersRes, leadsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/users', { headers }),
        axios.get('http://localhost:5001/api/leads', { headers }),
      ]);

      const users = usersRes.data;
      const leads = leadsRes.data;

      setUsers(users.filter(u => u.role !== 'admin'));
      setLeads(leads);

      const wonLeads = leads.filter(l => l.status === 'won');
      const totalRevenue = wonLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

      setStats({
        totalUsers: users.length - 1, // Exclude self (admin)
        totalLeads: leads.length,
        wonLeads: wonLeads.length,
        totalRevenue,
      });

      // Calculate top sales reps
      const repsPerformance = {};
      leads.forEach(lead => {
        if (lead.assignedTo) {
          if (!repsPerformance[lead.assignedTo._id]) {
            repsPerformance[lead.assignedTo._id] = {
              name: lead.assignedTo.name,
              totalLeads: 0,
              wonLeads: 0,
              revenue: 0,
            };
          }
          repsPerformance[lead.assignedTo._id].totalLeads++;
          if (lead.status === 'won') {
            repsPerformance[lead.assignedTo._id].wonLeads++;
            repsPerformance[lead.assignedTo._id].revenue += lead.value || 0;
          }
        }
      });

      const topReps = Object.values(repsPerformance)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopSalesReps(topReps);
    } catch (err) {
      setError('Failed to fetch admin data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black mb-2">⚙️ Admin Dashboard</h1>
            <p className="text-indigo-100 text-lg">Complete control over your CRM system</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md mb-8">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Users</p>
                <p className="text-4xl font-black text-blue-600 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">👥</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Leads</p>
                <p className="text-4xl font-black text-green-600 mt-2">{stats.totalLeads}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">📊</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Won Deals</p>
                <p className="text-4xl font-black text-yellow-600 mt-2">{stats.wonLeads}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">🏆</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Revenue</p>
                <p className="text-4xl font-black text-purple-600 mt-2">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">💰</div>
            </div>
          </div>
        </div>

        {/* Navigation Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/admin/users" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500 hover:border-blue-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">Users & Permissions</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">Manage team members and roles</p>
            <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition">Manage Users →</div>
          </Link>

          <Link to="/admin/leads" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-green-500 hover:border-green-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition">Lead Management</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">View and manage all leads</p>
            <div className="mt-4 text-green-600 font-semibold group-hover:translate-x-2 transition">View Leads →</div>
          </Link>

          <Link to="/admin/analytics" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500 hover:border-purple-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">📈</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition">Analytics & Reports</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">View sales performance metrics</p>
            <div className="mt-4 text-purple-600 font-semibold group-hover:translate-x-2 transition">View Reports →</div>
          </Link>
        </div>

        {/* Top Sales Representatives & Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Sales Representatives */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-3">🏆</div>
              <h3 className="text-2xl font-bold text-gray-800">Top Sales Representatives</h3>
            </div>
            {topSalesReps.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg">No sales data yet. Assign leads to team members! 🚀</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topSalesReps.map((rep, index) => (
                  <div key={index} className="group bg-gradient-to-r from-yellow-50 to-transparent p-4 rounded-xl border border-yellow-100 hover:border-yellow-300 hover:shadow-md transition duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{'🥇🥈🥉🏅⭐'.charAt(index)}</span>
                          <p className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition">{rep.name}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 ml-8">
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Leads</p>
                            <p className="text-2xl font-black text-blue-600">{rep.totalLeads}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Won</p>
                            <p className="text-2xl font-black text-green-600">{rep.wonLeads}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Revenue</p>
                            <p className="text-2xl font-black text-purple-600">${rep.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-3">📌</div>
              <h3 className="text-2xl font-bold text-gray-800">Recent Leads</h3>
            </div>
            {leads.slice(0, 5).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg">No leads created yet 📋</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 5).map(lead => (
                  <div key={lead._id} className="group bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 group-hover:text-blue-600 transition">{lead.name}</p>
                        <p className="text-gray-600 text-sm">{lead.email}</p>
                        <p className="text-gray-500 text-xs mt-1">👤 Assigned to: <span className="font-semibold">{lead.assignedTo?.name || 'Unassigned'}</span></p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        lead.status === 'won' ? 'bg-green-100 text-green-700' :
                        lead.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="text-4xl mr-3">👥</div>
              <h3 className="text-2xl font-bold text-gray-800">Team Members</h3>
            </div>
            <Link to="/admin/users/new" className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <span className="text-xl">+</span> Add User
            </Link>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-lg">No team members yet. Create your first user! 🎉</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-blue-50 transition duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold capitalize ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{user.department || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link to={`/admin/users/${user._id}`} className="text-blue-600 hover:text-blue-800 font-bold hover:underline transition">
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
