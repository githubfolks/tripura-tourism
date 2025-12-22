import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserType } from '../types/schema';
import { LayoutDashboard, Globe, Lock, ArrowRight } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserType>('PORTAL_ADMIN');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, role);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 text-center bg-gradient-to-r from-blue-600 to-teal-500">
                    <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 text-white">
                        {role.includes('PARTNER') ? <Globe className="h-8 w-8" /> : <LayoutDashboard className="h-8 w-8" />}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-blue-100">Sign in to {role.includes('PARTNER') ? 'Partner Portal' : 'Admin Dashboard'}</p>
                </div>

                <div className="p-8">
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-8">
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!role.includes('PARTNER') ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setRole('PORTAL_ADMIN')}
                        >
                            Admin
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role.includes('PARTNER') ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setRole('PARTNER_ADMIN')}
                        >
                            Partner
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800"
                                    placeholder={role.includes('PARTNER') ? "partner@mmt.com" : "admin@tripura.gov.in"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                            {isLoading ? 'Signing in...' : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        <p>Use any email/password to demo.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
