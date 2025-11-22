import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, BarChart2, Grid, Mail, Globe, Plus, RefreshCw, Phone, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    wonLeads: 0,
    tasks: 0,
    meetings: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'x-auth-token': token };

      const [leadsRes, tasksRes, meetingsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/leads', { headers }),
        axios.get('http://localhost:5001/api/tasks', { headers }),
        axios.get('http://localhost:5001/api/meetings', { headers }),
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
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  // Mock data for the chart
  const activityData = [
    { name: 'MON', calls: 15, emails: 10 },
    { name: 'TUE', calls: 20, emails: 15 },
    { name: 'WED', calls: 31, emails: 24 },
    { name: 'THU', calls: 28, emails: 27 },
    { name: 'FRI', calls: 26, emails: 26 },
  ];

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const StatCard = ({ title, mainValue, subItems, colorClass }) => (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <h3 className="text-gray-500 font-semibold mb-4">{title}</h3>
      <div className="flex justify-between items-end">
        <span className={`text-4xl font-bold ${colorClass}`}>{mainValue}</span>
        <div className="text-sm text-gray-500 space-y-1 text-right">
          {subItems.map((item, idx) => (
            <div key={idx}>
              <span className={`font-bold ${item.color || 'text-primary'}`}>{item.value}</span> {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* My Leadscore Section */}
        <div>
          <h2 className="text-gray-500 font-semibold mb-4">My Leadscore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Contacts"
              mainValue={stats.totalLeads}
              colorClass="text-primary"
              subItems={[
                { value: Math.floor(stats.totalLeads * 0.6), label: 'Companies' },
                { value: Math.ceil(stats.totalLeads * 0.4), label: 'Persons' }
              ]}
            />
            <StatCard
              title="Recent Contacts"
              mainValue={stats.newLeads}
              colorClass="text-primary"
              subItems={[
                { value: 9, label: 'Unassigned' },
                { value: stats.newLeads - 9 > 0 ? stats.newLeads - 9 : 0, label: 'Assigned' }
              ]}
            />
            <StatCard
              title="To-Dos"
              mainValue={stats.tasks}
              colorClass="text-primary"
              subItems={[
                { value: 11, label: 'Overdue' },
                { value: 3, label: 'Today' }
              ]}
            />
            <StatCard
              title="Deals"
              mainValue={stats.wonLeads}
              colorClass="text-primary"
              subItems={[
                { value: 3, label: 'News' },
                { value: '4590,00 €', label: 'Pipeline', color: 'text-accent' }
              ]}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Activity Overview & Insights */}
          <div className="lg:col-span-1 space-y-6">
            {/* Activity Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 font-semibold mb-6">Activity Overview</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="calls" stroke="#0D9488" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="emails" stroke="#5EEAD4" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Calls</p>
                  <p className="text-2xl font-bold text-primary">49</p>
                  <div className="text-xs text-gray-400 flex gap-2">
                    <span className="text-green-500">34 ⬅</span>
                    <span className="text-red-500">15 ➡</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Emails</p>
                  <p className="text-2xl font-bold text-primary">145</p>
                  <div className="text-xs text-gray-400 flex gap-2">
                    <span className="text-green-500">130 ⬅</span>
                    <span className="text-red-500">15 ➡</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50 hover:-translate-y-1 cursor-pointer active:scale-100 active:shadow-lg group">
                <h3 className="text-gray-500 font-semibold mb-4 transition-colors duration-300 group-hover:text-primary">Calls Insight</h3>
                <div className="space-y-3">
                  <div className="flex justify-between transition-all duration-200 group-hover:translate-x-1">
                    <span className="font-bold text-primary transition-all duration-300 group-hover:scale-110">0</span>
                    <span className="text-gray-500 text-sm">Missed Calls</span>
                  </div>
                  <div className="flex justify-between transition-all duration-200 group-hover:translate-x-1">
                    <span className="font-bold text-primary transition-all duration-300 group-hover:scale-110">2</span>
                    <span className="text-gray-500 text-sm">Unassigned callers</span>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-accent/50 hover:-translate-y-1 cursor-pointer active:scale-100 active:shadow-lg group">
                <h3 className="text-gray-500 font-semibold mb-4 transition-colors duration-300 group-hover:text-accent">Emails Insight</h3>
                <div className="space-y-3">
                  <div className="flex justify-between transition-all duration-200 group-hover:translate-x-1">
                    <span className="font-bold text-primary transition-all duration-300 group-hover:scale-110">30</span>
                    <span className="text-gray-500 text-sm text-right">From contacts on list(s)</span>
                  </div>
                  <div className="flex justify-between transition-all duration-200 group-hover:translate-x-1">
                    <span className="font-bold text-primary transition-all duration-300 group-hover:scale-110">32</span>
                    <span className="text-gray-500 text-sm text-right">From unassigned senders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Contacts */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-gray-500 font-semibold">Contacts</h3>
                <div className="flex gap-4 text-gray-400">
                  <RefreshCw className="h-5 w-5 cursor-pointer hover:text-primary" />
                  <BarChart2 className="h-5 w-5 cursor-pointer hover:text-primary" />
                  <Plus className="h-5 w-5 cursor-pointer hover:text-primary" />
                </div>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                {recentLeads.length > 0 ? (
                  <div className="space-y-4">
                    {recentLeads.map((lead, idx) => {
                      const colors = ['bg-green-500', 'bg-yellow-600', 'bg-red-600', 'bg-blue-400', 'bg-purple-500'];
                      const color = colors[idx % colors.length];
                      return (
                        <div key={lead._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                          <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>
                            {getUserInitials(lead.name)}
                          </div>
                          <div>
                            <Link to={`/leads/${lead._id}`} className="font-bold text-primary hover:underline block">
                              {lead.name}
                            </Link>
                            <p className="text-xs text-gray-500 font-semibold">{lead.title || 'Contact'} @ {lead.company || 'Unknown'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No recent contacts</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: To-Dos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-gray-500 font-semibold">To-Dos</h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-0">
                    {upcomingTasks.map((task, idx) => {
                      const borderColors = ['border-yellow-400', 'border-red-400', 'border-orange-400', 'border-green-400', 'border-blue-400'];
                      const color = borderColors[idx % borderColors.length];
                      return (
                        <div key={task._id} className={`p-4 border-l-4 ${color} bg-white hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0`}>
                          <p className="text-gray-700 font-medium">{task.title}</p>
                          {task.dueDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">No pending tasks</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
