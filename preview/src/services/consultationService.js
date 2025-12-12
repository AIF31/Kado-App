/**
 * Service for managing consultation data.
 * Currently mocks backend interaction.
 */

// Simulate an API call
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const saveConsultation = async (patient, consultation, results, diagnosticSummary) => {
    console.log("Saving consultation...", { patient, consultation, results, diagnosticSummary });

    // Simulate network delay
    await delay(800);

    // Persistence: Save to LocalStorage
    try {
        localStorage.setItem('kado_patient', JSON.stringify(patient));
        localStorage.setItem('kado_consultation', JSON.stringify(consultation));
        console.log("Saved to LocalStorage");
    } catch (e) {
        console.error("Error saving to LocalStorage", e);
    }

    // In a real app, this would be:
    // await axios.post('/api/consultations', { ...data });

    return {
        success: true,
        message: "Consulta guardada exitosamente",
        id: Date.now() // Mock ID
    };
};
