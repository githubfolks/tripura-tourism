import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';

export function CreateUser() {
    const navigate = useNavigate();

    return (
        <div className="max-w-full mx-auto space-y-6">
            <button onClick={() => navigate('/users')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
            </button>

            <h1 className="text-2xl font-bold text-slate-800">Add New User</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="PORTAL_STAFF">Staff</option>
                            <option value="PORTAL_ADMIN">Admin</option>
                            <option value="PARTNER_ADMIN">Partner Admin</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Temporary Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="flex justify-end pt-4">
                    <button className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create User
                    </button>
                </div>
            </div>
        </div>
    );
}
