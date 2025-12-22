import { Search, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { mockApiLogs } from '../../lib/mockData';
import { cn } from '../../lib/utils';

export function ApiAccessLogs() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">API Access Logs</h1>
                    <p className="text-slate-500 mt-1">Monitor partner API usage and errors.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by endpoint, partner or IP..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Partner</th>
                                <th className="px-6 py-3">Method / Endpoint</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockApiLogs.map((log) => (
                                <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-mono text-xs">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {log.partner_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center font-mono text-xs">
                                            <span className="font-bold mr-2 text-slate-600">GET</span>
                                            <span className="text-slate-500">{log.endpoint}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                            log.status_code >= 200 && log.status_code < 300 ? "bg-green-100 text-green-800" :
                                                log.status_code >= 400 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                        )}>
                                            {log.status_code >= 200 && log.status_code < 300 ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                                            {log.status_code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs flex items-center">
                                        <Globe className="h-3 w-3 mr-1 text-slate-400" />
                                        {log.request_ip}
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
