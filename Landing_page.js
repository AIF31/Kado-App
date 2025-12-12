import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Calendar, 
  Settings, 
  Search, 
  ChevronRight, 
  Save, 
  FileText,
  TrendingUp,
  User
} from 'lucide-react';

const NutritionDashboard = () => {
  // Estado para simular datos del paciente seleccionado
  const [selectedPatient, setSelectedPatient] = useState({
    id: 1,
    name: "Ana García",
    age: 28,
    gender: "F",
    lastVisit: "10 Oct 2023",
    goal: "Reducción de % Grasa"
  });

  // Estado para las medidas de la consulta actual
  const [metrics, setMetrics] = useState({
    weight: 68.5,
    height: 165,
    waist: 72,
    hip: 98,
    activityLevel: 1.375 // Sedentario ligero
  });

  // Estado para resultados calculados
  const [results, setResults] = useState({
    bmi: 0,
    bmiStatus: '',
    whr: 0, // Waist-Hip Ratio
    bmr: 0, // Basal Metabolic Rate
    tdee: 0 // Total Daily Energy Expenditure
  });

  // Efecto para calcular métricas automáticamente cuando cambian los inputs
  useEffect(() => {
    // 1. Cálculo de IMC (BMI)
    // Fórmula: peso (kg) / altura (m)^2
    const heightM = metrics.height / 100;
    const bmiVal = metrics.weight / (heightM * heightM);
    
    let status = '';
    if (bmiVal < 18.5) status = 'Bajo Peso';
    else if (bmiVal < 24.9) status = 'Normal';
    else if (bmiVal < 29.9) status = 'Sobrepeso';
    else status = 'Obesidad';

    // 2. Índice Cintura-Cadera
    const whrVal = metrics.waist / metrics.hip;

    // 3. Tasa Metabólica Basal (Mifflin-St Jeor)
    // Mujeres: (10 x peso) + (6.25 x altura) - (5 x edad) - 161
    // Hombres: (10 x peso) + (6.25 x altura) - (5 x edad) + 5
    let bmrVal = (10 * metrics.weight) + (6.25 * metrics.height) - (5 * selectedPatient.age);
    bmrVal = selectedPatient.gender === 'F' ? bmrVal - 161 : bmrVal + 5;

    // 4. Gasto Energético Total
    const tdeeVal = bmrVal * metrics.activityLevel;

    setResults({
      bmi: bmiVal.toFixed(1),
      bmiStatus: status,
      whr: whrVal.toFixed(2),
      bmr: Math.round(bmrVal),
      tdee: Math.round(tdeeVal)
    });

  }, [metrics, selectedPatient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetrics(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar de Navegación */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">NutriSoft</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem icon={<Users size={20} />} label="Pacientes" active />
          <NavItem icon={<Calendar size={20} />} label="Agenda" />
          <NavItem icon={<FileText size={20} />} label="Recetario" />
          <NavItem icon={<TrendingUp size={20} />} label="Estadísticas" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={20} className="text-slate-500"/>
            </div>
            <div>
              <p className="text-sm font-medium">Dr. Alonso M.</p>
              <p className="text-xs text-slate-500">Nutrición Clínica</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-auto">
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-700">Consulta en Curso</h1>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              Expediente Activo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar paciente..." 
                className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-6">
          
          {/* Tarjeta del Paciente */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
                AG
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h2>
                <div className="flex gap-4 text-sm text-slate-500 mt-1">
                  <span>{selectedPatient.age} años</span>
                  <span>•</span>
                  <span>Sexo: {selectedPatient.gender}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{selectedPatient.goal}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Última visita</p>
              <p className="font-medium">{selectedPatient.lastVisit}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna Izquierda: Entradas de Datos */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700">Antropometría</h3>
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Datos de hoy</span>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup 
                    label="Peso (kg)" 
                    name="weight" 
                    value={metrics.weight} 
                    onChange={handleInputChange} 
                    step="0.1"
                  />
                  <InputGroup 
                    label="Estatura (cm)" 
                    name="height" 
                    value={metrics.height} 
                    onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Cintura (cm)" 
                    name="waist" 
                    value={metrics.waist} 
                    onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Cadera (cm)" 
                    name="hip" 
                    value={metrics.hip} 
                    onChange={handleInputChange} 
                  />
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600 mb-2">Nivel de Actividad</label>
                    <select 
                      name="activityLevel"
                      value={metrics.activityLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors"
                    >
                      <option value={1.2}>Sedentario (Poco o nada ejercicio)</option>
                      <option value={1.375}>Ligero (Ejercicio 1-3 días/sem)</option>
                      <option value={1.55}>Moderado (Ejercicio 3-5 días/sem)</option>
                      <option value={1.725}>Fuerte (Ejercicio 6-7 días/sem)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">Notas de Evolución</h3>
                <textarea 
                  className="w-full h-32 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm"
                  placeholder="Escribe observaciones clínicas, adherencia a la dieta anterior, síntomas digestivos..."
                ></textarea>
              </div>
            </div>

            {/* Columna Derecha: Cálculos en Tiempo Real */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                
                <h3 className="font-semibold text-slate-300 mb-6 flex items-center gap-2">
                  <Activity size={18} /> Diagnóstico Inmediato
                </h3>

                <div className="space-y-6 relative z-10">
                  <ResultRow 
                    label="IMC (Masa Corporal)" 
                    value={results.bmi} 
                    subValue={results.bmiStatus}
                    color={results.bmiStatus === 'Normal' ? 'text-emerald-400' : 'text-amber-400'}
                  />
                  
                  <div className="h-px bg-slate-700"></div>

                  <ResultRow 
                    label="Relación Cintura/Cadera" 
                    value={results.whr} 
                    subValue={results.whr > 0.85 ? 'Riesgo Elevado' : 'Riesgo Bajo'}
                    color={results.whr > 0.85 ? 'text-rose-400' : 'text-emerald-400'}
                  />

                  <div className="h-px bg-slate-700"></div>

                  <ResultRow 
                    label="Gasto Energético (TDEE)" 
                    value={`${results.tdee} kcal`} 
                    subValue="Para mantenimiento"
                    color="text-white"
                  />
                </div>

                <button className="mt-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                  <Save size={18} /> Guardar Consulta
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                 <h4 className="text-sm font-semibold text-slate-600 mb-3">Accesos Rápidos</h4>
                 <div className="space-y-2">
                    <QuickAction text="Generar Dieta Automática" />
                    <QuickAction text="Enviar Recordatorio" />
                    <QuickAction text="Ver Histórico de Peso" />
                 </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// Componentes Auxiliares para limpieza de código UI

const NavItem = ({ icon, label, active = false }) => (
  <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-sm">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </a>
);

const InputGroup = ({ label, name, value, onChange, step }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-slate-700"
      />
    </div>
  </div>
);

const ResultRow = ({ label, value, subValue, color = 'text-white' }) => (
  <div className="flex justify-between items-end">
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-sm ${color}`}>{subValue}</p>
    </div>
    <span className="text-2xl font-bold tracking-tight">{value}</span>
  </div>
);

const QuickAction = ({ text }) => (
  <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors border border-transparent hover:border-slate-200">
    {text}
  </button>
);

export default NutritionDashboard;