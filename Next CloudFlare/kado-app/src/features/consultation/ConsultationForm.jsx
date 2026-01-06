import React from 'react';
import { Activity, Settings, Droplet } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { NumberInput } from '../../components/ui/InputFields';

export const ConsultationForm = ({ consultation, results, onChange }) => {
    return (
        <div className="space-y-8">
            {/* 2. Datos de Consulta */}
            <Section title="Antropometría" icon={<Activity size={18} />}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <NumberInput label="Peso (kg)" name="weight" value={consultation.weight} onChange={onChange} step="0.1" />
                    <NumberInput label="Cintura (cm)" name="waist" value={consultation.waist} onChange={onChange} />
                    <NumberInput label="Cadera (cm)" name="hip" value={consultation.hip} onChange={onChange} />
                    <NumberInput label="Brazo Flex (cm)" name="armFlexed" value={consultation.armFlexed} onChange={onChange} />
                    <NumberInput label="Pantorrilla (cm)" name="calfCirc" value={consultation.calfCirc} onChange={onChange} />
                </div>
            </Section>

            {/* 3. Pliegues y Diámetros */}
            <Section title="Pliegues (mm) y Diámetros (cm)" icon={<Settings size={18} />}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <NumberInput label="Tríceps" name="triceps" value={consultation.triceps} onChange={onChange} />
                    <NumberInput label="Subescapular" name="subscapular" value={consultation.subscapular} onChange={onChange} />
                    <NumberInput label="Bíceps" name="biceps" value={consultation.biceps} onChange={onChange} />
                    <NumberInput label="Suprailíaco" name="suprailiac" value={consultation.suprailiac} onChange={onChange} />
                    <NumberInput label="Supraespinal" name="supraospinale" value={consultation.supraospinale} onChange={onChange} />
                    <NumberInput label="Pliegue Pant." name="calfFold" value={consultation.calfFold} onChange={onChange} />
                    <NumberInput label="Diám. Húmero" name="humerus" value={consultation.humerus} onChange={onChange} step="0.1" />
                    <NumberInput label="Diám. Fémur" name="femur" value={consultation.femur} onChange={onChange} step="0.1" />
                </div>
            </Section>

            {/* 4. Hidratación */}
            <Section title="Test de Sudoración (Post-ejercicio)" icon={<Droplet size={18} />}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <NumberInput label="Peso Pre (kg)" name="preWeight" value={consultation.preWeight} onChange={onChange} step="0.1" />
                    <NumberInput label="Peso Post (kg)" name="postWeight" value={consultation.postWeight} onChange={onChange} step="0.1" />
                    <NumberInput label="Líquido (L)" name="liquidConsumed" value={consultation.liquidConsumed} onChange={onChange} step="0.1" />
                    <NumberInput label="Orina (L)" name="urineOutput" value={consultation.urineOutput} onChange={onChange} step="0.1" />
                    <NumberInput label="Tiempo (min)" name="exerciseTime" value={consultation.exerciseTime} onChange={onChange} />
                    <div className="flex items-end pb-2">
                        <div className="flex flex-col">
                            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Tasa Calculada</label>
                            <span className="font-bold text-kado-main text-xl">{results.sweatRate} L/hr</span>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};
