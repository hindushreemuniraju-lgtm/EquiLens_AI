import React, { useState, useEffect } from 'react';
import { History, Activity, ShieldCheck, Search, Filter, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { AuditTrailItem } from '../types';

export const AuditHistoryPage: React.FC = () => {
    const [auditList, setAuditList] = useState<AuditTrailItem[]>([]);
    const [filterPillar, setFilterPillar] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await api.getAuditTrail(80);
            setAuditList(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filtered = auditList.filter(item => {
        const matchesPillar = filterPillar === "ALL" || item.pillar.toLowerCase().includes(filterPillar.toLowerCase());
        const matchesQuery = !searchQuery ||
            item.action_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pillar.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.actor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPillar && matchesQuery;
    });

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            {/* Header */}
            <div className="pb-4 border-b border-[#22222E]">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#007BA7]/15 text-[#007BA7] border border-[#007BA7]/30">
                        PILLAR 6: AUDIT TRAIL
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Immutable Compliance Telemetry Log</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">System Audit &amp; Event History</h1>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                    Full, unalterable forensic record of algorithmic audits, proxy scans, student threat verifications, consent modifications, and DPDP erasure executions.
                </p>
            </div>

            {/* Filter Controls */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-card-dark">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter audit actions..."
                            className="bg-[#0A0A0A] border border-[#22222E] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7] w-56"
                        />
                    </div>

                    <select
                        value={filterPillar}
                        onChange={(e) => setFilterPillar(e.target.value)}
                        className="bg-[#0A0A0A] border border-[#22222E] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#007BA7]"
                    >
                        <option value="ALL">All Pillars</option>
                        <option value="Fairness">Fairness Metrics</option>
                        <option value="Remediation">Algorithmic Remediation</option>
                        <option value="Protection">Student Protection</option>
                        <option value="Privacy">Privacy &amp; Consent</option>
                    </select>
                </div>

                <button
                    onClick={fetchHistory}
                    disabled={loading}
                    className="px-3.5 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222232] text-xs font-mono text-slate-200 border border-[#282838] flex items-center gap-1.5 transition-colors"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh Log</span>
                </button>
            </div>

            {/* Event Table */}
            <div className="bg-[#121217] border border-[#22222E] rounded-xl overflow-hidden shadow-card-dark">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#0A0A0A] text-slate-400 border-b border-[#22222E]">
                            <tr>
                                <th className="p-3">Timestamp (UTC)</th>
                                <th className="p-3">Action Event</th>
                                <th className="p-3">Platform Pillar</th>
                                <th className="p-3">Actor</th>
                                <th className="p-3">Forensic Metadata Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1A1A24] text-slate-300">
                            {filtered.length > 0 ? (
                                filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#161622] transition-colors">
                                        <td className="p-3 whitespace-nowrap text-slate-400">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-3 whitespace-nowrap font-bold text-white flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#007BA7]" />
                                            {item.action_type}
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-slate-300">
                                            {item.pillar}
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-slate-400">
                                            {item.actor}
                                        </td>
                                        <td className="p-3 text-[11px] text-slate-400 font-mono max-w-md truncate">
                                            {JSON.stringify(item.details || item.details_json)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-slate-500 font-mono">
                                        No audit events matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
