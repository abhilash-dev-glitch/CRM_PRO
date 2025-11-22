import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/tasks', {
        headers: { 'x-auth-token': token },
      });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const filterTasks = () => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === statusFilter));
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find(t => t._id === taskId);
      await axios.put(
        `http://localhost:5001/api/tasks/${taskId}`,
        { ...task, status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/tasks/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setTasks(tasks.filter(task => task._id !== id));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      call: '📞',
      meeting: '🤝',
      demo: '💻',
      email: '📧',
      other: '📌',
    };
    return icons[type] || '📌';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-black text-gray-800 mb-2">⚡ Tasks</h1>
              <p className="text-gray-600 text-lg">Manage and track your tasks</p>
            </div>
            <Link to="/tasks/new" className="group bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-primary text-white font-bold py-3 px-8 rounded-xl transition duration-200 transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
              <span className="text-xl">+</span> New Task
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
            {['all', 'pending', 'in-progress', 'completed', 'cancelled'].map(status => {
              const statusEmojis = {
                all: '📋',
                pending: '⏳',
                'in-progress': '🔄',
                completed: '✅',
                cancelled: '❌'
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

        {/* Tasks Display */}
        {filteredTasks.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-primary/10">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or create a new task to get started.</p>
            <Link to="/tasks/new" className="inline-block bg-primary hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition">
              Create First Task
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{filteredTasks.filter(t => t.status === 'pending').length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-primary">
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-primary">{filteredTasks.filter(t => t.status === 'in-progress').length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-md border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{filteredTasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid gap-6">
              {filteredTasks.map(task => (
                <div key={task._id} className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border-l-4 border-primary hover:border-teal-600">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition flex items-center gap-3">
                          <span className="text-3xl">{getTypeIcon(task.type)}</span>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-600 mt-2">{task.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold inline-block ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {task.status === 'pending' && '⏳ Pending'}
                        {task.status === 'in-progress' && '🔄 In Progress'}
                        {task.status === 'completed' && '✅ Completed'}
                        {task.status === 'cancelled' && '❌ Cancelled'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold inline-block ${task.priority === 'low' ? 'bg-green-100 text-green-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {task.priority === 'low' && '🟢 Low'}
                        {task.priority === 'medium' && '🟡 Medium'}
                        {task.priority === 'high' && '🔴 High'}
                      </span>
                    </div>

                    {task.dueDate && (
                      <p className="text-gray-600 text-sm mb-4">
                        📅 Due: <span className="font-semibold">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </p>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-sm font-semibold focus:border-primary focus:outline-none transition"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="in-progress">🔄 In Progress</option>
                        <option value="completed">✅ Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDelete(task._id)}
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

export default TaskList;
