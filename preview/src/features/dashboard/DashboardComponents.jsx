import React from 'react';

export const ResultRow = ({ label, value, unit, status, statusColor = 'text-[#96DFCD]' }) => (
    <div className="flex justify-between items-end">
        <div>
            <p className="text-xs text-slate-300 mb-0.5">{label}</p>
            {status && <p className={`text-xs font-medium ${statusColor}`}>{status}</p>}
        </div>
        <div className="text-right">
            <span className="text-xl font-bold tracking-tight text-white">{value}</span>
            {unit && <span className="text-xs text-slate-400 ml-1">{unit}</span>}
        </div>
    </div>
);

export const TdeeRow = ({ label, kcal, highlight }) => (
    <div className={`flex justify-between items-center p-2 rounded ${highlight ? 'bg-[#96DFCD] border border-[#96DFCD]/30 shadow-sm' : ''}`}>
        <span className={`text-sm ${highlight ? 'text-[#003844] font-semibold' : 'text-slate-600'}`}>{label}</span>
        <span className="font-bold text-[#003844]">{kcal} kcal</span>
    </div>
);

export const SomatoBox = ({ label, value, color }) => (
    <div className={`p-2 rounded-lg ${color} flex flex-col items-center justify-center`}>
        <span className="block text-2xl font-bold">{value}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
);
