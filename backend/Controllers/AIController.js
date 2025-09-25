import fetch from "node-fetch";
import SmartwatchData from "../models/SmartWatchSchema.js";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  const url = `${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gemini error ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
};

export const recommendPlan = async (req, res) => {
  try {
    const { patientProfile, diseaseSeverity, goals } = req.body;
    const userId = req.body.userId || req.user?.id; // allow doctor to pass

    // Pull recent smartwatch trend if available
    let vitalsSummary = "No smartwatch data.";
    if (userId) {
      const latest = await SmartwatchData.findOne({ userId }).sort({ timestamp: -1 });
      if (latest) {
        vitalsSummary = `HR:${latest?.vitals?.heartRate || "-"}, BP:${latest?.vitals?.bloodPressure?.systolic || "-"}/${latest?.vitals?.bloodPressure?.diastolic || "-"}, SpO2:${latest?.vitals?.oxygenSaturation || "-"}`;
      }
    }

    const prompt = `You are an Ayurvedic doctor. Create a day-by-day Panchakarma plan (7-14 days). Include therapies per day and short instructions. Patient profile: ${JSON.stringify(patientProfile)}. Disease severity: ${diseaseSeverity}. Goals: ${goals}. Latest vitals: ${vitalsSummary}. Return JSON with {title, days:[{dayNumber, therapies:[{name,instructions}]}]}.`;

    let text;
    try {
      text = await callGemini(prompt);
    } catch (e) {
      // Fallback if Gemini fails
      const fallback = {
        title: "Personalized Panchakarma Plan (Fallback)",
        days: Array.from({ length: 7 }, (_, i) => ({
          dayNumber: i + 1,
          therapies: [
            { name: i === 2 ? "Vamana (Supervised)" : i === 4 ? "Basti" : "Abhyanga + Swedana", instructions: "Hydrate well; light warm meals" }
          ]
        }))
      };
      return res.status(200).json({ recommendation: fallback, note: "Gemini unreachable, returned safe fallback." });
    }

    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    res.status(200).json({ recommendation: json });
  } catch (error) {
    res.status(200).json({ recommendation: {
      title: "Panchakarma Plan (Safe Fallback)",
      days: Array.from({ length: 7 }, (_, i) => ({ dayNumber: i + 1, therapies: [{ name: "Abhyanga + Swedana", instructions: "Light diet, hydrate" }] }))
    }, note: `AI error handled: ${error.message}` });
  }
};

export const predictOutcome = async (req, res) => {
  try {
    const { adherencePercent = 60, symptoms = [], vitals = {} } = req.body;
    const prompt = `Predict therapy outcome probability for a Panchakarma plan. Adherence: ${adherencePercent}%. Symptoms: ${JSON.stringify(symptoms)}. Recent vitals: ${JSON.stringify(vitals)}. Provide a concise explanation and a JSON with {improvementProbabilityPercent, advice}.`;
    let text;
    try {
      text = await callGemini(prompt);
    } catch (e) {
      const base = Math.max(10, Math.min(95, Math.round((Number(adherencePercent) || 60) * 0.8)));
      return res.status(200).json({ prediction: { improvementProbabilityPercent: base, advice: "Maintain adherence, follow diet, rest adequately." }, note: "Gemini unreachable, returned heuristic." });
    }
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { summary: text }; }
    res.status(200).json({ prediction: parsed });
  } catch (error) {
    const base = Math.max(10, Math.min(95, Math.round((Number(req.body?.adherencePercent) || 60) * 0.75)));
    res.status(200).json({ prediction: { improvementProbabilityPercent: base, advice: "Hydrate, light satvik diet, regular sleep." }, note: `AI error handled: ${error.message}` });
  }
};
