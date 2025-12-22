import { Copy, Eye, RefreshCw, ShieldAlert } from 'lucide-react';
import { mockApiCredentials } from '../../lib/mockData';

export function ApiCredentials() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">API Credentials</h1>
                    <p className="text-slate-500 mt-1">Manage client IDs and secrets for partners.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockApiCredentials.map((cred) => (
                    <div key={cred.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{cred.partner_name}</h3>
                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">ID: {cred.partner_id}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500" title="Rotate Secret">
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                                <button className="p-2 hover:bg-red-50 rounded-full text-red-500" title="Revoke Access">
                                    <ShieldAlert className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Client ID</label>
                                <div className="flex">
                                    <code className="flex-1 bg-slate-50 border border-slate-200 rounded-l-md px-3 py-2 text-sm font-mono text-slate-800">
                                        {cred.client_id}
                                    </code>
                                    <button className="bg-white border border-l-0 border-slate-200 rounded-r-md px-3 text-slate-400 hover:text-blue-600">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">Client Secret</label>
                                <div className="flex">
                                    <code className="flex-1 bg-slate-50 border border-slate-200 rounded-l-md px-3 py-2 text-sm font-mono text-slate-800">
                                        {cred.client_secret}
                                    </code>
                                    <button className="bg-white border border-l-0 border-slate-200 px-3 text-slate-400 hover:text-blue-600">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button className="bg-white border border-l-0 border-slate-200 rounded-r-md px-3 text-slate-400 hover:text-blue-600">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">Active Scopes</label>
                                <div className="flex gap-2">
                                    {cred.scopes.map(scope => (
                                        <span key={scope} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                                            {scope}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                            <span>Rate Limit: {cred.rate_limit_per_min} req/min</span>
                            <span>Created: {new Date(cred.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
