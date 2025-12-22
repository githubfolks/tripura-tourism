import { Activity, Search, Filter } from 'lucide-react';
import { mockActivityLogs } from '../../lib/mockData';
export function UserActivityLogs() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Activity Logs</h1>
                    <p className="text-slate-500 mt-1">Audit trail of user actions.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                        />
                    </div>
                    <button className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Resource</th>
                                <th className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockActivityLogs.map((log) => (
                                <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {log.user_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-700">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center text-xs text-slate-600">
                                            <Activity className="h-3 w-3 mr-1" />
                                            {log.resource_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                                        ID: {log.resource_id}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
