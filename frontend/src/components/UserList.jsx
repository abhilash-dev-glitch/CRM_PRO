import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/users', {
                    headers: { 'x-auth-token': token },
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/users/${id}`, {
                headers: { 'x-auth-token': token },
            });
            setUsers(users.filter(user => user._id !== id));
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-5xl font-black text-gray-800 mb-2">👥 Users</h1>
                            <p className="text-gray-600 text-lg">Manage system users and roles</p>
                        </div>
                        {/* Add User button could go here if we implement a UserForm */}
                    </div>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md mb-6">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Users Display */}
                {users.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No users found</h3>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
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
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
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

export default UserList;
