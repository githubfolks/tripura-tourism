import { Download, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock settlement data
const mockSettlements = [
    { id: 'set1', date: '2024-12-01', amount: 45000, status: 'PAID', ref: 'TXN_123456', bookings_count: 5 },
    { id: 'set2', date: '2024-12-15', amount: 12000, status: 'PAID', ref: 'TXN_789012', bookings_count: 2 },
    { id: 'set3', date: '2024-12-22', amount: 8000, status: 'PENDING', ref: '-', bookings_count: 1 },
];

export function Settlements() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Settlements</h1>
                    <p className="text-slate-500 mt-1">Track payments and payout history.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Calendar className="h-4 w-4 mr-2" />
                        This Month
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">Total Paid Out</div>
                    <div className="text-3xl font-bold text-slate-900">₹57,000</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">Pending Clearance</div>
                    <div className="text-3xl font-bold text-orange-600">₹8,000</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">Next Payout Date</div>
                    <div className="text-3xl font-bold text-slate-900">Dec 31</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Reference ID</th>
                            <th className="px-6 py-3">Bookings</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockSettlements.map((settlement) => (
                            <tr key={settlement.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {new Date(settlement.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    {settlement.ref}
                                </td>
                                <td className="px-6 py-4">
                                    {settlement.bookings_count} bookings
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-xs font-bold",
                                        settlement.status === 'PAID' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                    )}>
                                        {settlement.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    ₹{settlement.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
