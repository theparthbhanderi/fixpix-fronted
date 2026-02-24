import React, { useState, useEffect, useContext } from 'react';
import { apiEndpoints } from '../../lib/api';
import AuthContext from '../../context/AuthContext';
import DataTable from '../components/DataTable';
import { Clock, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

const JobsPage = () => {
    const { authTokens } = useContext(AuthContext);
    const { showToast } = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, [filter]);

    const fetchJobs = async () => {
        try {
            const url = new URL(apiEndpoints.admin.jobs);
            if (filter !== 'all') url.searchParams.append('status', filter);

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            });
            const data = await response.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            completed: 'bg-emerald-500/10 text-emerald-400',
            processing: 'bg-blue-500/10 text-blue-400 animate-pulse',
            pending: 'bg-yellow-500/10 text-yellow-500',
            failed: 'bg-red-500/10 text-red-400'
        };

        const Icons = {
            completed: CheckCircle,
            processing: Loader,
            pending: Clock,
            failed: XCircle
        };

        const Icon = Icons[status] || Clock;

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
                <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const columns = [
        {
            header: 'Job ID',
            render: (job) => <span className="font-mono text-xs text-slate-500">{job.id.slice(0, 8)}...</span>
        },
        {
            header: 'Type',
            render: (job) => (
                <span className="font-medium text-slate-300">
                    {job.type === 'restore' ? 'Restoration' : 'Generation'}
                </span>
            )
        },
        {
            header: 'Status',
            render: (job) => <StatusBadge status={job.status} />
        },
        {
            header: 'User',
            accessor: 'user'
        },
        {
            header: 'Created',
            render: (job) => new Date(job.created_at).toLocaleString()
        },
        {
            header: 'Source',
            accessor: 'source'
        }
    ];

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Job Monitor</h1>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="all">All Jobs</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        onClick={fetchJobs}
                        className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <DataTable
                data={jobs}
                columns={columns}
                pagination={true}
            />
        </div>
    );
};

export default JobsPage;
