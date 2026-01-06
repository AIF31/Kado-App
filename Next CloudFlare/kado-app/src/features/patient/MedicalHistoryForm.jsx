import React, { useState } from 'react';
import { ClipboardList, Stethoscope, Users, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { TextInput } from '../../components/ui/InputFields';

const SystemRow = ({ label, systemKey, values, onChange }) => {
    const isPatient = values?.[systemKey]?.includes('P');
    const isFamily = values?.[systemKey]?.includes('F');

    const toggleValue = (val) => {
        const current = values?.[systemKey] || [];
        const newValues = current.includes(val)
            ? current.filter(v => v !== val)
            : [...current, val];
        onChange(systemKey, newValues);
    };

    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
            <span className="text-sm text-kado-main font-medium">{label}</span>
            <div className="flex gap-2">
                <button
                    onClick={() => toggleValue('P')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${isPatient ? 'bg-kado-teal text-kado-main border-kado-teal' : 'bg-white text-slate-400 border-slate-200 hover:border-kado-teal/50'}`}
                    title="Paciente"
                >
                    P
                </button>
                <button
                    onClick={() => toggleValue('F')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${isFamily ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-200'}`}
                    title="Familiar"
                >
                    F
                </button>
            </div>
        </div>
    );
};

export const MedicalHistoryForm = ({ history, onChange }) => {
    const [showSocial, setShowSocial] = useState(false);

    const handleSystemChange = (key, value) => {
        onChange({
            target: {
                name: 'systems',
                value: { ...history.systems, [key]: value }
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ target: { name, value } });
    };

    const handleNestedChange = (parent, key, value) => {
        onChange({
            target: {
                name: parent,
                value: { ...history[parent], [key]: value }
            }
        });
    };

    return (
        <div className="space-y-6">
            <Section title="Antecedentes Médicos y de Salud" icon={<ClipboardList size={18} />}>
                <div className="mb-4 p-3 bg-blue-50/50 rounded-lg text-xs text-slate-500 flex gap-4">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-kado-teal"></span> P = Paciente</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-200"></span> F = Familiar</div>
                </div>

                <div className="space-y-1">
                    <SystemRow label="Queja Principal de Nutrición" systemKey="complaint" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Cardiovascular" systemKey="cardio" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Endócrino / Metabolismo" systemKey="endocrine" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Excreción" systemKey="excretion" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Gastrointestinal" systemKey="gastro" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Ginecológico" systemKey="gyneco" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Hematología / Oncología" systemKey="hemato" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Inmune (Alergias)" systemKey="immune" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Integumentario (Piel)" systemKey="skin" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Musculoesquelético" systemKey="musculo" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Neurológico" systemKey="neuro" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Psicológico" systemKey="psycho" values={history.systems} onChange={handleSystemChange} />
                    <SystemRow label="Respiratorio" systemKey="respiratory" values={history.systems} onChange={handleSystemChange} />
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <TextInput
                        label="Otros Antecedentes / Observaciones"
                        name="otherNotes"
                        value={history.otherNotes || ''}
                        onChange={handleChange}
                        placeholder="Especifique detalles adicionales..."
                    />
                </div>
            </Section>

            <Section title="Tratamientos y Terapias" icon={<Stethoscope size={18} />}>
                <div className="grid grid-cols-1 gap-4">
                    <TextInput
                        label="Tratamiento Médico / Terapia"
                        value={history.treatments?.medical || ''}
                        onChange={(e) => handleNestedChange('treatments', 'medical', e.target.value)}
                        placeholder="Medicamentos, terapias físicas, etc."
                    />
                    <TextInput
                        label="Tratamiento Quirúrgico"
                        value={history.treatments?.surgical || ''}
                        onChange={(e) => handleNestedChange('treatments', 'surgical', e.target.value)}
                        placeholder="Cirugías previas o programadas"
                    />
                    <TextInput
                        label="Cuidados Paliativos"
                        value={history.treatments?.palliative || ''}
                        onChange={(e) => handleNestedChange('treatments', 'palliative', e.target.value)}
                        placeholder="Si aplica"
                    />
                </div>
            </Section>

            <div className="border-t border-slate-200 pt-4">
                <button
                    onClick={() => setShowSocial(!showSocial)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 hover:text-kado-main transition-colors w-full"
                    type="button"
                >
                    {showSocial ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <Users size={14} className="mr-1" /> Antecedentes Sociales (Opcional)
                </button>

                {showSocial && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <Section title="Factores Sociales y Ambientales">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextInput
                                    label="Factores Socioeconómicos"
                                    value={history.social?.socioeconomic || ''}
                                    onChange={(e) => handleNestedChange('social', 'socioeconomic', e.target.value)}
                                />
                                <TextInput
                                    label="Situación de Vivienda"
                                    value={history.social?.housing || ''}
                                    onChange={(e) => handleNestedChange('social', 'housing', e.target.value)}
                                />
                                <TextInput
                                    label="Problemas Domésticos"
                                    value={history.social?.domestic || ''}
                                    onChange={(e) => handleNestedChange('social', 'domestic', e.target.value)}
                                />
                                <TextInput
                                    label="Apoyo Social y Médico"
                                    value={history.social?.support || ''}
                                    onChange={(e) => handleNestedChange('social', 'support', e.target.value)}
                                />
                                <TextInput
                                    label="Localización Geográfica"
                                    value={history.social?.location || ''}
                                    onChange={(e) => handleNestedChange('social', 'location', e.target.value)}
                                />
                                <TextInput
                                    label="Ocupación"
                                    value={history.social?.occupation || ''}
                                    onChange={(e) => handleNestedChange('social', 'occupation', e.target.value)}
                                />
                                <TextInput
                                    label="Religión"
                                    value={history.social?.religion || ''}
                                    onChange={(e) => handleNestedChange('social', 'religion', e.target.value)}
                                />
                                <TextInput
                                    label="Crisis Recientes"
                                    value={history.social?.crisis || ''}
                                    onChange={(e) => handleNestedChange('social', 'crisis', e.target.value)}
                                />
                                <TextInput
                                    label="Nivel de Estrés Diario"
                                    value={history.social?.stress || ''}
                                    onChange={(e) => handleNestedChange('social', 'stress', e.target.value)}
                                />
                            </div>
                        </Section>
                    </div>
                )}
            </div>
        </div>
    );
};
