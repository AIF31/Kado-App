import React from 'react';
import { Users, Calendar, FileText, TrendingUp, Settings, User, Activity, ChevronRight } from 'lucide-react';

const NavItem = ({ icon, label, active, color }) => (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? `bg-kado-teal/10 text-kado-main font-medium ring-1 ring-kado-teal` : 'text-slate-500 hover:bg-slate-50'}`}>
        {React.cloneElement(icon, { size: 20, className: active ? 'text-kado-main' : 'text-slate-400' })}
        <span className="text-sm font-outfit">{label}</span>
        {active && <ChevronRight size={16} className="ml-auto text-kado-main" />}
    </a>
);

export const Sidebar = () => {
    return (
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center">
                    <img src="/kado.png" alt="Kado Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xl text-kado-main tracking-tight font-outfit">Kado App</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                <NavItem icon={<Users size={20} />} label="Pacientes" active color="var(--color-kado-teal)" />
                <NavItem icon={<Calendar size={20} />} label="Agenda" />
                <NavItem icon={<FileText size={20} />} label="Recetario" />
                <NavItem icon={<TrendingUp size={20} />} label="Estadísticas" />
                <NavItem icon={<Settings size={20} />} label="Configuración" />
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User size={20} className="text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Dr. Alonso M.</p>
                        <p className="text-xs text-slate-500">Nutrición Clínica</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
