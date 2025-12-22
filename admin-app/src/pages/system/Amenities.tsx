import { Coffee, Plus, Edit2, Trash2 } from 'lucide-react';
import { mockAmenities } from '../../lib/mockData';
export function Amenities() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Amenities</h1>
                    <p className="text-slate-500 mt-1">Manage facilities for packages and destinations.</p>
                </div>
                <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Amenity
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockAmenities.map((amenity) => (
                    <div key={amenity.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3 text-slate-600">
                                <Coffee className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900">{amenity.name}</h3>
                                <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                    {amenity.category}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <button className="text-slate-400 hover:text-blue-600 p-1"><Edit2 className="h-3 w-3" /></button>
                            <button className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="h-3 w-3" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
