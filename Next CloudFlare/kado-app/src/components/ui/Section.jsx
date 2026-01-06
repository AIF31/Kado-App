import React from 'react';

export const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-kado-main">{icon}</span>
            <h3 className="font-semibold text-kado-main font-outfit">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);
