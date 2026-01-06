import React from 'react';

export const TextInput = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
        <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-kado-teal focus:border-kado-main outline-none transition-all text-sm font-medium text-kado-main"
            {...props}
        />
    </div>
);

export const NumberInput = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide truncate" title={label}>{label}</label>
        <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-kado-teal focus:border-kado-main outline-none transition-all text-sm font-medium text-kado-main"
            {...props}
        />
    </div>
);

export const SelectInput = ({ label, children, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
        <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-kado-teal focus:border-kado-main outline-none transition-all text-sm font-medium text-kado-main bg-white"
            {...props}
        >
            {children}
        </select>
    </div>
);
