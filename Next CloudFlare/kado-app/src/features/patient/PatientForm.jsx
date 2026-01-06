import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { TextInput, SelectInput, NumberInput } from '../../components/ui/InputFields';

export const PatientForm = ({ patient, onChange }) => {
    const [showOptional, setShowOptional] = useState(false);

    return (
        <Section title="Datos Base del Paciente" icon={<FileText size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput label="Nombre Completo" name="name" value={patient.name} onChange={onChange} />

                <SelectInput label="Sexo Biológico" name="gender" value={patient.gender} onChange={onChange}>
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                </SelectInput>

                <TextInput label="Fecha Nacimiento" type="date" name="dob" value={patient.dob} onChange={onChange} />

                <NumberInput
                    label="Estatura (cm)"
                    name="height"
                    value={patient.height}
                    onChange={(e) => onChange({ target: { name: 'height', value: parseFloat(e.target.value) } })}
                />

                <SelectInput label="Consumo de Tabaco" name="tobacco" value={patient.tobacco} onChange={onChange}>
                    <option value="no">Nunca / No fuma</option>
                    <option value="former">Ex-fumador</option>
                    <option value="current">Fumador actual</option>
                </SelectInput>

                <TextInput label="Discapacidad Física" name="disability" value={patient.disability} onChange={onChange} placeholder="Ninguna o especifique" />

                <TextInput label="Movilidad" name="mobility" value={patient.mobility} onChange={onChange} placeholder="Completa, Limitada, etc." />

                {/* Optional Fields Section */}
                <div className="col-span-1 sm:col-span-2 border-t border-slate-100 pt-4 mt-2">
                    <button
                        onClick={() => setShowOptional(!showOptional)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 hover:text-kado-main transition-colors"
                        type="button"
                    >
                        {showOptional ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        Datos Sociodemográficos (Opcional)
                    </button>

                    {showOptional && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <TextInput label="Grupo Étnico" name="ethnicity" value={patient.ethnicity} onChange={onChange} />
                            <TextInput label="Idioma Primario" name="language" value={patient.language} onChange={onChange} />
                            <TextInput label="Factores de Alfabetización" name="literacy" value={patient.literacy} onChange={onChange} placeholder="Nivel lector/escritor" />
                            <TextInput label="Educación / Escolaridad" name="education" value={patient.education} onChange={onChange} />
                            <TextInput label="Rol en la Familia" name="familyRole" value={patient.familyRole} onChange={onChange} />
                        </div>
                    )}
                </div>

                <div className="col-span-1 sm:col-span-2">
                    <TextInput label="Historial Clínico Resumido" name="history" value={patient.history} onChange={onChange} />
                </div>
            </div>
        </Section>
    );
};
