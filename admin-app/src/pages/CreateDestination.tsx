import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Star, Plus, Trash2 } from 'lucide-react';
import { destinationsService } from '../lib/destinations';
import { storageService } from '../lib/storage';
import { accommodationsService, type AccommodationCreate } from '../lib/accommodations';
import { cn } from '../lib/utils';

interface DestinationImage {
    id: string;
    url: string;
    isCover: boolean;
    file?: File;
    status: 'pending' | 'uploading' | 'success' | 'error';
    serverUrl?: string; // The URL returned by the server
}

export function CreateDestination() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        district: '',
        description: '',
        best_time_to_visit: '',
        latitude: '',
        longitude: '',
        how_to_reach: '',
        is_featured: false,
        is_active: true
    });

    const [images, setImages] = useState<DestinationImage[]>([]);
    // Accommodations can have an ID if they exist on server
    const [accommodations, setAccommodations] = useState<Partial<AccommodationCreate & { id?: string }>[]>([]);
    const [deletedAccommodationIds, setDeletedAccommodationIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const [dest, accs] = await Promise.all([
                        destinationsService.getById(id),
                        accommodationsService.getAll(id)
                    ]);

                    setFormData({
                        name: dest.name,
                        slug: dest.slug,
                        district: dest.district || '',
                        description: dest.description || '',
                        best_time_to_visit: dest.best_time_to_visit || '',
                        latitude: dest.latitude?.toString() || '',
                        longitude: dest.longitude?.toString() || '',
                        how_to_reach: dest.how_to_reach || '',
                        is_featured: dest.is_featured,
                        is_active: dest.is_active
                    });

                    if (dest.images) {
                        const existingImages: DestinationImage[] = dest.images.map(img => ({
                            id: img.id,
                            url: img.image_url.startsWith('http') ? img.image_url : `http://localhost:8002${img.image_url}`, // Quick fix for full URL, ideally use helper
                            // Note: We might need a helper that handles the base URL logic consistently
                            serverUrl: img.image_url,
                            isCover: dest.cover_image_url === img.image_url,
                            status: 'success'
                        }));
                        setImages(existingImages);
                    }

                    if (accs) {
                        setAccommodations(accs.map(a => ({
                            id: a.id,
                            name: a.name,
                            type: a.type,
                            base_price: a.base_price,
                            base_occupancy: a.base_occupancy,
                            extra_boarder_price: a.extra_boarder_price,
                            destination_id: a.destination_id
                        })));
                    }
                } catch (error) {
                    console.error("Failed to fetch destination details", error);
                    alert("Failed to load destination details.");
                    navigate('/destinations');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [isEditMode, id, navigate]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages: DestinationImage[] = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                url: URL.createObjectURL(file), // Local preview
                isCover: images.length === 0,
                file: file,
                status: 'pending'
            }));

            // Append for UI immediately
            setImages(prev => {
                const updated = [...prev, ...newImages];
                if (prev.length > 0) newImages.forEach(i => i.isCover = false);
                return updated;
            });

            // Trigger uploads
            for (const img of newImages) {
                if (!img.file) continue;

                try {
                    setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'uploading' } : p));
                    const { url } = await storageService.upload(img.file);

                    setImages(prev => prev.map(p =>
                        p.id === img.id ? { ...p, status: 'success', serverUrl: url } : p
                    ));
                } catch (error) {
                    console.error("Upload failed", error);
                    setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'error' } : p));
                }
            }
        }
    };

    const handleRemoveImage = (id: string) => {
        const newImages = images.filter(img => img.id !== id);
        if (images.find(img => img.id === id)?.isCover && newImages.length > 0) {
            newImages[0].isCover = true;
        }
        setImages(newImages);
    };

    const handleSetCover = (id: string) => {
        setImages(images.map(img => ({ ...img, isCover: img.id === id })));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Accommodation Handlers
    const addAccommodation = () => {
        setAccommodations([...accommodations, {
            name: '',
            base_price: 0,
            base_occupancy: 2,
            extra_boarder_price: 0,
            type: 'Room'
        }]);
    };

    const removeAccommodation = (index: number) => {
        const acc = accommodations[index];
        if (acc.id) {
            setDeletedAccommodationIds([...deletedAccommodationIds, acc.id]);
        }
        setAccommodations(accommodations.filter((_, i) => i !== index));
    };

    const updateAccommodation = (index: number, field: keyof AccommodationCreate, value: any) => {
        const updated = [...accommodations];
        updated[index] = { ...updated[index], [field]: value };
        setAccommodations(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Check for pending uploads
            if (images.some(img => img.status === 'uploading')) {
                alert("Please wait for all images to finish uploading.");
                setIsSubmitting(false);
                return;
            }

            const destinationImages = images.map(img => ({
                image_url: img.serverUrl || '',
                caption: '',
                sort_order: 0
            })).filter(img => img.image_url);

            const coverImage = images.find(img => img.isCover)?.serverUrl || destinationImages[0]?.image_url;

            const payload = {
                ...formData,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                cover_image_url: coverImage,
                images: destinationImages as any
            };

            let destinationId = id;

            if (isEditMode && id) {
                await destinationsService.update(id, payload);
                console.log('Updated Destination:', id);
            } else {
                const newDestination = await destinationsService.create(payload);
                destinationId = newDestination.id;
                console.log('Created Destination:', newDestination);
            }

            if (destinationId) {
                // Handle Accommodations
                // 1. Delete removed ones
                for (const deletedId of deletedAccommodationIds) {
                    await accommodationsService.delete(deletedId);
                }

                // 2. Create or Update existing ones
                for (const acc of accommodations) {
                    if (acc.name && acc.base_price) {
                        try {
                            const accData = {
                                ...acc,
                                destination_id: destinationId,
                                base_occupancy: Number(acc.base_occupancy),
                                base_price: Number(acc.base_price),
                                extra_boarder_price: Number(acc.extra_boarder_price || 0),
                                name: acc.name!,
                                type: acc.type || 'Room'
                            } as AccommodationCreate;

                            if (acc.id) {
                                await accommodationsService.update(acc.id, accData);
                            } else {
                                await accommodationsService.create(accData);
                            }
                        } catch (err) {
                            console.error("Failed to save accommodation", acc.name, err);
                        }
                    }
                }
            }

            navigate('/destinations');
        } catch (error) {
            console.error("Failed to save destination", error);
            alert("Failed to save destination. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData({ ...formData, name, slug });
    };

    return (
        <div className="max-w-full mx-auto space-y-6 animate-in fade-in duration-500">
            <button onClick={() => navigate('/destinations')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Destinations
            </button>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Destination' : 'Add New Destination'}</h1>
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
                            onChange={handleNameChange}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            placeholder="e.g. 24.2345"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.latitude}
                            onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            placeholder="e.g. 91.9876"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.longitude}
                            onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                        />
                    </div>
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

                {/* Accommodation Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">Accommodations</label>
                        <button
                            type="button"
                            onClick={addAccommodation}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add Unit
                        </button>
                    </div>

                    {accommodations.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No accommodations added yet.</p>
                    )}

                    <div className="space-y-3">
                        {accommodations.map((acc, index) => (
                            <div key={index} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
                                    <input
                                        type="text"
                                        placeholder="Name (e.g. Deluxe Room)"
                                        className="px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 w-full"
                                        value={acc.name}
                                        onChange={(e) => updateAccommodation(index, 'name', e.target.value)}
                                    />
                                    <select
                                        className="px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 w-full"
                                        value={acc.type}
                                        onChange={(e) => updateAccommodation(index, 'type', e.target.value)}
                                    >
                                        <option value="Room">Room</option>
                                        <option value="Cottage">Cottage</option>
                                        <option value="Tent">Tent</option>
                                        <option value="Dormitory">Dormitory</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Base Price"
                                        className="px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 w-full"
                                        value={acc.base_price}
                                        onChange={(e) => updateAccommodation(index, 'base_price', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Occupancy"
                                        className="px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 w-full"
                                        value={acc.base_occupancy}
                                        onChange={(e) => updateAccommodation(index, 'base_occupancy', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Extra Boarder Price"
                                        className="px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 w-full"
                                        value={acc.extra_boarder_price}
                                        onChange={(e) => updateAccommodation(index, 'extra_boarder_price', e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeAccommodation(index)}
                                    className="text-slate-400 hover:text-red-500 p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
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

                                    {/* Status Badge */}
                                    {img.status === 'uploading' && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    {img.status === 'error' && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">Error</div>
                                    )}

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
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm",
                            isSubmitting && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Destination' : 'Save Destination')}
                    </button>
                </div>
            </form>
        </div>
    );
}
