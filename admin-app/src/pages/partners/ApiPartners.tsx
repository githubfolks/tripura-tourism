import { Search, Plus, Globe, Mail, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { mockPartners } from '../../lib/mockData';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function ApiPartners() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">API Partners</h1>
                    <p className="text-slate-500 mt-1">Manage external integration partners.</p>
                </div>
                <button
                    onClick={() => navigate('/partners/onboard')}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Onboard Partner
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search partners..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Partner Name</th>
                            <th className="px-6 py-3">Contact</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Joined</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockPartners.map((partner) => (
                            <tr key={partner.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{partner.name}</div>
                                    <div className="flex items-center text-xs text-slate-400 mt-0.5">
                                        <Globe className="h-3 w-3 mr-1" />
                                        {partner.domain}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <Mail className="h-3 w-3 mr-2 text-slate-400" />
                                        {partner.contact_email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "flex items-center text-xs font-medium",
                                        partner.is_active ? "text-green-600" : "text-red-600"
                                    )}>
                                        {partner.is_active ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                        {partner.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(partner.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
