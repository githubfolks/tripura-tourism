import { Search, Filter, Calendar, CreditCard, ChevronDown, CheckCircle, XCircle, Plus } from 'lucide-react';
import { mockBookings } from '../lib/mockData';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Bookings() {
    const [filter, setFilter] = useState('ALL');
    const { isPartner } = useAuth();
    const navigate = useNavigate();

    // Filter bookings: if user is partner, show only their bookings (where source matches or partner_id matches - simulation)
    // For demo: if Partner, show bookings with source='MAKEMYTRIP'
    const availableBookings = isPartner
        ? mockBookings.filter(b => b.source === 'MAKEMYTRIP')
        : mockBookings;

    const filtered = filter === 'ALL'
        ? availableBookings
        : availableBookings.filter(b => b.booking_status === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
                    <p className="text-slate-500 mt-1">{isPartner ? 'Manage your portal bookings.' : 'Track and manage all bookings.'}</p>
                </div>
                {!isPartner && (
                    <button
                        onClick={() => navigate('/bookings/new')}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Booking
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-1 gap-2 w-full">
                        <div className="relative flex-1 max-w-sm">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-slate-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search bookings by ID, Name or Email"
                                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                            />
                        </div>
                        <div className="relative">
                            <button className="flex items-center px-4 py-2 text-sm text-slate-700 font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                                <Filter className="h-4 w-4 mr-2 text-slate-500" />
                                {filter === 'ALL' ? 'All Status' : filter}
                                <ChevronDown className="h-4 w-4 ml-2 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                                    filter === status
                                        ? "bg-slate-800 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Booking info</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Travel Date</th>
                                <th className="px-6 py-3">Payment</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((booking) => (
                                <tr key={booking.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{booking.booking_reference}</div>
                                        <div className="text-xs text-slate-500">{booking.package_name}</div>
                                        <div className="text-xs text-slate-400 mt-1">Booked: {new Date(booking.booked_at).toLocaleDateString()}</div>
                                        {!isPartner && (
                                            <div className="text-xs text-blue-600 mt-1 font-mono">{booking.source}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900 font-medium">{booking.customer_name}</div>
                                        <div className="text-xs text-slate-500">{booking.customer_email}</div>
                                        <div className="text-xs text-slate-500">{booking.pax_adults} Adults, {booking.pax_children} Kids</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-slate-700">
                                            <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                                            {new Date(booking.travel_start_date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-400 pl-4">To {new Date(booking.travel_end_date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">₹{booking.total_amount.toLocaleString()}</div>
                                        <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                            <CreditCard className="h-3 w-3 mr-1" /> Paid via Gateway
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center",
                                            booking.booking_status === 'CONFIRMED' ? "bg-green-100 text-green-800" :
                                                booking.booking_status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                                                    booking.booking_status === 'CANCELLED' ? "bg-red-100 text-red-800" :
                                                        "bg-slate-100 text-slate-800"
                                        )}>
                                            {booking.booking_status === 'CONFIRMED' && <CheckCircle className="h-3 w-3 mr-1" />}
                                            {booking.booking_status === 'CANCELLED' && <XCircle className="h-3 w-3 mr-1" />}
                                            {booking.booking_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/bookings/${booking.id}`)}
                                            className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No bookings found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
