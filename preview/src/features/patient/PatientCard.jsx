import React from 'react';

export const PatientCard = ({ patient, age, genderLabel }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-[#003844] flex items-center justify-center text-xl font-bold border-2 border-[#96DFCD]">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#003844]">{patient.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                        <span>{age} años</span>
                        <span>•</span>
                        <span>{genderLabel}</span>
                        <span>•</span>
                        <span className="text-[#003844] font-semibold">{patient.goal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
