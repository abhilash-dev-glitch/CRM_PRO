import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    wonLeads: 0,
    tasks: 0,
    meetings: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'x-auth-token': token };

      const [leadsRes, tasksRes, meetingsRes, notificationsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/leads', { headers }),
        axios.get('http://localhost:5000/api/tasks', { headers }),
        axios.get('http://localhost:5000/api/meetings', { headers }),
        axios.get('http://localhost:5000/api/notifications', { headers }),
      ]);

      const leads = leadsRes.data;
      const tasks = tasksRes.data;
      const meetings = meetingsRes.data;

      setStats({
        totalLeads: leads.length,
        newLeads: leads.filter(l => l.status === 'new').length,
        wonLeads: leads.filter(l => l.status === 'won').length,
        tasks: tasks.filter(t => t.status !== 'completed').length,
        meetings: meetings.length,
      });

      setRecentLeads(leads.slice(0, 5));
      setUpcomingTasks(tasks.filter(t => t.status !== 'completed').slice(0, 5));
      setNotifications(notificationsRes.data.filter(n => !n.isRead).slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black mb-2">Welcome Back! 👋</h1>
            <p className="text-blue-100 text-lg">Here's your sales performance overview</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Leads</p>
                <p className="text-4xl font-black text-blue-600 mt-2">{stats.totalLeads}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">📊</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Won Deals</p>
                <p className="text-4xl font-black text-green-600 mt-2">{stats.wonLeads}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">🏆</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">New Leads</p>
                <p className="text-4xl font-black text-yellow-600 mt-2">{stats.newLeads}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">⭐</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Pending Tasks</p>
                <p className="text-4xl font-black text-purple-600 mt-2">{stats.tasks}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">✅</div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Meetings</p>
                <p className="text-4xl font-black text-red-600 mt-2">{stats.meetings}</p>
              </div>
              <div className="text-5xl opacity-20 group-hover:opacity-40 transition">📅</div>
            </div>
          </div>
        </div>

        {/* Main Navigation - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/leads" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500 hover:border-blue-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">Leads</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">Manage your leads and track their progress</p>
            <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition">View Details →</div>
          </Link>

          <Link to="/tasks" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500 hover:border-purple-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">✅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition">Tasks</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">Create and manage your tasks and follow-ups</p>
            <div className="mt-4 text-purple-600 font-semibold group-hover:translate-x-2 transition">View Details →</div>
          </Link>

          <Link to="/meetings" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-t-4 border-green-500 hover:border-green-700">
            <div className="mb-4 text-5xl group-hover:scale-110 transition duration-300">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition">Meetings</h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition">Schedule and manage your meetings</p>
            <div className="mt-4 text-green-600 font-semibold group-hover:translate-x-2 transition">View Details →</div>
          </Link>
        </div>

        {/* Recent Leads & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Leads */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-3">📈</div>
              <h3 className="text-2xl font-bold text-gray-800">Recent Leads</h3>
            </div>
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg">No leads yet. Create your first lead! 🚀</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead, idx) => (
                  <div key={lead._id} className="group bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition duration-300 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">#{idx + 1}</span>
                          <Link to={`/leads/${lead._id}`} className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
                            {lead.name}
                          </Link>
                        </div>
                        <p className="text-gray-600 text-sm">{lead.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{lead.status}</span>
                          {lead.value && <span className="text-xs font-bold text-green-600">💰 ${lead.value}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-3">⚡</div>
              <h3 className="text-2xl font-bold text-gray-800">Upcoming Tasks</h3>
            </div>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-lg">No pending tasks. Great job! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task, idx) => {
                  const typeEmojis = {
                    call: '📞',
                    meeting: '🤝',
                    demo: '💻',
                    email: '📧',
                    other: '📌'
                  };
                  return (
                    <div key={task._id} className="group bg-gradient-to-r from-purple-50 to-transparent p-4 rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{typeEmojis[task.type] || '📌'}</span>
                            <p className="text-lg font-bold text-gray-800 group-hover:text-purple-600 transition">{task.title}</p>
                          </div>
                          <p className="text-gray-600 text-sm ml-8">{task.type}</p>
                          {task.dueDate && (
                            <p className="text-gray-500 text-xs ml-8 mt-2">📅 Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Notifications - Enhanced */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 mb-8">
            <div className="flex items-center mb-6">
              <div className="text-4xl mr-3 animate-pulse">🔔</div>
              <h3 className="text-2xl font-bold text-gray-800">Latest Notifications</h3>
            </div>
            <div className="space-y-3">
              {notifications.map((notif, idx) => (
                <div key={notif._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-xl hover:shadow-md transition duration-300">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">ℹ️</div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-bold text-lg">{notif.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
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

export default UserDashboard;
