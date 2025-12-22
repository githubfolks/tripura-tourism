import { mockRoles, mockPermissions } from '../../lib/mockData';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export function RolePermissions() {
    // Simulating matrix state
    const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
        'r1': { 'p1': true, 'p2': true, 'p3': true, 'p4': true }, // Super Admin
        'r2': { 'p3': true, 'p4': true }, // Content Manager
        'r3': { 'p3': true }, // Partner
    });

    const togglePermission = (roleId: string, permId: string) => {
        setMatrix(prev => ({
            ...prev,
            [roleId]: {
                ...prev?.[roleId],
                [permId]: !prev?.[roleId]?.[permId]
            }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Role Permissions</h1>
                    <p className="text-slate-500 mt-1">Manage access control matrix.</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm text-center">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left border-r border-slate-200">Permission / Role</th>
                            {mockRoles.map(role => (
                                <th key={role.id} className="px-6 py-4 min-w-[120px]">
                                    {role.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockPermissions.map(perm => (
                            <tr key={perm.id} className="border-b hover:bg-slate-50">
                                <td className="px-6 py-4 text-left font-medium text-slate-900 border-r border-slate-200">
                                    <div className="flex flex-col">
                                        <span>{perm.description}</span>
                                        <span className="text-xs text-slate-400 font-mono mt-0.5">{perm.code}</span>
                                    </div>
                                </td>
                                {mockRoles.map(role => {
                                    const isChecked = matrix[role.id]?.[perm.id];
                                    return (
                                        <td key={`${role.id}-${perm.id}`} className="px-6 py-4">
                                            <button
                                                onClick={() => togglePermission(role.id, perm.id)}
                                                className={cn(
                                                    "w-6 h-6 rounded border flex items-center justify-center mx-auto transition-colors",
                                                    isChecked
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : "bg-white border-slate-300 hover:border-blue-400"
                                                )}
                                            >
                                                {isChecked && <Check className="h-3.5 w-3.5" />}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
