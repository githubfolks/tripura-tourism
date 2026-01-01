import { LayoutDashboard, Users, MapPin, Package, CalendarCheck, Settings, LogOut, Shield, Globe, Lock, Key, Activity, Coffee, ChevronDown, ChevronRight, DollarSign } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';


const systemLinks = [
    { name: 'Roles', href: '/system/roles', icon: Shield },
    { name: 'Permissions', href: '/system/permissions', icon: Key },
    { name: 'Access Matrix', href: '/system/role-permissions', icon: Lock },
    { name: 'Activity Logs', href: '/system/logs', icon: Activity },
    { name: 'Amenities', href: '/system/amenities', icon: Coffee },
];

const partnerLinks = [
    { name: 'Partners', href: '/partners', icon: Globe, end: true },
    { name: 'Credentials', href: '/partners/credentials', icon: Key },
    { name: 'Access Logs', href: '/partners/logs', icon: Activity },
];

export function Sidebar() {
    const [isPartnersOpen, setIsPartnersOpen] = useState(true);
    const [isSystemOpen, setIsSystemOpen] = useState(true);
    const { isAdmin, isPartner, isAssetManager, logout } = useAuth();

    return (
        <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen border-r border-slate-800">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    Tripura Admin
                </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto sidebar-scrollbar">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        cn(
                            'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )
                    }
                >
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/bookings"
                    className={({ isActive }) =>
                        cn(
                            'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )
                    }
                >
                    <CalendarCheck className="h-5 w-5 mr-3" />
                    Bookings
                </NavLink>

                {(isPartner || isAssetManager) && (
                    <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                            cn(
                                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            )
                        }
                    >
                        <DollarSign className="h-5 w-5 mr-3" />
                        Transactions
                    </NavLink>
                )}

                {isAdmin && (
                    <>
                        <NavLink
                            to="/users"
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )
                            }
                        >
                            <Users className="h-5 w-5 mr-3" />
                            Users
                        </NavLink>
                        <NavLink
                            to="/destinations"
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )
                            }
                        >
                            <MapPin className="h-5 w-5 mr-3" />
                            Destinations
                        </NavLink>
                        <NavLink
                            to="/packages"
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )
                            }
                        >
                            <Package className="h-5 w-5 mr-3" />
                            Packages
                        </NavLink>

                        {/* Partners Group */}
                        <div>
                            <button
                                onClick={() => setIsPartnersOpen(!isPartnersOpen)}
                                className="w-full flex items-center justify-between pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                            >
                                <span>Partners</span>
                                {isPartnersOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </button>

                            {isPartnersOpen && (
                                <div className="space-y-1">
                                    {partnerLinks.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.href}
                                            end={item.end}
                                            className={({ isActive }) =>
                                                cn(
                                                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                                    isActive
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                )
                                            }
                                        >
                                            <item.icon className="h-4 w-4 mr-3" />
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* System Group */}
                        <div>
                            <button
                                onClick={() => setIsSystemOpen(!isSystemOpen)}
                                className="w-full flex items-center justify-between pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                            >
                                <span>System</span>
                                {isSystemOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </button>

                            {isSystemOpen && (
                                <div className="space-y-1">
                                    {systemLinks.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.href}
                                            className={({ isActive }) =>
                                                cn(
                                                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                                    isActive
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                )
                                            }
                                        >
                                            <item.icon className="h-4 w-4 mr-3" />
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                </button>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2 mt-1 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/20 hover:text-red-300 transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}
