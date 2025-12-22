import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export function CreatePackage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: '',
        type: 'Budget'
    });

    return (
        <div className="max-w-full mx-auto space-y-6">
            <button onClick={() => navigate('/packages')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Packages
            </button>

            <h1 className="text-2xl font-bold text-slate-800">Create New Package</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Package Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Package Type</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>Budget</option>
                            <option>Luxury</option>
                            <option>Adventure</option>
                            <option>Family</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Price (INR)</label>
                        <input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Duration (Days)</label>
                        <input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Itinerary Highlights</label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Save className="h-4 w-4 mr-2" />
                        Create Package
                    </button>
                </div>
            </div>
        </div>
    );
}
