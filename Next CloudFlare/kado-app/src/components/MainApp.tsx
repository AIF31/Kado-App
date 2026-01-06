"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { PatientCard } from "../features/patient/PatientCard";
import { PatientForm } from "../features/patient/PatientForm";
import { ConsultationForm } from "../features/consultation/ConsultationForm";
import { DiagnosticSummary } from "../features/dashboard/DiagnosticSummary";
import { generateDiagnosticSummary } from "../services/geminiService";
import { saveConsultation } from "../services/consultationService";
import { getPatientData } from "../services/patientService";
import {
    calculateAge,
    calculateBMI,
    calculateWHR,
    calculateFatBMI,
    calculateFatSkinfolds,
    calculateBMR,
    calculateTDEE,
    calculateSomatotype,
    calculateSweatRate,
} from "../utils/nutritionCalculations";

export const MainApp = () => {
    // --- STATE ---

    // Patient Data
    const [patient, setPatient] = useState({
        name: "",
        gender: "M",
        dob: "",
        height: 0,
        history: "",
        activityLevel: 1.375,
        goal: "",
    });

    // Consultation Data
    const [consultation, setConsultation] = useState({
        date: new Date().toISOString().split("T")[0],
        weight: 0,
        waist: 0,
        hip: 0,
        armFlexed: 0,
        calfCirc: 0,
        triceps: 0,
        subscapular: 0,
        biceps: 0,
        suprailiac: 0,
        supraospinale: 0,
        calfFold: 0,
        humerus: 0,
        femur: 0,
        preWeight: 0,
        postWeight: 0,
        liquidConsumed: 0,
        urineOutput: 0,
        exerciseTime: 0,
    });

    // Calculated Results
    const [results, setResults] = useState({
        age: 0,
        bmi: 0,
        bmiStatus: "",
        healthyWeightMin: 0,
        healthyWeightMax: 0,
        whr: 0,
        whrRisk: "",
        fatPercentageBMI: 0,
        fatPercentageSkinfolds: 0,
        bmrMifflin: 0,
        tdeeRest: 0,
        tdeeModerate: 0,
        tdeeIntense: 0,
        somatotype: { endo: 0, meso: 0, ecto: 0 },
        sweatRate: 0,
    });

    // Gemini API State
    const [diagnosticSummary, setDiagnosticSummary] = useState("");
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    // Save State
    const [isSaving, setIsSaving] = useState(false);

    // --- LOAD INITIAL DATA ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const { patient, consultation } = await getPatientData();
                setPatient(patient);
                setConsultation(consultation);
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        loadData();
    }, []);

    // --- CALCULATIONS EFFECT ---
    useEffect(() => {
        const age = calculateAge(patient.dob);
        const bmi = calculateBMI(consultation.weight, patient.height);
        const whr = calculateWHR(consultation.waist, consultation.hip, patient.gender);
        const fatBMI = calculateFatBMI(bmi.value, age, patient.gender);
        const fatSkinfolds = calculateFatSkinfolds(
            {
                triceps: consultation.triceps,
                biceps: consultation.biceps,
                subscapular: consultation.subscapular,
                suprailiac: consultation.suprailiac,
            },
            age,
            patient.gender
        );
        const bmr = calculateBMR(consultation.weight, patient.height, age, patient.gender);
        const tdee = calculateTDEE(bmr);
        const somatotype = calculateSomatotype(
            consultation,
            patient.height,
            consultation.weight
        );
        const sweatRate = calculateSweatRate(
            consultation.preWeight,
            consultation.postWeight,
            consultation.liquidConsumed,
            consultation.urineOutput,
            consultation.exerciseTime
        );

        setResults({
            age,
            bmi: bmi.value,
            bmiStatus: bmi.status,
            healthyWeightMin: bmi.healthyMin,
            healthyWeightMax: bmi.healthyMax,
            whr: whr.value,
            whrRisk: whr.risk,
            fatPercentageBMI: fatBMI,
            fatPercentageSkinfolds: fatSkinfolds,
            bmrMifflin: bmr,
            tdeeRest: tdee.rest,
            tdeeModerate: tdee.moderate,
            tdeeIntense: tdee.intense,
            somatotype,
            sweatRate,
        });
    }, [patient, consultation]);

    // --- HANDLERS ---
    const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConsultation((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleGenerateSummary = async () => {
        setIsLoadingSummary(true);
        setDiagnosticSummary("");
        try {
            // In a real app, API Key should come from env or user settings
            const summary = await generateDiagnosticSummary(patient, results, "");
            setDiagnosticSummary(summary);
        } catch (error) {
            setDiagnosticSummary(
                "Error al generar el resumen. Por favor intente de nuevo."
            );
        } finally {
            setIsLoadingSummary(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await saveConsultation(
                patient,
                consultation,
                results,
                diagnosticSummary
            );
            if (response.success) {
                alert("¡Consulta guardada exitosamente!");
            }
        } catch (error) {
            alert("Error al guardar la consulta.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-[#003844]">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Header />
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                    <PatientCard
                        patient={patient}
                        age={results.age}
                        genderLabel={patient.gender === "F" ? "Femenino" : "Masculino"}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Data Entry */}
                        <div className="lg:col-span-7 space-y-8">
                            <PatientForm
                                patient={patient}
                                onChange={handlePatientChange}
                            />
                            <ConsultationForm
                                consultation={consultation}
                                results={results}
                                onChange={handleConsultationChange}
                            />
                        </div>

                        {/* Right Column: Dashboard & Visualization */}
                        <div className="lg:col-span-5 space-y-6">
                            <DiagnosticSummary
                                results={results}
                                diagnosticSummary={diagnosticSummary}
                                isLoadingSummary={isLoadingSummary}
                                onGenerateSummary={handleGenerateSummary}
                                onSave={handleSave}
                                isSaving={isSaving}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
