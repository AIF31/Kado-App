/**
 * Kado App - Nutrition Calculations Utility
 * Pure functions for clinical nutrition assessment.
 */

// 1. Age Calculation
export const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// 2. BMI & Status
export const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return { value: 0, status: '', healthyMin: 0, healthyMax: 0 };

    const heightM = heightCm / 100;
    const bmiVal = weight / (heightM * heightM);

    const healthyMin = 18.5 * (heightM * heightM);
    const healthyMax = 24.9 * (heightM * heightM);

    let status = '';
    if (bmiVal < 18.5) status = 'Bajo Peso';
    else if (bmiVal < 24.9) status = 'Normal';
    else if (bmiVal < 29.9) status = 'Sobrepeso';
    else status = 'Obesidad';

    return {
        value: parseFloat(bmiVal.toFixed(1)),
        status,
        healthyMin: parseFloat(healthyMin.toFixed(1)),
        healthyMax: parseFloat(healthyMax.toFixed(1))
    };
};

// 3. WHR (Waist-Hip Ratio)
export const calculateWHR = (waist, hip, gender) => {
    if (!waist || !hip) return { value: 0, risk: '' };

    const whrVal = waist / hip;
    const threshold = gender === 'M' ? 0.9 : 0.85;
    const risk = whrVal > threshold ? 'Alto' : 'Bajo';

    return {
        value: parseFloat(whrVal.toFixed(2)),
        risk
    };
};

// 4. Body Fat (Deurenberg - BMI Method) 
export const calculateFatBMI = (bmi, age, gender) => {
    // Formula: 1.2 * BMI + 0.23 * Age - 10.8 * Sex - 5.4 (Sex: M=1, F=0)
    const sexFactor = gender === 'M' ? 1 : 0;
    const fat = (1.2 * bmi) + (0.23 * age) - (10.8 * sexFactor) - 5.4;
    return parseFloat(fat.toFixed(1));
};

// 5. Body Fat (Durnin & Womersley -> Siri)
export const calculateFatSkinfolds = (skinfolds, age, gender) => {
    const { triceps, biceps, subscapular, suprailiac } = skinfolds;
    const sum4 = triceps + biceps + subscapular + suprailiac;

    if (sum4 <= 0) return 0;

    const logSum = Math.log10(sum4);

    // Coefficients
    let c = 0, m_koeff = 0;
    if (gender === 'M') {
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
    // Siri Formula: ((4.95 / Densidad) - 4.5) * 100
    const fatRaw = ((4.95 / density) - 4.5) * 100;

    return (isNaN(fatRaw) || fatRaw < 0) ? 0 : parseFloat(fatRaw.toFixed(1));
};

// 6. BMR (Mifflin-St Jeor)
export const calculateBMR = (weight, heightCm, age, gender) => {
    // M: (10 × W) + (6.25 × H) - (5 × A) + 5
    // F: (10 × W) + (6.25 × H) - (5 × A) - 161
    let bmr = (10 * weight) + (6.25 * heightCm) - (5 * age);
    bmr = gender === 'M' ? bmr + 5 : bmr - 161;
    return Math.round(bmr);
};

// 7. TDEE
export const calculateTDEE = (bmr) => {
    return {
        rest: Math.round(bmr * 1.2),
        moderate: Math.round(bmr * 1.55),
        intense: Math.round(bmr * 1.725)
    };
};

// 8. Somatotype (Heath-Carter)
export const calculateSomatotype = (consultation, heightCm, weight) => {
    // Endomorphy
    const sum3 = consultation.triceps + consultation.subscapular + consultation.supraospinale;
    const x_corr = sum3 * (170.18 / heightCm);
    const endo = -0.7182 + (0.1451 * x_corr) - (0.00068 * Math.pow(x_corr, 2)) + (0.0000014 * Math.pow(x_corr, 3));

    // Mesomorphy
    const e_humerus = consultation.humerus;
    const f_femur = consultation.femur;
    const a_arm_corr = consultation.armFlexed - (consultation.triceps / 10);
    const c_calf_corr = consultation.calfCirc - (consultation.calfFold / 10);

    const meso = (0.858 * e_humerus) + (0.601 * f_femur) + (0.188 * a_arm_corr) + (0.161 * c_calf_corr) - (0.131 * heightCm) + 4.5;

    // Ectomorphy
    const hnr = heightCm / Math.pow(weight, 0.3333);
    let ecto = 0;
    if (hnr >= 40.75) ecto = (0.732 * hnr) - 28.58;
    else if (hnr > 38.25) ecto = (0.463 * hnr) - 17.63;
    else ecto = 0.1;

    return {
        endo: isNaN(endo) ? 0 : parseFloat(endo.toFixed(1)),
        meso: isNaN(meso) ? 0 : parseFloat(meso.toFixed(1)),
        ecto: isNaN(ecto) ? 0 : parseFloat(ecto.toFixed(1))
    };
};

// 9. Hydration
export const calculateSweatRate = (pre, post, liquid, urine, timeMin) => {
    if (!timeMin) return 0;
    const val = ((pre - post) + liquid - urine) / (timeMin / 60);
    return isNaN(val) ? 0 : parseFloat(val.toFixed(2));
};
