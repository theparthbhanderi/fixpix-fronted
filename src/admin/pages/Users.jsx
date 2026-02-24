import React, { useState, useEffect, useContext } from 'react';
import { apiEndpoints } from '../../lib/api';
import AuthContext from '../../context/AuthContext';
import DataTable from '../components/DataTable';
import { Shield, Ban, CheckCircle, UserX } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const UsersPage = () => {
    const { authTokens } = useContext(AuthContext);
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [searchQuery]); // Debounce in real app

    const fetchUsers = async () => {
        try {
            const url = new URL(apiEndpoints.admin.users);
            if (searchQuery) url.searchParams.append('search', searchQuery);

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
            return;
        }

        try {
            const url = apiEndpoints.admin.userAction(userId);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`
                },
                body: JSON.stringify({ action })
            });

            if (response.ok) {
                showToast(`User ${action}ed successfully`, 'success');
                fetchUsers();
            } else {
                const data = await response.json().catch(() => ({}));
                console.error("Action error details:", data);
                showToast(data.error || `Action failed: ${response.statusText}`, 'error');
            }
        } catch (error) {
            console.error("Connection error:", error);
            showToast(`Connection error: ${error.message}`, 'error');
        }
    };

    const columns = [
        {
            header: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-white">{user.username}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Role',
            render: (user) => (
                user.is_staff ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                        <Shield className="w-3 h-3" /> Admin
                    </span>
                ) : (
                    <span className="text-slate-500 text-sm">User</span>
                )
            )
        },
        {
            header: 'Status',
            render: (user) => (
                user.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                        <UserX className="w-3 h-3" /> Banned
                    </span>
                )
            )
        },
        {
            header: 'Jobs',
            accessor: 'job_count'
        },
        {
            header: 'Joined',
            render: (user) => new Date(user.date_joined).toLocaleDateString()
        },
        {
            header: 'Actions',
            render: (user) => (
                <div className="flex gap-2">
                    {!user.is_staff && (
                        user.is_active ? (
                            <button
                                onClick={() => handleAction(user.id, 'ban')}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                title="Ban User"
                            >
                                <Ban className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleAction(user.id, 'unban')}
                                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                                title="Unban User"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        )
                    )}
                </div>
            )
        }
    ];

    if (loading) return <div className="p-10 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">User Management</h1>
            </header>
            <DataTable
                data={users}
                columns={columns}
                onSearch={setSearchQuery}
                pagination={true}
            />
        </div>
    );
};

export default UsersPage;
