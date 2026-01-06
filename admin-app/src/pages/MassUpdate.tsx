import { useState, useMemo } from 'react';
import { ArrowLeft, Save, Shield, Calendar, DollarSign, Filter, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockDestinations, mockAccommodations } from '../lib/mockData';
import { cn } from '../lib/utils';

type Tab = 'TARIFF' | 'BLOCK';
type TariffMode = 'TEMPORARY' | 'PERMANENT';

export function MassUpdate() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('TARIFF');

    // Selection State
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [selectedDestinationIds, setSelectedDestinationIds] = useState<Set<string>>(new Set());

    // Tariff State
    const [tariffMode, setTariffMode] = useState<TariffMode>('TEMPORARY');
    const [tariffStartDate, setTariffStartDate] = useState('');
    const [tariffEndDate, setTariffEndDate] = useState('');
    const [newPrice, setNewPrice] = useState('');

    // Block State
    const [blockStartDate, setBlockStartDate] = useState('');
    const [blockEndDate, setBlockEndDate] = useState('');

    // Derived Data
    const roomTypes = useMemo(() => {
        const types = new Set(mockAccommodations.map(acc => acc.type));
        return Array.from(types);
    }, []);

    const availableDestinations = useMemo(() => {
        if (!selectedRoomType) return [];
        return mockDestinations.filter(dest =>
            mockAccommodations.some(acc => acc.destination_id === dest.id && acc.type === selectedRoomType)
        );
    }, [selectedRoomType]);

    // Handlers
    const toggleDestination = (id: string) => {
        const newSet = new Set(selectedDestinationIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedDestinationIds(newSet);
    };

    const toggleAllDestinations = () => {
        if (selectedDestinationIds.size === availableDestinations.length) {
            setSelectedDestinationIds(new Set());
        } else {
            setSelectedDestinationIds(new Set(availableDestinations.map(d => d.id)));
        }
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();

        // This is where the actual update logic would go. 
        // For prototype, we'll just log and maybe show an alert or toast.

        const action = activeTab === 'TARIFF' ? 'Update Tariff' : 'Block Bookings';
        const targets = Array.from(selectedDestinationIds);

        if (targets.length === 0) {
            alert('Please select at least one destination.');
            return;
        }

        console.log(`Performing ${action}`, {
            targets,
            roomType: selectedRoomType,
            mode: activeTab === 'TARIFF' ? tariffMode : 'BLOCK',
            dates: activeTab === 'TARIFF'
                ? { start: tariffStartDate, end: tariffMode === 'TEMPORARY' ? tariffEndDate : null }
                : { start: blockStartDate, end: blockEndDate },
            price: activeTab === 'TARIFF' ? newPrice : null
        });

        alert(`${action} applied successfully to ${targets.length} destinations!`);
        navigate('/destinations');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/destinations')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Mass Update</h1>
                    <p className="text-slate-500 text-sm">Update prices or block bookings across multiple destinations.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('TARIFF')}
                        className={cn(
                            "flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors",
                            activeTab === 'TARIFF' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Update Tariff
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('BLOCK')}
                        className={cn(
                            "flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors",
                            activeTab === 'BLOCK' ? "border-red-600 text-red-600 bg-red-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Shield className="h-4 w-4" />
                            Block Bookings
                        </div>
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Panel: Configuration */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* 1. Filter Criteria */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Selection Criteria
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Room Type</label>
                                <select
                                    value={selectedRoomType}
                                    onChange={(e) => {
                                        setSelectedRoomType(e.target.value);
                                        setSelectedDestinationIds(new Set()); // Reset selection on type change
                                    }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Room Type</option>
                                    {roomTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* 2. Action Configuration */}
                        <form id="mass-update-form" onSubmit={handleApply} className="space-y-6">

                            {activeTab === 'TARIFF' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" /> Pricing Details
                                    </h3>

                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => setTariffMode('TEMPORARY')}
                                            className={cn(
                                                "flex-1 py-1.5 text-xs font-medium rounded transition-all",
                                                tariffMode === 'TEMPORARY' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                        >
                                            Temporary
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTariffMode('PERMANENT')}
                                            className={cn(
                                                "flex-1 py-1.5 text-xs font-medium rounded transition-all",
                                                tariffMode === 'PERMANENT' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                            )}
                                        >
                                            Permanent
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Start From</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="date"
                                                    required
                                                    value={tariffStartDate}
                                                    onChange={(e) => setTariffStartDate(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {tariffMode === 'TEMPORARY' && (
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">End Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <input
                                                        type="date"
                                                        required
                                                        min={tariffStartDate}
                                                        value={tariffEndDate}
                                                        onChange={(e) => setTariffEndDate(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">New Price (₹)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                required
                                                placeholder="e.g. 2500"
                                                value={newPrice}
                                                onChange={(e) => setNewPrice(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'BLOCK' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> Block Duration
                                    </h3>

                                    <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg border border-red-100">
                                        This will prevent any new bookings for the selected room type during this period.
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Start Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="date"
                                                    required
                                                    value={blockStartDate}
                                                    onChange={(e) => setBlockStartDate(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">End Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="date"
                                                    required
                                                    min={blockStartDate}
                                                    value={blockEndDate}
                                                    onChange={(e) => setBlockEndDate(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={selectedDestinationIds.size === 0}
                                className={cn(
                                    "w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                    activeTab === 'TARIFF' ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                                )}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {activeTab === 'TARIFF' ? 'Update Tariff' : 'Block Bookings'}
                            </button>
                        </form>
                    </div>

                    {/* Right Panel: Destination Selection */}
                    <div className="lg:col-span-2 border-l border-slate-100 lg:pl-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                Target Destinations ({selectedDestinationIds.size})
                            </h3>
                            {availableDestinations.length > 0 && (
                                <button
                                    type="button"
                                    onClick={toggleAllDestinations}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                >
                                    {selectedDestinationIds.size === availableDestinations.length ? 'Deselect All' : 'Select All'}
                                </button>
                            )}
                        </div>

                        {selectedRoomType ? (
                            availableDestinations.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {availableDestinations.map(dest => {
                                        const isSelected = selectedDestinationIds.has(dest.id);
                                        return (
                                            <div
                                                key={dest.id}
                                                onClick={() => toggleDestination(dest.id)}
                                                className={cn(
                                                    "flex items-start p-3 rounded-lg border cursor-pointer transition-all select-none",
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                                                )}
                                            >
                                                <div className="pt-0.5 mr-3">
                                                    {isSelected ? <CheckSquare className="h-5 w-5 text-blue-600" /> : <Square className="h-5 w-5 text-slate-300" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900 text-sm">{dest.name}</h4>
                                                    <p className="text-xs text-slate-500">{dest.district}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Shield className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-sm">No destinations found with this room type.</p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <Filter className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-sm">Select a room type to view targets.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
