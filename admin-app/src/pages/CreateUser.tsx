import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, MapPin, Compass, Package } from 'lucide-react';
import { mockDestinations, mockExperiences, mockPackages } from '../lib/mockData';

export function CreateUser() {
    const navigate = useNavigate();

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('PORTAL_STAFF');

    // Asset Manager Assignments
    const [assignedDestinations, setAssignedDestinations] = useState<string[]>([]);
    const [assignedExperiences, setAssignedExperiences] = useState<string[]>([]);
    const [assignedPackages, setAssignedPackages] = useState<string[]>([]);

    const toggleAssignment = (id: string, currentList: string[], setter: (list: string[]) => void) => {
        if (currentList.includes(id)) {
            setter(currentList.filter(item => item !== id));
        } else {
            setter([...currentList, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create mock user
        const newUser = {
            id: `u${Date.now()}`,
            full_name: fullName,
            email: email,
            user_type: role as any,
            is_active: true,
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            assigned_destinations: role === 'ASSET_MANAGER' ? assignedDestinations : undefined,
            assigned_experiences: role === 'ASSET_MANAGER' ? assignedExperiences : undefined,
            assigned_packages: role === 'ASSET_MANAGER' ? assignedPackages : undefined,
        };

        // In a real app, this would be an API call
        console.log('Creating user:', newUser);
        navigate('/users');
    };

    return (
        <div className="max-w-full mx-auto space-y-6 animate-in fade-in duration-500">
            <button onClick={() => navigate('/users')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
            </button>

            <h1 className="text-2xl font-bold text-slate-800">Add New User</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="PORTAL_STAFF">Staff</option>
                                <option value="PORTAL_ADMIN">Admin</option>
                                <option value="ASSET_MANAGER">Asset Manager</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Temporary Password</label>
                        <input type="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>

                    {/* Conditional Asset Assignment Section */}
                    {role === 'ASSET_MANAGER' && (
                        <div className="pt-6 border-t border-slate-200 space-y-6">
                            <h3 className="text-lg font-semibold text-slate-800">Assign Assets</h3>
                            <p className="text-sm text-slate-500 -mt-4">Select the valid assets that this manager can access and manage.</p>

                            {/* Destinations */}
                            <div className="space-y-3">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                                    Destinations
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {mockDestinations.map(dest => (
                                        <label key={dest.id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${assignedDestinations.includes(dest.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                            <input
                                                type="checkbox"
                                                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                                                checked={assignedDestinations.includes(dest.id)}
                                                onChange={() => toggleAssignment(dest.id, assignedDestinations, setAssignedDestinations)}
                                            />
                                            <div className="ml-3">
                                                <span className="block text-sm font-medium text-slate-900">{dest.name}</span>
                                                <span className="block text-xs text-slate-500">{dest.district}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Experiences */}
                            <div className="space-y-3">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <Compass className="h-4 w-4 mr-2 text-green-600" />
                                    Experiences
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {mockExperiences.map(exp => (
                                        <label key={exp.id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${assignedExperiences.includes(exp.id) ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                            <input
                                                type="checkbox"
                                                className="mt-1 rounded text-green-600 focus:ring-green-500"
                                                checked={assignedExperiences.includes(exp.id)}
                                                onChange={() => toggleAssignment(exp.id, assignedExperiences, setAssignedExperiences)}
                                            />
                                            <div className="ml-3">
                                                <span className="block text-sm font-medium text-slate-900">{exp.name}</span>
                                                <span className="block text-xs text-slate-500">{exp.duration}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Packages */}
                            <div className="space-y-3">
                                <label className="flex items-center text-sm font-medium text-slate-700">
                                    <Package className="h-4 w-4 mr-2 text-purple-600" />
                                    Packages
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {mockPackages.map(pkg => (
                                        <label key={pkg.id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${assignedPackages.includes(pkg.id) ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                            <input
                                                type="checkbox"
                                                className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                                                checked={assignedPackages.includes(pkg.id)}
                                                onChange={() => toggleAssignment(pkg.id, assignedPackages, setAssignedPackages)}
                                            />
                                            <div className="ml-3">
                                                <span className="block text-sm font-medium text-slate-900">{pkg.name}</span>
                                                <span className="block text-xs text-slate-500">₹{pkg.price_inr?.toLocaleString()}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button type="submit" className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
