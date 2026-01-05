import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, ShoppingBag, CalendarCheck } from 'lucide-react';
import { mockBookings } from '../lib/mockData';
import { cn } from '../lib/utils';

const data = [
    { name: 'Mon', revenue: 4000, bookings: 24 },
    { name: 'Tue', revenue: 3000, bookings: 13 },
    { name: 'Wed', revenue: 2000, bookings: 98 },
    { name: 'Thu', revenue: 2780, bookings: 39 },
    { name: 'Fri', revenue: 1890, bookings: 48 },
    { name: 'Sat', revenue: 2390, bookings: 38 },
    { name: 'Sun', revenue: 3490, bookings: 43 },
];

export function Dashboard() {
    const totalRevenue = mockBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const confirmedBookings = mockBookings.filter(b => b.booking_status === 'CONFIRMED').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <div className="flex space-x-2">
                    <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    change="+12.5%"
                    trend="up"
                    icon={CreditCard}
                    color="blue"
                />
                <StatsCard
                    title="Total Bookings"
                    value={mockBookings.length.toString()}
                    change="+8.2%"
                    trend="up"
                    icon={ShoppingBag}
                    color="purple"
                />
                <StatsCard
                    title="Confirmed"
                    value={confirmedBookings.toString()}
                    change="-2.1%"
                    trend="down"
                    icon={CalendarCheck}
                    color="green"
                />
                <StatsCard
                    title="Active Users"
                    value="1,203"
                    change="+14.6%"
                    trend="up"
                    icon={Users}
                    color="orange"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trends</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Bookings Source</h3>
                    <div className="h-80 flex flex-col justify-center">
                        {/* Simple Pie Chart Mockup using CSS/SVG or Recharts Pie */}
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 text-center">Breakdown by daily volume</p>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table (Simplified) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Recent Bookings</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Reference</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Package</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockBookings.slice(0, 5).map((booking) => (
                                <tr key={booking.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{booking.booking_reference}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-medium">{booking.customer_name}</span>
                                            <span className="text-xs text-slate-400">{booking.customer_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{booking.package_name}</td>
                                    <td className="px-6 py-4">{booking.booked_at}</td>
                                    <td className="px-6 py-4 font-medium">₹{booking.total_amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            booking.booking_status === 'CONFIRMED' ? "bg-green-100 text-green-800" :
                                                booking.booking_status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                                                    booking.booking_status === 'CANCELLED' ? "bg-red-100 text-red-800" :
                                                        "bg-slate-100 text-slate-800"
                                        )}>
                                            {booking.booking_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


function StatsCard({ title, value, change, trend, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <span className={cn("p-2 rounded-lg",
                    color === 'blue' ? "bg-blue-100 text-blue-600" :
                        color === 'purple' ? "bg-purple-100 text-purple-600" :
                            color === 'green' ? "bg-green-100 text-green-600" :
                                "bg-orange-100 text-orange-600"
                )}>
                    <Icon className="h-6 w-6" />
                </span>
                <span className={cn("text-sm font-medium flex items-center",
                    trend === 'up' ? "text-green-600" : "text-red-600"
                )}>
                    {change}
                    {trend === 'up' ? <ArrowUpRight className="h-4 w-4 ml-1" /> : <ArrowDownRight className="h-4 w-4 ml-1" />}
                </span>
            </div>
            <div>
                <p className="text-sm text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    );
}
