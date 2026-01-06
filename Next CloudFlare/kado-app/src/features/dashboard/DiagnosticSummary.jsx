import React from 'react';
import { Activity, Dumbbell, Zap, Save } from 'lucide-react';
import { ResultRow, TdeeRow, SomatoBox } from './DashboardComponents';

export const DiagnosticSummary = ({
    results,
    diagnosticSummary,
    isLoadingSummary,
    onGenerateSummary,
    onSave,
    isSaving
}) => {
    return (
        <div className="space-y-6">
            {/* Diagnóstico Card */}
            {/* Diagnóstico Card */}
            <div className="bg-kado-main text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-kado-teal rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <h3 className="font-semibold text-kado-teal mb-6 flex items-center gap-2 font-outfit">
                    <Activity size={18} /> Diagnóstico Inmediato
                </h3>
                <div className="space-y-4 relative z-10">
                    <ResultRow label="IMC (Masa Corporal)" value={results.bmi} unit="kg/m²" status={results.bmiStatus} statusColor={results.bmiStatus === 'Normal' ? 'text-kado-teal' : 'text-amber-400'} />
                    <ResultRow label="Peso Saludable" value={`${results.healthyWeightMin} - ${results.healthyWeightMax}`} unit="kg" />
                    <ResultRow label="Rel. Cintura/Cadera" value={results.whr} status={results.whrRisk === 'Bajo' ? 'Riesgo Bajo' : 'Riesgo Alto'} statusColor={results.whrRisk === 'Bajo' ? 'text-kado-teal' : 'text-rose-400'} />

                    <div className="h-px bg-slate-700 my-2"></div>

                    <ResultRow label="% Grasa (Deurenberg/IMC)" value={results.fatPercentageBMI} unit="%" />
                    <ResultRow label="% Grasa (Durnin & Womersley/Siri)" value={results.fatPercentageSkinfolds} unit="%" status="Basado en 4 Pliegues" statusColor="text-slate-400" />
                </div>
            </div>

            {/* Gasto Energético */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-kado-main mb-4 flex items-center gap-2 font-outfit">
                    <Dumbbell size={18} className="text-kado-teal" /> Perfil Energético
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-kado-teal/20 p-3 rounded-lg border border-kado-teal/30">
                        <span className="text-sm font-semibold text-kado-main">Tasa Metabólica Basal (BMR)</span>
                        <span className="font-bold text-lg text-kado-main">{results.bmrMifflin} kcal</span>
                    </div>
                    <div className="space-y-1 pt-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Requerimiento Diario Estimado (TDEE)</p>
                        <TdeeRow label="Descanso (Sedentario)" kcal={results.tdeeRest} />
                        <TdeeRow label="Entreno Moderado" kcal={results.tdeeModerate} highlight />
                        <TdeeRow label="Día Intenso / Atleta" kcal={results.tdeeIntense} />
                    </div>
                </div>
            </div>



            {/* ASISTENTE DE DIAGNÓSTICO GEMINI */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                <h3 className="font-semibold text-kado-main flex items-center gap-2 font-outfit">
                    <Zap size={18} className="text-amber-500" /> Asistente de Diagnóstico ✨
                </h3>
                <button
                    onClick={onGenerateSummary}
                    disabled={isLoadingSummary}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-kado-main font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm"
                >
                    {isLoadingSummary ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-kado-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generando Resumen...
                        </>
                    ) : (
                        <>
                            <Zap size={18} /> Generar Resumen Clínico
                        </>
                    )}
                </button>

                {diagnosticSummary && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Resumen de Interpretación (IA)</p>
                        <p className="text-sm leading-relaxed text-kado-main whitespace-pre-wrap">{diagnosticSummary}</p>
                    </div>
                )}
            </div>

            <button
                onClick={onSave}
                disabled={isSaving}
                className="w-full bg-kado-main hover:bg-[#002830] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xl shadow-kado-main/20"
            >
                {isSaving ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save size={18} /> GUARDAR EVALUACIÓN CLÍNICA
                    </>
                )}
            </button>
        </div>
    );
};
