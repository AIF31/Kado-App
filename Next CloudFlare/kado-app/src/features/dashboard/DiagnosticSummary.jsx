import React from 'react';
import { Activity, Dumbbell, Heart, Zap, Save } from 'lucide-react';
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
            <div className="bg-[#003844] text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#96DFCD] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <h3 className="font-semibold text-[#96DFCD] mb-6 flex items-center gap-2">
                    <Activity size={18} /> Diagnóstico Inmediato
                </h3>
                <div className="space-y-4 relative z-10">
                    <ResultRow label="IMC (Masa Corporal)" value={results.bmi} unit="kg/m²" status={results.bmiStatus} statusColor={results.bmiStatus === 'Normal' ? 'text-[#96DFCD]' : 'text-amber-400'} />
                    <ResultRow label="Peso Saludable" value={`${results.healthyWeightMin} - ${results.healthyWeightMax}`} unit="kg" />
                    <ResultRow label="Rel. Cintura/Cadera" value={results.whr} status={results.whrRisk === 'Bajo' ? 'Riesgo Bajo' : 'Riesgo Alto'} statusColor={results.whrRisk === 'Bajo' ? 'text-[#96DFCD]' : 'text-rose-400'} />

                    <div className="h-px bg-slate-700 my-2"></div>

                    <ResultRow label="% Grasa (Deurenberg/IMC)" value={results.fatPercentageBMI} unit="%" />
                    <ResultRow label="% Grasa (Durnin & Womersley/Siri)" value={results.fatPercentageSkinfolds} unit="%" status="Basado en 4 Pliegues" statusColor="text-slate-400" />
                </div>
            </div>

            {/* Gasto Energético */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-[#003844] mb-4 flex items-center gap-2">
                    <Dumbbell size={18} className="text-[#96DFCD]" /> Perfil Energético
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-[#96DFCD]/20 p-3 rounded-lg border border-[#96DFCD]/30">
                        <span className="text-sm font-semibold text-[#003844]">Tasa Metabólica Basal (BMR)</span>
                        <span className="font-bold text-lg text-[#003844]">{results.bmrMifflin} kcal</span>
                    </div>
                    <div className="space-y-1 pt-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Requerimiento Diario Estimado (TDEE)</p>
                        <TdeeRow label="Descanso (Sedentario)" kcal={results.tdeeRest} />
                        <TdeeRow label="Entreno Moderado" kcal={results.tdeeModerate} highlight />
                        <TdeeRow label="Día Intenso / Atleta" kcal={results.tdeeIntense} />
                    </div>
                </div>
            </div>

            {/* Somatocarta */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-[#003844] mb-4 flex items-center gap-2">
                    <Heart size={18} className="text-[#96DFCD]" /> Somatotipo (Heath-Carter)
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <SomatoBox label="Endomorfo" value={results.somatotype.endo} color="bg-rose-50 text-rose-700" />
                    <SomatoBox label="Mesomorfo" value={results.somatotype.meso} color="bg-[#96DFCD] text-[#003844] border-2 border-[#003844]/50" />
                    <SomatoBox label="Ectomorfo" value={results.somatotype.ecto} color="bg-blue-50 text-blue-700" />
                </div>
            </div>

            {/* ASISTENTE DE DIAGNÓSTICO GEMINI */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                <h3 className="font-semibold text-[#003844] flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> Asistente de Diagnóstico ✨
                </h3>
                <button
                    onClick={onGenerateSummary}
                    disabled={isLoadingSummary}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-[#003844] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm"
                >
                    {isLoadingSummary ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-[#003844]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        <p className="text-sm leading-relaxed text-[#003844] whitespace-pre-wrap">{diagnosticSummary}</p>
                    </div>
                )}
            </div>

            <button
                onClick={onSave}
                disabled={isSaving}
                className="w-full bg-[#003844] hover:bg-[#002830] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xl shadow-[#003844]/20"
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
