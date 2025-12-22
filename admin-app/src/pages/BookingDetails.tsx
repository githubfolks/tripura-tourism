import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Mail, Phone, CreditCard, CheckCircle, Package } from 'lucide-react';
import { mockBookings } from '../lib/mockData';
import { cn } from '../lib/utils';

export function BookingDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const booking = mockBookings.find(b => b.id === id);

    if (!booking) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-slate-800">Booking not found</h2>
                <button onClick={() => navigate('/bookings')} className="text-blue-600 hover:underline mt-2">
                    Back to Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto space-y-6">
            <button
                onClick={() => navigate('/bookings')}
                className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Booking #{booking.booking_reference}</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Booked on {new Date(booking.booked_at).toLocaleString()} via {booking.source}
                    </p>
                </div>
                <div className="flex gap-3">
                    {booking.booking_status === 'PENDING' && (
                        <>
                            <button className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors">
                                Reject
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                                Approve Booking
                            </button>
                        </>
                    )}
                    {booking.booking_status === 'CONFIRMED' && (
                        <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                            Download Invoice
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-blue-600" />
                            Package Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <div className="font-semibold text-slate-900 text-lg">{booking.package_name}</div>
                                    <div className="text-slate-500 text-sm">Review itinerary for inclusions</div>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold",
                                        booking.booking_status === 'CONFIRMED' ? "bg-green-100 text-green-700" :
                                            booking.booking_status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                                                "bg-slate-100 text-slate-700"
                                    )}>
                                        {booking.booking_status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Check In</div>
                                    <div className="flex items-center text-slate-900 font-medium">
                                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                                        {new Date(booking.travel_start_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Check Out</div>
                                    <div className="flex items-center text-slate-900 font-medium">
                                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                                        {new Date(booking.travel_end_date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-slate-500">Guests</div>
                                    <div className="font-medium">{booking.pax_adults} Adults, {booking.pax_children} Children</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Duration</div>
                                    <div className="font-medium">3 Days, 2 Nights</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                            Payment Information
                        </h3>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                            <div>
                                <div className="text-sm text-slate-500">Total Amount</div>
                                <div className="text-2xl font-bold text-slate-900">
                                    {booking.currency} {booking.total_amount.toLocaleString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-500">Payment Status</div>
                                <div className="text-green-600 font-bold flex items-center justify-end">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    PAID
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Customer Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <User className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                                <div>
                                    <div className="font-medium text-slate-900">{booking.customer_name}</div>
                                    <div className="text-xs text-slate-500">Primary Guest</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 text-slate-400 mr-3" />
                                <a href={`mailto:${booking.customer_email}`} className="text-sm text-blue-600 hover:underline">
                                    {booking.customer_email}
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-5 w-5 text-slate-400 mr-3" />
                                <span className="text-sm text-slate-700">{booking.customer_phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                                </div>
                                <div className="pb-4">
                                    <div className="text-sm font-medium text-slate-900">Booking Created</div>
                                    <div className="text-xs text-slate-500">{new Date(booking.booked_at).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">Payment Confirmed</div>
                                    <div className="text-xs text-slate-500">{new Date(booking.booked_at).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
