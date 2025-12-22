import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { mockRoles } from '../../lib/mockData';

export function Roles() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Roles</h1>
           <p className="text-slate-500 mt-1">Define user roles and responsibilities.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3">Role Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRoles.map((role) => (
              <tr key={role.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                   <Shield className="h-4 w-4 mr-2 text-blue-500" />
                   {role.name}
                </td>
                <td className="px-6 py-4">{role.description}</td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button className="text-slate-400 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                        <button className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
