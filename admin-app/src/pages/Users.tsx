import { Search, Filter, MoreVertical, UserPlus, SlidersHorizontal, UserCheck, UserX } from 'lucide-react';
import { mockUsers } from '../lib/mockData';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Users() {
    const [filterType, setFilterType] = useState('ALL');
    const navigate = useNavigate();

    const filteredUsers = filterType === 'ALL'
        ? mockUsers
        : mockUsers.filter(u => u.user_type === filterType);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage portal admins, staff, and partners.</p>
                </div>
                <button
                    onClick={() => navigate('/users/new')}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-72">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                        />
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <button className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </button>
                        <button className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Sort
                        </button>
                    </div>
                </div>

                <div className="flex px-4 border-b border-slate-200 overflow-x-auto">
                    {['ALL', 'PORTAL_ADMIN', 'PORTAL_STAFF', 'ASSET_MANAGER'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={cn(
                                "px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap",
                                filterType === type
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            )}
                        >
                            {type === 'ALL' ? 'All Users' : type.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold mr-3">
                                                {user.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{user.full_name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {user.user_type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {user.is_verified ? (
                                                <span className="flex items-center text-green-600 text-xs font-medium">
                                                    <UserCheck className="h-3 w-3 mr-1" /> Verified
                                                </span>
                                            ) : (
                                                <span className="italic text-slate-400 text-xs">Unverified</span>
                                            )}
                                            <span className="text-slate-300">|</span>
                                            <span className={cn(
                                                "text-xs font-medium",
                                                user.is_active ? "text-slate-700" : "text-red-500"
                                            )}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <UserX className="h-8 w-8 text-slate-300 mb-2" />
                                            <p>No users found matching filter.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
