import { Package, Tag, Clock, IndianRupee, MoreVertical, Plus, Search } from 'lucide-react';
import { mockPackages } from '../lib/mockData';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Packages() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPackages = mockPackages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.package_type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Packages</h1>
                    <p className="text-slate-500 mt-1">Manage tour packages and itineraries.</p>
                </div>
                <button
                    onClick={() => navigate('/packages/new')}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Package
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Search Toolbar */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search packages by name or type..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPackages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>

                                <h3 className="font-bold text-lg text-slate-800 mb-2">{pkg.name}</h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="flex items-center text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                        <Tag className="h-3 w-3 mr-1" /> {pkg.package_type}
                                    </span>
                                    <span className="flex items-center text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                        <Clock className="h-3 w-3 mr-1" /> {pkg.duration_days} Days
                                    </span>
                                </div>

                                <div className="flex items-end justify-between border-t border-slate-100 pt-4 mt-2">
                                    <div>
                                        <span className="text-xs text-slate-400">Price per person</span>
                                        <div className="flex items-center font-bold text-slate-900 text-lg">
                                            <IndianRupee className="h-4 w-4" />
                                            {pkg.price_inr?.toLocaleString() ?? 'N/A'}
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-medium",
                                        pkg.is_active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {pkg.is_active ? 'Active' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
