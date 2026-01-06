import { Search, Plus, MapPin, Edit2, Trash2, Star } from 'lucide-react';
import { mockDestinations } from '../lib/mockData';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Destinations() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    // Local state for immediate UI feedback, syncing with mockData
    const [destinations, setDestinations] = useState(mockDestinations);
    const navigate = useNavigate();

    const toggleFeatured = (id: string, currentStatus: boolean | undefined) => {
        // Update local state
        const updatedDestinations = destinations.map(dest =>
            dest.id === id ? { ...dest, is_featured: !currentStatus } : dest
        );
        setDestinations(updatedDestinations);

        // Update mock data reference (for persistence across navigation in this session)
        const mockIndex = mockDestinations.findIndex(d => d.id === id);
        if (mockIndex !== -1) {
            mockDestinations[mockIndex].is_featured = !currentStatus;
        }
    };

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dest.district || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Destinations</h1>
                    <p className="text-slate-500 mt-1">Manage tourist locations and attractions.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white rounded-lg border border-slate-300 p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-1.5 rounded", viewMode === 'list' ? "bg-slate-100 text-blue-600" : "text-slate-400 hover:text-slate-600")}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn("p-1.5 rounded", viewMode === 'grid' ? "bg-slate-100 text-blue-600" : "text-slate-400 hover:text-slate-600")}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/destinations/mass-update')}
                        className="flex items-center justify-center px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Mass Update
                    </button>
                    <button
                        onClick={() => navigate('/destinations/new')}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Destination
                    </button>
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
                            placeholder="Search destinations by name or district..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="font-semibold text-slate-700 mr-1">{filteredDestinations.length}</span> destinations found
                    </div>
                </div>

                {viewMode === 'list' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 w-12">Preview</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">District</th>
                                    <th className="px-6 py-3">Best Time</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-center">Featured</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDestinations.map((dest) => (
                                    <tr key={dest.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="h-10 w-16 bg-slate-200 rounded overflow-hidden">
                                                {dest.images?.[0] ?
                                                    <img src={dest.images[0]} alt={dest.name} className="h-full w-full object-cover" /> :
                                                    <div className="h-full w-full flex items-center justify-center text-slate-400"><MapPin className="h-4 w-4" /></div>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{dest.name}</td>
                                        <td className="px-6 py-4">{dest.district}</td>
                                        <td className="px-6 py-4">{dest.best_time_to_visit}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                dest.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            )}>
                                                {dest.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleFeatured(dest.id, dest.is_featured)}
                                                className={cn(
                                                    "p-1.5 rounded-full transition-colors",
                                                    dest.is_featured
                                                        ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                                                        : "text-slate-300 hover:text-slate-400 hover:bg-slate-100"
                                                )}
                                                title={dest.is_featured ? "Remove from Featured" : "Mark as Featured"}
                                            >
                                                <Star className={cn("h-5 w-5", dest.is_featured && "fill-current")} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="text-slate-400 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                                                <button className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {viewMode === 'grid' && (
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDestinations.map((dest) => (
                            <div key={dest.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative">
                                <div className="h-40 bg-slate-200 relative">
                                    {dest.images?.[0] ?
                                        <img src={dest.images[0]} alt={dest.name} className="h-full w-full object-cover" /> :
                                        <div className="h-full w-full flex items-center justify-center text-slate-400"><MapPin className="h-8 w-8" /></div>
                                    }
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button
                                            onClick={(e) => { e.preventDefault(); toggleFeatured(dest.id, dest.is_featured); }}
                                            className={cn(
                                                "p-1.5 rounded-full shadow-sm backdrop-blur-sm transition-colors",
                                                dest.is_featured
                                                    ? "bg-yellow-400 text-white"
                                                    : "bg-white/80 text-slate-400 hover:text-yellow-500"
                                            )}
                                            title="Toggle Featured"
                                        >
                                            <Star className={cn("h-3.5 w-3.5", dest.is_featured && "fill-current")} />
                                        </button>
                                        <span className={cn(
                                            "px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center",
                                            dest.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                        )}>
                                            {dest.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">{dest.name}</h3>
                                    <div className="flex items-center text-xs text-slate-500 mb-3">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {dest.district}
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 h-10 mb-4">
                                        {dest.description}
                                    </p>
                                    <div className="flex justify-end pt-3 border-t border-slate-100">
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                                            Manage Details
                                            <Edit2 className="h-3 w-3 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
