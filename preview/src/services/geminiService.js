/**
 * Service for interacting with Google Gemini API
 */

const fetchWithExponentialBackoff = async (url, options, maxRetries = 5) => {
    let delay = 1000;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            if (i === maxRetries - 1) {
                console.error("Max retries reached. Failing request.", error);
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
    throw new Error("Failed to fetch after multiple retries.");
};

export const generateDiagnosticSummary = async (patient, results, apiKey = "") => {
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
        const candidate = result.candidates?.[0];
        if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text;
        }
        throw new Error("Respuesta incompleta de la API");
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw error;
    }
};
