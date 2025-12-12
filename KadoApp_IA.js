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
    User,
    Droplet,
    Dumbbell,
    Heart,
    Zap
} from 'lucide-react';

// Colores de la paleta:
// #003844 - Primario Oscuro (Fondo de Diagnóstico, Texto Principal)
// #96DFCD - Secundario/Acento (Botones, Highlights)

const KadoApp = () => {
    // --- UTILITIES FOR GEMINI API ---

    // Manejo de backoff exponencial para el fetch
    const fetchWithExponentialBackoff = async (url, options, maxRetries = 5) => {
        let delay = 1000;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    return response;
                }
                // Si hay un error HTTP, lanzar para reintentar
                throw new Error(`HTTP error! status: ${response.status}`);
            } catch (error) {
                if (i === maxRetries - 1) {
                    console.error("Max retries reached. Failing request.", error);
                    throw error;
                }
                // Esperar el retraso exponencial
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
        throw new Error("Failed to fetch after multiple retries.");
    };

    // Procesar la respuesta de la API de Gemini
    const processGeminiResponse = (result) => {
        const candidate = result.candidates?.[0];
        if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text;
        }
        return "Error al generar el resumen. Respuesta de la API incompleta.";
    };

    // --- STATE ---

    // Patient Data (Datos del paciente)
    const [patient, setPatient] = useState({
        name: "Ana García",
        gender: "F", // M or F
        dob: "1995-05-15", // Fecha de nacimiento
        height: 165, // cm
        history: "Ninguno",
        activityLevel: 1.375,
        goal: "Pérdida de Grasa"
    });

    // Consultation Data (Datos de la consulta)
    const [consultation, setConsultation] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: 68.5, // kg

        // Circumferences (cm)
        waist: 72,
        hip: 98,
        armFlexed: 28,
        calfCirc: 36,

        // Skinfolds (mm)
        triceps: 15,
        subscapular: 12,
        biceps: 8,
        suprailiac: 10,
        supraospinale: 10, // For somatotype
        calfFold: 10, // For somatotype

        // Diameters (cm)
        humerus: 6.5,
        femur: 9.0,

        // Hydration
        preWeight: 70,
        postWeight: 69.2,
        liquidConsumed: 0.5, // Liters
        urineOutput: 0, // Liters
        exerciseTime: 60 // Minutes
    });

    // Calculated Results
    const [results, setResults] = useState({
        age: 0,
        bmi: 0,
        bmiStatus: '',
        healthyWeightMin: 0,
        healthyWeightMax: 0,
        whr: 0,
        whrRisk: '',
        fatPercentageBMI: 0, // Deurenberg
        fatPercentageSkinfolds: 0, // Durnin & Womersley + Siri
        bmrMifflin: 0,
        tdeeRest: 0,
        tdeeModerate: 0,
        tdeeIntense: 0,
        somatotype: { endo: 0, meso: 0, ecto: 0 },
        sweatRate: 0
    });

    // Gemini API State
    const [diagnosticSummary, setDiagnosticSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    // --- CALCULATIONS ---

    const calculateAll = () => {
        // 1. Age
        const birthDate = new Date(patient.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // 2. BMI & Healthy Range
        const heightM = patient.height / 100;
        const bmiVal = consultation.weight / (heightM * heightM);

        const healthyMin = 18.5 * (heightM * heightM);
        const healthyMax = 24.9 * (heightM * heightM);

        let bmiStatus = '';
        if (bmiVal < 18.5) bmiStatus = 'Bajo Peso';
        else if (bmiVal < 24.9) bmiStatus = 'Normal';
        else if (bmiVal < 29.9) bmiStatus = 'Sobrepeso';
        else bmiStatus = 'Obesidad';

        // 3. WHR
        // Cálculo WHR: Cintura / Cadera
        const whrVal = consultation.waist / consultation.hip;
        // Puntos de corte para riesgo (M: > 0.9, F: > 0.85)
        const whrRisk = whrVal > (patient.gender === 'M' ? 0.9 : 0.85) ? 'Alto' : 'Bajo';

        // 4. Body Fat (Deurenberg - BMI Method)
        // Formula: 1.2 * BMI + 0.23 * Age - 10.8 * Sex - 5.4 (Sex: M=1, F=0)
        const sexFactor = patient.gender === 'M' ? 1 : 0;
        const fatBMI = (1.2 * bmiVal) + (0.23 * age) - (10.8 * sexFactor) - 5.4;

        // 5. Body Fat (Durnin & Womersley -> Siri)
        // Log10 of sum of 4 folds (Tri, Bic, Sub, Sup)
        const sum4 = consultation.triceps + consultation.biceps + consultation.subscapular + consultation.suprailiac;
        const logSum = Math.log10(sum4);

        // Coeficientes (Simplificado de tablas estándar)
        let c = 0, m_koeff = 0;
        if (patient.gender === 'M') {
            if (age < 17) { c = 1.1533; m_koeff = 0.0643; }
            else if (age < 20) { c = 1.1620; m_koeff = 0.0630; }
            else if (age < 30) { c = 1.1631; m_koeff = 0.0632; }
            else if (age < 40) { c = 1.1422; m_koeff = 0.0544; }
            else if (age < 50) { c = 1.1620; m_koeff = 0.0700; }
            else { c = 1.1715; m_koeff = 0.0779; }
        } else {
            if (age < 17) { c = 1.1369; m_koeff = 0.0598; }
            else if (age < 20) { c = 1.1549; m_koeff = 0.0678; }
            else if (age < 30) { c = 1.1599; m_koeff = 0.0717; }
            else if (age < 40) { c = 1.1423; m_koeff = 0.0632; }
            else if (age < 50) { c = 1.1333; m_koeff = 0.0612; }
            else { c = 1.1339; m_koeff = 0.0645; }
        }

        const density = c - (m_koeff * logSum);
        // Fórmula de Siri para % Grasa: ((4.95 / Densidad) - 4.5) * 100
        const fatSkinfolds = ((4.95 / density) - 4.5) * 100;

        // 6. BMR (Mifflin-St Jeor)
        // Hombres: (10 × W) + (6.25 × H) - (5 × A) + 5
        // Mujeres: (10 × W) + (6.25 × H) - (5 × A) - 161
        let bmrM = (10 * consultation.weight) + (6.25 * patient.height) - (5 * age);
        bmrM = patient.gender === 'M' ? bmrM + 5 : bmrM - 161;

        // 7. TDEE Scenarios
        const tdeeRest = bmrM * 1.2;
        const tdeeMod = bmrM * 1.55;
        const tdeeIntense = bmrM * 1.725;

        // 8. Somatotype (Heath-Carter)
        // Endomorphy
        const sum3 = consultation.triceps + consultation.subscapular + consultation.supraospinale;
        const x_corr = sum3 * (170.18 / patient.height);
        const endo = -0.7182 + (0.1451 * x_corr) - (0.00068 * Math.pow(x_corr, 2)) + (0.0000014 * Math.pow(x_corr, 3));

        // Mesomorphy
        const e_humerus = consultation.humerus;
        const f_femur = consultation.femur;
        const a_arm_corr = consultation.armFlexed - (consultation.triceps / 10);
        const c_calf_corr = consultation.calfCirc - (consultation.calfFold / 10);

        const meso = (0.858 * e_humerus) + (0.601 * f_femur) + (0.188 * a_arm_corr) + (0.161 * c_calf_corr) - (0.131 * patient.height) + 4.5;

        // Ectomorphy
        const hnr = patient.height / Math.pow(consultation.weight, 0.3333);
        let ecto = 0;
        if (hnr >= 40.75) ecto = (0.732 * hnr) - 28.58;
        else if (hnr > 38.25) ecto = (0.463 * hnr) - 17.63;
        else ecto = 0.1;

        // 9. Hydration (Sweat Rate)
        // Rate = (Peso Pre - Peso Post + Líquido Consumido - Orina Producida) / (Tiempo de Ejercicio / 60)
        const sweatRateVal = ((consultation.preWeight - consultation.postWeight) + consultation.liquidConsumed - consultation.urineOutput) / (consultation.exerciseTime / 60);

        setResults({
            age,
            bmi: bmiVal.toFixed(1),
            bmiStatus,
            healthyWeightMin: healthyMin.toFixed(1),
            healthyWeightMax: healthyMax.toFixed(1),
            whr: whrVal.toFixed(2),
            whrRisk,
            fatPercentageBMI: fatBMI.toFixed(1),
            fatPercentageSkinfolds: isNaN(fatSkinfolds) || fatSkinfolds < 0 ? 0 : fatSkinfolds.toFixed(1), // Evita valores negativos o NaN
            bmrMifflin: Math.round(bmrM),
            tdeeRest: Math.round(tdeeRest),
            tdeeModerate: Math.round(tdeeMod),
            tdeeIntense: Math.round(tdeeIntense),
            somatotype: {
                endo: isNaN(endo) ? 0 : endo.toFixed(1),
                meso: isNaN(meso) ? 0 : meso.toFixed(1),
                ecto: isNaN(ecto) ? 0 : ecto.toFixed(1)
            },
            sweatRate: isNaN(sweatRateVal) ? 0 : sweatRateVal.toFixed(2)
        });
    };

    // Efecto para calcular métricas automáticamente cuando cambian los inputs
    useEffect(() => {
        calculateAll();
    }, [patient, consultation]);

    const handlePatientChange = (e) => {
        const { name, value } = e.target;
        setPatient(prev => ({ ...prev, [name]: value }));
    };

    const handleConsultationChange = (e) => {
        const { name, value } = e.target;
        setConsultation(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    // --- GEMINI API FUNCTION: Genera Resumen de Diagnóstico ---

    const generateDiagnosticSummary = async () => {
        setIsLoadingSummary(true);
        setDiagnosticSummary('');

        const userQuery = `Actúa como un Nutriólogo Clínico profesional y redacta un resumen de diagnóstico conciso y basado en evidencia. Utiliza los siguientes datos del paciente para redactar el resumen. Enfócate en la interpretación de IMC, Riesgo de WHR, Somatotipo y Requerimiento Calórico (TDEE). El objetivo principal del paciente es: ${patient.goal}.
        
        Datos Clínicos:
        - Sexo: ${patient.gender === 'F' ? 'Femenino' : 'Masculino'}
        - Edad: ${results.age} años
        - IMC: ${results.bmi} kg/m² (${results.bmiStatus})
        - Riesgo WHR (Índice Cintura/Cadera): ${results.whrRisk} (${results.whr})
        - % Grasa (Durnin/Siri): ${results.fatPercentageSkinfolds}%
        - Gasto Energético Total Estimado (TDEE Moderado): ${results.tdeeModerate} kcal
        - Somatotipo (Heath-Carter): Endomorfo ${results.somatotype.endo}, Mesomorfo ${results.somatotype.meso}, Ectomorfo ${results.somatotype.ecto}.`;

        const systemPrompt = "Eres un asistente de diagnóstico nutricional. Tu respuesta debe ser un párrafo profesional, directo, bien estructurado y en español, sin saludos ni despedidas, listo para ser copiado en un expediente clínico. No debes inventar datos, solo interpretar los proporcionados.";

        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const response = await fetchWithExponentialBackoff(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const text = processGeminiResponse(result);
            setDiagnosticSummary(text);

        } catch (error) {
            setDiagnosticSummary("Error al conectar con la IA para generar el resumen. Por favor, revise la conexión.");
            console.error("Gemini API call failed:", error);
        } finally {
            setIsLoadingSummary(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-[#003844]">
            {/* Sidebar - Usando la paleta profesional */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#96DFCD] rounded-lg flex items-center justify-center">
                        <Activity className="text-[#003844] w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl text-[#003844] tracking-tight">Kado App</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <NavItem icon={<Users size={20} />} label="Pacientes" active color="#96DFCD" />
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

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header Superior */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold text-[#003844]">Evaluación Avanzada</h1>
                        <span className="px-3 py-1 bg-[#96DFCD] text-[#003844] rounded-full text-xs font-bold">
                            Consulta Activa
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar paciente..."
                                className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#96DFCD] w-64 transition-all"
                            />
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Tarjeta del Paciente y Resumen */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="w-16 h-16 rounded-full bg-slate-100 text-[#003844] flex items-center justify-center text-xl font-bold border-2 border-[#96DFCD]">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#003844]">{patient.name}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                                    <span>{results.age} años</span>
                                    <span>•</span>
                                    <span>{patient.gender === 'F' ? 'Femenino' : 'Masculino'}</span>
                                    <span>•</span>
                                    <span className="text-[#003844] font-semibold">{patient.goal}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right px-4 border-l border-slate-200">
                                <p className="text-xs text-slate-400">Peso Actual</p>
                                <p className="font-bold text-lg text-[#003844]">{consultation.weight} kg</p>
                            </div>
                            <div className="text-right px-4 border-l border-slate-200">
                                <p className="text-xs text-slate-400">Talla</p>
                                <p className="font-bold text-lg text-[#003844]">{patient.height} cm</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Columna Izquierda: Entradas de Datos (7/12) */}
                        <div className="lg:col-span-7 space-y-8">

                            {/* 1. Datos del Paciente (Editables) */}
                            <Section title="Datos Base del Paciente" icon={<FileText size={18} />}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <TextInput label="Nombre Completo" name="name" value={patient.name} onChange={handlePatientChange} />
                                    <SelectInput label="Sexo" name="gender" value={patient.gender} onChange={handlePatientChange}>
                                        <option value="F">Femenino</option>
                                        <option value="M">Masculino</option>
                                    </SelectInput>
                                    <TextInput label="Fecha Nacimiento" type="date" name="dob" value={patient.dob} onChange={handlePatientChange} />
                                    <NumberInput label="Estatura (cm)" name="height" value={patient.height} onChange={(e) => setPatient({ ...patient, height: parseFloat(e.target.value) })} />
                                    <div className="col-span-1 sm:col-span-2">
                                        <TextInput label="Historial Clínico Resumido" name="history" value={patient.history} onChange={handlePatientChange} />
                                    </div>
                                </div>
                            </Section>

                            {/* 2. Datos de Consulta */}
                            <Section title="Antropometría" icon={<Activity size={18} />}>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <NumberInput label="Peso (kg)" name="weight" value={consultation.weight} onChange={handleConsultationChange} step="0.1" />
                                    <NumberInput label="Cintura (cm)" name="waist" value={consultation.waist} onChange={handleConsultationChange} />
                                    <NumberInput label="Cadera (cm)" name="hip" value={consultation.hip} onChange={handleConsultationChange} />
                                    <NumberInput label="Brazo Flex (cm)" name="armFlexed" value={consultation.armFlexed} onChange={handleConsultationChange} />
                                    <NumberInput label="Pantorrilla (cm)" name="calfCirc" value={consultation.calfCirc} onChange={handleConsultationChange} />
                                </div>
                            </Section>

                            {/* 3. Pliegues y Diámetros */}
                            <Section title="Pliegues (mm) y Diámetros (cm)" icon={<Settings size={18} />}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <NumberInput label="Tríceps" name="triceps" value={consultation.triceps} onChange={handleConsultationChange} />
                                    <NumberInput label="Subescapular" name="subscapular" value={consultation.subscapular} onChange={handleConsultationChange} />
                                    <NumberInput label="Bíceps" name="biceps" value={consultation.biceps} onChange={handleConsultationChange} />
                                    <NumberInput label="Suprailíaco" name="suprailiac" value={consultation.suprailiac} onChange={handleConsultationChange} />
                                    <NumberInput label="Supraespinal" name="supraospinale" value={consultation.supraospinale} onChange={handleConsultationChange} />
                                    <NumberInput label="Pliegue Pant." name="calfFold" value={consultation.calfFold} onChange={handleConsultationChange} />
                                    <NumberInput label="Diám. Húmero" name="humerus" value={consultation.humerus} onChange={handleConsultationChange} step="0.1" />
                                    <NumberInput label="Diám. Fémur" name="femur" value={consultation.femur} onChange={handleConsultationChange} step="0.1" />
                                </div>
                            </Section>

                            {/* 4. Hidratación */}
                            <Section title="Test de Sudoración (Post-ejercicio)" icon={<Droplet size={18} />}>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <NumberInput label="Peso Pre (kg)" name="preWeight" value={consultation.preWeight} onChange={handleConsultationChange} step="0.1" />
                                    <NumberInput label="Peso Post (kg)" name="postWeight" value={consultation.postWeight} onChange={handleConsultationChange} step="0.1" />
                                    <NumberInput label="Líquido (L)" name="liquidConsumed" value={consultation.liquidConsumed} onChange={handleConsultationChange} step="0.1" />
                                    <NumberInput label="Orina (L)" name="urineOutput" value={consultation.urineOutput} onChange={handleConsultationChange} step="0.1" />
                                    <NumberInput label="Tiempo (min)" name="exerciseTime" value={consultation.exerciseTime} onChange={handleConsultationChange} />
                                    <div className="flex items-end pb-2">
                                        <div className="flex flex-col">
                                            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Tasa Calculada</label>
                                            <span className="font-bold text-[#003844] text-xl">{results.sweatRate} L/hr</span>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                        </div>

                        {/* Columna Derecha: Cálculos en Tiempo Real (5/12) */}
                        <div className="lg:col-span-5 space-y-6">

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
                                    onClick={generateDiagnosticSummary}
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


                            <button className="w-full bg-[#003844] hover:bg-[#002830] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xl shadow-[#003844]/20">
                                <Save size={18} /> GUARDAR EVALUACIÓN CLÍNICA
                            </button>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- COMPONENTES AUXILIARES ---

const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <span className="text-[#003844]">{icon}</span>
            <h3 className="font-semibold text-[#003844]">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const TextInput = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
        <input
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#96DFCD] focus:border-[#003844] outline-none transition-all text-sm font-medium text-[#003844]"
            {...props}
        />
    </div>
);

const NumberInput = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide truncate" title={label}>{label}</label>
        <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#96DFCD] focus:border-[#003844] outline-none transition-all text-sm font-medium text-[#003844]"
            {...props}
        />
    </div>
);

const SelectInput = ({ label, children, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
        <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#96DFCD] focus:border-[#003844] outline-none transition-all text-sm font-medium text-[#003844] bg-white"
            {...props}
        >
            {children}
        </select>
    </div>
);

const NavItem = ({ icon, label, active }) => (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? `bg-[#96DFCD]/10 text-[#003844] font-medium ring-1 ring-[#96DFCD]` : 'text-slate-500 hover:bg-slate-50'}`}>
        {React.cloneElement(icon, { size: 20, className: active ? 'text-[#003844]' : 'text-slate-400' })}
        <span className="text-sm">{label}</span>
        {active && <ChevronRight size={16} className="ml-auto text-[#003844]" />}
    </a>
);

const ResultRow = ({ label, value, unit, status, statusColor = 'text-[#96DFCD]' }) => (
    <div className="flex justify-between items-end">
        <div>
            <p className="text-xs text-slate-300 mb-0.5">{label}</p>
            {status && <p className={`text-xs font-medium ${statusColor}`}>{status}</p>}
        </div>
        <div className="text-right">
            <span className="text-xl font-bold tracking-tight text-white">{value}</span>
            {unit && <span className="text-xs text-slate-400 ml-1">{unit}</span>}
        </div>
    </div>
);

const TdeeRow = ({ label, kcal, highlight }) => (
    <div className={`flex justify-between items-center p-2 rounded ${highlight ? 'bg-[#96DFCD] border border-[#96DFCD]/30 shadow-sm' : ''}`}>
        <span className={`text-sm ${highlight ? 'text-[#003844] font-semibold' : 'text-slate-600'}`}>{label}</span>
        <span className="font-bold text-[#003844]">{kcal} kcal</span>
    </div>
);

const SomatoBox = ({ label, value, color }) => (
    <div className={`p-2 rounded-lg ${color} flex flex-col items-center justify-center`}>
        <span className="block text-2xl font-bold">{value}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
);

export default KadoApp;