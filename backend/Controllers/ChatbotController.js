import fetch from "node-fetch";
import ChatbotSession from "../models/ChatbotSessionSchema.js";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not defined");
  const url = `${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  const resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!resp.ok) throw new Error(`Gemini error ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

export const startSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body || {};
    const session = new ChatbotSession({ userId, planId, messages: [] });
    await session.save();
    res.status(201).json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await ChatbotSession.findOne({ _id: id, userId: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params; // session id
    const { message, mood = "", intake = "", symptoms = "", currentDay = "" } = req.body;
    if (!message) return res.status(400).json({ message: "message is required" });

    const session = await ChatbotSession.findOne({ _id: id, userId: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.messages.push({ role: "user", text: message });

    const systemPrompt = `You are a Panchakarma assistant. Determine the patient's Panchakarma stage (Purvakarma, Pradhankarma, or Paschatkarma) from conversation context, mood, intake, symptoms, and day. Ask targeted follow-up questions if needed and provide guidance.
Return strictly JSON: {detectedStage, assistantMessage, followUpQuestions:[...], precautions:[...], recommendedFlow:[{day, therapies:[...]}]}.`;

    const context = session.messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
    const prompt = `${systemPrompt}\n\nContext so far:\n${context}\n\nLatest inputs: mood=${mood}, intake=${intake}, symptoms=${symptoms}, day=${currentDay}.`;

let text;
    try {
      text = await callGemini(prompt);
    } catch (e) {
      const fallback = { detectedStage: "Unknown", assistantMessage: "Based on your inputs, prefer light satvik diet and rest. Do you have nausea, dizziness, or dehydration signs?", followUpQuestions: ["How is your energy level today (0-10)?", "Any side effects after last session?"], precautions: ["Hydrate well", "Avoid heavy/oily food"], recommendedFlow: [] };
      session.messages.push({ role: "assistant", text: fallback.assistantMessage });
      await session.save();
      return res.status(200).json(fallback);
    }

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { detectedStage: "Unknown", assistantMessage: text, followUpQuestions: [], precautions: [], recommendedFlow: [] }; }

    session.detectedStage = parsed.detectedStage || session.detectedStage || "Unknown";
    session.messages.push({ role: "assistant", text: parsed.assistantMessage || text });
    await session.save();

    res.status(200).json(parsed);
  } catch (error) {
    const safe = { detectedStage: "Unknown", assistantMessage: "Please share your current symptoms and mood. I will guide you.", followUpQuestions: ["Any nausea or dizziness?", "What did you eat today?"], precautions: ["Hydrate well", "Light warm meals"], recommendedFlow: [] };
    res.status(200).json(safe);
  }
};
