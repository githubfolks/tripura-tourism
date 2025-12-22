import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export function CreateDestination() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        district: '',
        description: '',
        best_time: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to save...
        navigate('/destinations');
    };

    return (
        <div className="max-w-full mx-auto space-y-6">
            <button onClick={() => navigate('/destinations')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
            </button>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Add New Destination</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Destination Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Unakoti"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Slug (URL)</label>
                        <input
                            type="text"
                            placeholder="e.g. unakoti-hills"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">District <span className="text-red-500">*</span></label>
                        <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.district}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                        >
                            <option value="">Select District</option>
                            <option value="West Tripura">West Tripura</option>
                            <option value="Unakoti">Unakoti</option>
                            <option value="Dhalai">Dhalai</option>
                            <option value="Gomati">Gomati</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Best Time to Visit</label>
                        <input
                            type="text"
                            placeholder="e.g. Oct - Mar"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.best_time}
                            onChange={e => setFormData({ ...formData, best_time: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        rows={4}
                        placeholder="Describe the beauty and history of this place..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Cover Image</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save Destination
                    </button>
                </div>
            </form>
        </div>
    );
}
