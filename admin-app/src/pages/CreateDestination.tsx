import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Star } from 'lucide-react';
import { mockDestinations } from '../lib/mockData';

interface DestinationImage {
    id: string;
    url: string;
    isCover: boolean;
    file?: File;
}

export function CreateDestination() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        district: '',
        description: '',
        best_time_to_visit: '',
        google_map_url: '',
        how_to_reach: '',
        is_featured: false,
        is_active: true
    });

    const [images, setImages] = useState<DestinationImage[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages: DestinationImage[] = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                url: URL.createObjectURL(file), // Create local preview URL
                isCover: images.length === 0, // First image is default cover
                file: file
            }));

            // If we already have images, just append the new ones
            if (images.length > 0) {
                newImages.forEach(img => img.isCover = false);
            }

            setImages([...images, ...newImages]);
        }
    };

    const handleRemoveImage = (id: string) => {
        const newImages = images.filter(img => img.id !== id);

        // If we removed the cover image, make the first available image the new cover
        if (images.find(img => img.id === id)?.isCover && newImages.length > 0) {
            newImages[0].isCover = true;
        }

        setImages(newImages);
    };

    const handleSetCover = (id: string) => {
        setImages(images.map(img => ({
            ...img,
            isCover: img.id === id
        })));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newDestination = {
            id: `d${Date.now()}`,
            ...formData,
            google_map_url: formData.google_map_url,
            // Mapping images to match expected structure if needed, or keeping simplified for now
            // The schema has a separate table, but for the mock object we'll store basic info
            cover_image: images.find(img => img.isCover)?.url || images[0]?.url,
            images: images.map(img => img.url),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        mockDestinations.push(newDestination as any);
        console.log('Created Destination:', newDestination);

        navigate('/destinations');
    };

    return (
        <div className="max-w-full mx-auto space-y-6 animate-in fade-in duration-500">
            <button onClick={() => navigate('/destinations')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
            </button>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Add New Destination</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                {/* Basic Info */}
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

                {/* Location & Time */}
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
                            <option value="North Tripura">North Tripura</option>
                            <option value="South Tripura">South Tripura</option>
                            <option value="Khowai">Khowai</option>
                            <option value="Sepahijala">Sepahijala</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Best Time to Visit</label>
                        <input
                            type="text"
                            placeholder="e.g. Oct - Mar"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.best_time_to_visit}
                            onChange={e => setFormData({ ...formData, best_time_to_visit: e.target.value })}
                        />
                    </div>
                </div>

                {/* Coordinates */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Google Map URL</label>
                    <input
                        type="url"
                        placeholder="e.g. https://maps.google.com/..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.google_map_url}
                        onChange={e => setFormData({ ...formData, google_map_url: e.target.value })}
                    />
                </div>

                {/* Descriptions */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        rows={3}
                        placeholder="Describe the beauty and history of this place..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">How to Reach</label>
                    <textarea
                        rows={3}
                        placeholder="Directions via air, rail, and road..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={formData.how_to_reach}
                        onChange={e => setFormData({ ...formData, how_to_reach: e.target.value })}
                    />
                </div>

                {/* Settings Toggles */}
                <div className="flex space-x-8 py-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            checked={formData.is_featured}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-slate-700">Featured Destination</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            checked={formData.is_active}
                            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-slate-700">Active</span>
                    </label>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="text-sm font-medium text-slate-700">Destination Images</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                    />

                    <div
                        onClick={triggerFileInput}
                        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                    >
                        <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Click to upload images</p>
                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((img) => (
                                <div key={img.id} className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${img.isCover ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <img src={img.url} alt="Destination" className="w-full h-full object-cover" />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(img.id); }}
                                                className="p-1.5 bg-white/90 text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                                title="Remove Image"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleSetCover(img.id); }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${img.isCover ? 'bg-blue-600 text-white' : 'bg-white/90 text-slate-700 hover:bg-blue-50'}`}
                                            >
                                                <Star className={`h-3 w-3 ${img.isCover ? 'fill-current' : ''}`} />
                                                {img.isCover ? 'Cover Image' : 'Set as Cover'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cover Badge */}
                                    {img.isCover && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase rounded shadow-sm flex items-center gap-1">
                                            <Star className="h-2 w-2 fill-current" /> Cover
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save Destination
                    </button>
                </div>
            </form>
        </div>
    );
}
