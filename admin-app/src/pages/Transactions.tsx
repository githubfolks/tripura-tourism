import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import { mockBookings } from '../lib/mockData';

export function Transactions() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filteredBookings = mockBookings
        .filter(booking => {
            const matchSearch = booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === 'ALL' || booking.booking_status === filterStatus;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => new Date(b.booked_at).getTime() - new Date(a.booked_at).getTime());

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
                    <p className="text-slate-500 text-sm">View all booking transactions and settlements.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                            >
                                <option value="ALL">All Status</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PENDING">Pending</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{booking.booking_reference}</td>
                                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{new Date(booking.booked_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${booking.source === 'PORTAL' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                booking.source === 'PARTNER' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                    'bg-slate-50 text-slate-700 border-slate-200'
                                            }`}>
                                            {booking.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{booking.customer_name}</td>
                                    <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{booking.package_name || 'N/A'}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">₹{booking.total_amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.booking_status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                            booking.booking_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {booking.booking_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/bookings/${booking.id}`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-end gap-1"
                                        >
                                            <Eye className="h-4 w-4" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredBookings.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No transactions found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
