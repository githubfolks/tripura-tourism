import { Search, Filter, Calendar, CreditCard, ChevronDown, CheckCircle, XCircle, Plus, Edit, Eye, LogIn, LogOut, Save, X } from 'lucide-react';
import { mockBookings } from '../lib/mockData';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Bookings() {
    const [filter, setFilter] = useState('ALL');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [additionalRevenue, setAdditionalRevenue] = useState<number | ''>('');
    const [bookings, setBookings] = useState(mockBookings); // Use local state to simulate updates
    const { isPartner } = useAuth();
    const navigate = useNavigate();

    // Filter bookings: if user is partner, show only their bookings (where source matches or partner_id matches - simulation)
    // For demo: if Partner, show bookings with source='MAKEMYTRIP'
    const availableBookings = isPartner
        ? bookings.filter(b => b.source === 'MAKEMYTRIP')
        : bookings;

    const filtered = (filter === 'ALL'
        ? availableBookings
        : availableBookings.filter(b => b.booking_status === filter)
    ).sort((a, b) => new Date(b.booked_at).getTime() - new Date(a.booked_at).getTime());

    const handleCheckIn = (id: string) => {
        setBookings(prev => prev.map(b =>
            b.id === id ? { ...b, booking_status: 'CHECKED_IN' } : b
        ));
    };

    const initiationCheckOut = (id: string) => {
        setSelectedBookingId(id);
        setAdditionalRevenue('');
        setShowCheckoutModal(true);
    };

    const handleCheckOut = () => {
        if (!selectedBookingId) return;
        setBookings(prev => prev.map(b =>
            b.id === selectedBookingId ? {
                ...b,
                booking_status: 'CHECKED_OUT',
                additional_revenue: Number(additionalRevenue) || 0
            } : b
        ));
        setShowCheckoutModal(false);
        setSelectedBookingId(null);
    };

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
                        {['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].map((status) => (
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
                                        {(booking.total_amount - (booking.amount_paid || 0)) > 0 && (
                                            <div className="text-xs text-red-600 font-medium">
                                                Pending: ₹{(booking.total_amount - (booking.amount_paid || 0)).toLocaleString()}
                                            </div>
                                        )}
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
                                            {booking.booking_status === 'CHECKED_IN' && <LogIn className="h-3 w-3 mr-1" />}
                                            {booking.booking_status === 'CHECKED_OUT' && <LogOut className="h-3 w-3 mr-1" />}
                                            {booking.booking_status === 'CANCELLED' && <XCircle className="h-3 w-3 mr-1" />}
                                            {booking.booking_status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        {booking.booking_status === 'CONFIRMED' && (
                                            <button
                                                onClick={() => handleCheckIn(booking.id)}
                                                className="text-slate-400 hover:text-green-600 transition-colors"
                                                title="Check In"
                                            >
                                                <LogIn className="h-4 w-4" />
                                            </button>
                                        )}
                                        {booking.booking_status === 'CHECKED_IN' && (
                                            <button
                                                onClick={() => initiationCheckOut(booking.id)}
                                                className="text-slate-400 hover:text-orange-600 transition-colors"
                                                title="Check Out"
                                            >
                                                <LogOut className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate(`/bookings/${booking.id}`)}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Edit Booking"
                                        >
                                            <Edit className="h-4 w-4" />
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


            {/* Check-out Modal */}
            {
                showCheckoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-900">Confirm Check-out</h2>
                                <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Revenue Generated (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={additionalRevenue}
                                    onChange={(e) => setAdditionalRevenue(e.target.value ? Number(e.target.value) : '')}
                                    placeholder="e.g. 500"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Enter 0 if no extra services were used.</p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckOut}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Complete Check-out
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
