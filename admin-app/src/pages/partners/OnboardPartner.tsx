import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Globe } from 'lucide-react';

export function OnboardPartner() {
    const navigate = useNavigate();

    return (
        <div className="max-w-full mx-auto space-y-6">
            <button onClick={() => navigate('/partners')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Partners
            </button>

            <h1 className="text-2xl font-bold text-slate-800">Onboard New Partner</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Partner Name</label>
                    <input type="text" placeholder="e.g. MakeMyTrip" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Domain URL</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500">
                            <Globe className="h-4 w-4" />
                        </span>
                        <input type="text" placeholder="www.example.com" className="w-full px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Email</label>
                    <input type="email" placeholder="api@partner.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <input type="checkbox" id="generate-creds" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" defaultChecked />
                    <label htmlFor="generate-creds" className="text-sm text-slate-700">Auto-generate Client ID & Secret</label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    Client credentials will be shown only once after successful creation.
                </div>

                <div className="flex justify-end pt-4">
                    <button className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Save className="h-4 w-4 mr-2" />
                        Onboard Partner
                    </button>
                </div>
            </div>
        </div>
    );
}
