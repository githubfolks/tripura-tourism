import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function DashboardLayout() {
    const { user } = useAuth();

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <div className="flex items-center flex-1 max-w-xl">
                        <div className="flex items-center flex-1 max-w-xl">
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-4">
                        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-700">{user?.full_name || 'User'}</p>
                                <p className="text-xs text-slate-500">{user?.user_type === 'PORTAL_ADMIN' ? 'Super Admin' : user?.user_type?.replace('_', ' ')}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {user?.full_name?.[0] || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <Outlet />
                </main>

                <footer className="bg-slate-700 border-t border-slate-800 py-4 px-8 z-10 shrink-0">
                    <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
                        <p>© 2024 Tripura Tourism. All rights reserved.</p>
                        <div className="flex space-x-6 mt-2 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
