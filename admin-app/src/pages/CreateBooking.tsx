import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, User as UserIcon, CreditCard, Save, Upload } from 'lucide-react';
import { useEffect } from 'react';
import { mockPackages, mockAccommodations, mockBookings, mockExperiences, mockDestinations } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import type { PaymentStatus } from '../types/schema';

export function CreateBooking() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [bookingType, setBookingType] = useState<'PACKAGE' | 'EXPERIENCE' | 'ACCOMMODATION'>('ACCOMMODATION');
    const [selectedDestinationId, setSelectedDestinationId] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [unitCount, setUnitCount] = useState(1);

    // Guest Details
    const [leadGuest, setLeadGuest] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [idType, setIdType] = useState('AADHAR');
    const [idFile, setIdFile] = useState<File | null>(null);

    // Payment Details
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING');
    const [partialAmount, setPartialAmount] = useState<number | ''>('');

    // Calculate Pricing
    const pricing = useMemo(() => {
        let item;
        if (bookingType === 'PACKAGE') item = mockPackages.find(p => p.id === selectedItemId);
        else if (bookingType === 'EXPERIENCE') item = mockExperiences.find(e => e.id === selectedItemId);
        else item = mockAccommodations.find(a => a.id === selectedItemId);

        if (!item) return { total: 0, breakdown: [] };

        const price = (item as any).base_price || (item as any).price_inr || 0;
        let total = 0;
        const breakdown = [];

        if (bookingType === 'ACCOMMODATION') {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

            total = price * days * unitCount;
            breakdown.push({ label: 'Base Rate', value: price });
            breakdown.push({ label: 'Nights', value: days });
            breakdown.push({ label: 'Units', value: unitCount });

            // Extra Boarder Logic
            const extraBoarderPrice = (item as any).extra_boarder_price || 0;
            const extraBoarders = Math.max(0, adults - (unitCount * 2)); // Assuming 2 adults per unit base

            if (extraBoarders > 0 && extraBoarderPrice > 0) {
                const extraCost = extraBoarders * extraBoarderPrice * days;
                total += extraCost;
                breakdown.push({ label: 'Extra Boarders', value: extraBoarders });
                breakdown.push({ label: 'Extra Boarder Rate', value: extraBoarderPrice });
                breakdown.push({ label: 'Extra Boarder Cost', value: extraCost });
            }
        } else {
            // Package & Experience Pricing (Per person)
            // Assuming Experience also follows simple per-person or fixed logic.
            // For now, treating Experience same as Package: Adults full price, Kids 50%
            total = price * adults + (price * 0.5 * children);
            breakdown.push({ label: 'Adult Price', value: price });
            breakdown.push({ label: 'Adults', value: adults });
            breakdown.push({ label: 'Children Price', value: price * 0.5 });
            breakdown.push({ label: 'Children', value: children });
        }

        return { total, breakdown };
    }, [bookingType, selectedItemId, checkIn, checkOut, unitCount, adults, children]);

    // Load booking data if editing
    useEffect(() => {
        if (isEditMode && id) {
            const booking = mockBookings.find(b => b.id === id);
            if (booking) {
                // Determine type based on available fields (simplified logic)
                // Since mock data isn't perfect, we'll infer.
                if (booking.package_id) {
                    setBookingType('PACKAGE');
                    setSelectedItemId(booking.package_id);
                } else if (booking.experience_id) { // Assuming type has this field or we inferred it
                    setBookingType('EXPERIENCE');
                    setSelectedItemId(booking.experience_id);
                } else {
                    setBookingType('ACCOMMODATION');
                    // We don't have accommodation_id in Booking interface explicitly in schema? 
                    // Let's assume for now we can't fully restore ACCOMMODATION specifics without it.
                    // But for demo, we might find it if we added it to schema or just ignore.
                }

                setCheckIn(booking.travel_start_date.split('T')[0]);
                setCheckOut(booking.travel_end_date.split('T')[0]);
                setAdults(booking.pax_adults);
                setChildren(booking.pax_children);
                setLeadGuest(booking.customer_name);
                setEmail(booking.customer_email || '');
                setPhone(booking.customer_phone || '');
                if (booking.customer_id_type) setIdType(booking.customer_id_type);
                // Load payment status (prefer explicit field, fallback to amount inferrence for old data)
                if (booking.payment_status) {
                    setPaymentStatus(booking.payment_status);
                    if (booking.payment_status === 'PARTIAL' && booking.amount_paid) {
                        setPartialAmount(booking.amount_paid);
                    }
                } else {
                    // Fallback inferrence
                    if (booking.amount_paid && booking.amount_paid < booking.total_amount && booking.amount_paid > 0) {
                        setPaymentStatus('PARTIAL');
                        setPartialAmount(booking.amount_paid);
                    } else if (booking.amount_paid === booking.total_amount) {
                        setPaymentStatus('PAID');
                    }
                }
            }
        }
    }, [isEditMode, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        let selectedItem;
        if (bookingType === 'PACKAGE') selectedItem = mockPackages.find(p => p.id === selectedItemId);
        else if (bookingType === 'EXPERIENCE') selectedItem = mockExperiences.find(e => e.id === selectedItemId);
        else selectedItem = mockAccommodations.find(a => a.id === selectedItemId);

        const bookingData = {
            id: isEditMode ? id! : `b${Date.now()}`,
            booking_reference: isEditMode ? mockBookings.find(b => b.id === id)?.booking_reference || `TRP-${Date.now()}` : `TRP-2025-${Math.floor(Math.random() * 1000)}`,
            source: 'WALK_IN',
            partner_id: null,
            package_id: bookingType === 'PACKAGE' ? selectedItemId : undefined,
            experience_id: bookingType === 'EXPERIENCE' ? selectedItemId : undefined,
            package_name: selectedItem?.name,
            booking_status: 'CONFIRMED' as const,
            travel_start_date: checkIn,
            travel_end_date: checkOut || checkIn, // Experience might be single day
            pax_adults: adults,
            pax_children: children,
            total_amount: pricing.total,
            amount_paid: paymentStatus === 'PARTIAL' ? Number(partialAmount) : (paymentStatus === 'PAID' ? pricing.total : 0),
            payment_status: paymentStatus,
            currency: 'INR',
            booked_at: new Date().toISOString(),
            customer_name: leadGuest,
            customer_email: email,
            customer_phone: phone,
            customer_id_type: idType,
            customer_id_proof_url: idFile ? URL.createObjectURL(idFile) : undefined,
            created_by: user?.id,
            booking_channel: 'WALK_IN'
        };

        if (isEditMode) {
            const index = mockBookings.findIndex(b => b.id === id);
            if (index !== -1) {
                mockBookings[index] = { ...mockBookings[index], ...bookingData };
            }
        } else {
            mockBookings.push(bookingData as any);
        }

        setIsLoading(false);
        navigate('/bookings');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/bookings')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="h-6 w-6 text-slate-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Booking' : 'New Booking'}</h1>
                    <p className="text-slate-500 text-sm">{isEditMode ? 'Update booking details.' : 'Create a new walk-in or offline booking.'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="lg:col-span-2">
                    <form id="booking-form" onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                        {/* 1. Item Selection */}
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                Booking Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Booking Type</label>
                                    <div className="flex gap-4 p-1 bg-slate-50 rounded-lg border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setBookingType('ACCOMMODATION')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${bookingType === 'ACCOMMODATION' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            Destination
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBookingType('EXPERIENCE')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${bookingType === 'EXPERIENCE' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            Experience
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setBookingType('PACKAGE')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${bookingType === 'PACKAGE' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
                                        >
                                            Package
                                        </button>
                                    </div>
                                </div>

                                {bookingType === 'ACCOMMODATION' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Destination</label>
                                        <select
                                            required
                                            value={selectedDestinationId}
                                            onChange={(e) => {
                                                setSelectedDestinationId(e.target.value);
                                                setSelectedItemId(''); // Reset room selection
                                            }}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Destination</option>
                                            {mockDestinations
                                                .filter(d =>
                                                    // If user is Asset Manager, only show assigned destinations
                                                    !user?.assigned_destinations || user.assigned_destinations.includes(d.id)
                                                )
                                                .map(dest => (
                                                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                                                ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Select {bookingType === 'ACCOMMODATION' ? 'Room/Unit' : bookingType === 'EXPERIENCE' ? 'Activity' : 'Package'}
                                    </label>
                                    <select
                                        required
                                        value={selectedItemId}
                                        onChange={(e) => setSelectedItemId(e.target.value)}
                                        disabled={bookingType === 'ACCOMMODATION' && !selectedDestinationId}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                        <option value="">Select Option</option>
                                        {bookingType === 'ACCOMMODATION' && selectedDestinationId && mockAccommodations
                                            .filter(item => (item as any).destination_id === selectedDestinationId)
                                            .map(item => (
                                                <option key={item.id} value={item.id}>{item.name} ({item.type}) - ₹{item.base_price}</option>
                                            ))}
                                        {bookingType === 'EXPERIENCE' && mockExperiences.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} ({item.duration}) - ₹{item.price_inr}</option>
                                        ))}
                                        {bookingType === 'PACKAGE' && mockPackages.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} - ₹{item.price_inr}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        {bookingType === 'ACCOMMODATION' || bookingType === 'PACKAGE' ? 'Check-in Date' : 'Date'}
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {(bookingType === 'ACCOMMODATION' || bookingType === 'PACKAGE') && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date</label>
                                        <input
                                            type="date"
                                            required={bookingType === 'ACCOMMODATION'}
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                {bookingType === 'ACCOMMODATION' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Number of Rooms</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={unitCount}
                                            onChange={(e) => setUnitCount(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Guest Details */}
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Guest Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Lead Guest Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        value={leadGuest}
                                        onChange={(e) => setLeadGuest(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="guest@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Adults</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={adults}
                                        onChange={(e) => setAdults(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Children</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={children}
                                        onChange={(e) => setChildren(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">ID Proof Type</label>
                                    <select
                                        value={idType}
                                        onChange={(e) => setIdType(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="AADHAR">Aadhar Card</option>
                                        <option value="DRIVING_LICENSE">Driving License</option>
                                        <option value="VOTER_ID">Voter ID</option>
                                        <option value="PASSPORT">Passport</option>
                                        <option value="OTHER">Other Government ID</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload ID Proof</label>
                                    <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => e.target.files && setIdFile(e.target.files[0])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="h-6 w-6 text-slate-400" />
                                            <span className="text-sm text-slate-600">
                                                {idFile ? idFile.name : 'Click to upload or drag and drop'}
                                            </span>
                                            {!idFile && <span className="text-xs text-slate-400">JPG, PNG or PDF</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Payment Details */}
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                                Payment Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="PENDING">Pending (Pay later)</option>
                                        <option value="PAID">Paid Full</option>
                                        <option value="PARTIAL">Partial Payment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="CARD">Credit/Debit Card</option>
                                        <option value="UPI">UPI</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                    </select>
                                </div>

                                {paymentStatus === 'PARTIAL' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Partial Amount (₹)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={pricing.total}
                                            value={partialAmount}
                                            onChange={(e) => setPartialAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            placeholder="Enter amount paid"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Pricing Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Pricing Summary</h2>

                        <div className="space-y-4 mb-6">
                            {(selectedItemId && pricing.total > 0) ? (
                                <>
                                    {bookingType === 'ACCOMMODATION' && (
                                        <>
                                            <div className="flex justify-between text-sm text-slate-600">
                                                <span>Base Rate (per night)</span>
                                                <span>₹{pricing.breakdown[0].value.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-slate-600">
                                                <span>Duration</span>
                                                <span>{pricing.breakdown[1].value} nights</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-slate-600">
                                                <span>Units</span>
                                                <span>{pricing.breakdown[2].value} unit(s)</span>
                                            </div>
                                        </>
                                    )}
                                    {(bookingType === 'PACKAGE' || bookingType === 'EXPERIENCE') && (
                                        <>
                                            <div className="flex justify-between text-sm text-slate-600">
                                                <span>Adults ({pricing.breakdown[1].value})</span>
                                                <span>₹{(pricing.breakdown[0].value * pricing.breakdown[1].value).toLocaleString()}</span>
                                            </div>
                                            {children > 0 && (
                                                <div className="flex justify-between text-sm text-slate-600">
                                                    <span>Children ({pricing.breakdown[3].value})</span>
                                                    <span>₹{(pricing.breakdown[2].value * pricing.breakdown[3].value).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-500 italic">Select an item and enter details to see pricing.</p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-semibold text-slate-800">Total payable</span>
                                <span className="text-2xl font-bold text-blue-600">₹{pricing.total.toLocaleString()}</span>
                            </div>

                            {paymentStatus === 'PARTIAL' && (
                                <div className="space-y-2 mb-6 pt-2 border-t border-dashed border-slate-200">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Amount Paid</span>
                                        <span className="font-medium text-green-600">₹{Number(partialAmount || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Balance Due</span>
                                        <span className="font-medium text-red-600">₹{(pricing.total - Number(partialAmount || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                form="booking-form"
                                type="submit"
                                disabled={isLoading || pricing.total === 0}
                                className="w-full flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Booking' : 'Confirm Booking')}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/bookings')}
                                className="w-full mt-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
