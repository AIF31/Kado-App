/**
 * Service for managing Patient data.
 * Retrieves from LocalStorage or returns defaults.
 */

const DEFAULT_PATIENT = {
    name: "Ana García",
    gender: "F",
    dob: "1995-05-15",
    height: 165,
    history: "Ninguno",
    activityLevel: 1.375,
    goal: "Pérdida de Grasa"
};

const DEFAULT_CONSULTATION = {
    date: new Date().toISOString().split('T')[0],
    weight: 68.5,
    waist: 72,
    hip: 98,
    armFlexed: 28,
    calfCirc: 36,
    triceps: 15,
    subscapular: 12,
    biceps: 8,
    suprailiac: 10,
    supraospinale: 10,
    calfFold: 10,
    humerus: 6.5,
    femur: 9.0,
    preWeight: 70,
    postWeight: 69.2,
    liquidConsumed: 0.5,
    urineOutput: 0,
    exerciseTime: 60
};

export const getPatientData = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const storedPatient = localStorage.getItem('kado_patient');
    const storedConsultation = localStorage.getItem('kado_consultation');

    return {
        patient: storedPatient ? JSON.parse(storedPatient) : DEFAULT_PATIENT,
        consultation: storedConsultation ? JSON.parse(storedConsultation) : DEFAULT_CONSULTATION
    };
};
