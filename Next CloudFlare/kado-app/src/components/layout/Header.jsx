import React from 'react';
import { Search } from 'lucide-react';

export const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-kado-main font-outfit">Evaluación Avanzada</h1>
                <span className="px-3 py-1 bg-kado-teal text-kado-main rounded-full text-xs font-bold">
                    Consulta Activa
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kado-teal w-64 transition-all text-kado-main placeholder:text-slate-400"
                    />
                </div>
            </div>
        </header>
    );
};
