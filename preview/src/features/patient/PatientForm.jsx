import React from 'react';
import { FileText } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { TextInput, SelectInput, NumberInput } from '../../components/ui/InputFields';

export const PatientForm = ({ patient, onChange }) => {
    return (
        <Section title="Datos Base del Paciente" icon={<FileText size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput label="Nombre Completo" name="name" value={patient.name} onChange={onChange} />
                <SelectInput label="Sexo" name="gender" value={patient.gender} onChange={onChange}>
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
                <div className="col-span-1 sm:col-span-2">
                    <TextInput label="Historial Clínico Resumido" name="history" value={patient.history} onChange={onChange} />
                </div>
            </div>
        </Section>
    );
};
