import { ConsentTemplate, ConsentSignature } from "../models/ConsentSchemas.js";

export const createConsentTemplate = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { name, treatmentName, content, version = '1.0', language = 'en' } = req.body;
    if (!name || !treatmentName || !content) return res.status(400).json({ message: 'name, treatmentName and content are required' });

    const tpl = new ConsentTemplate({ name, treatmentName, content, version, language, createdBy: req.user.id });
    await tpl.save();
    res.status(201).json({ message: 'Template created', template: tpl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listConsentTemplates = async (req, res) => {
  try {
    const { treatmentName } = req.query;
    const query = treatmentName ? { treatmentName } : {};
    const templates = await ConsentTemplate.find(query).sort({ createdAt: -1 });
    res.status(200).json({ templates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConsentTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const tpl = await ConsentTemplate.findById(id);
    res.status(200).json({ template: tpl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signConsent = async (req, res) => {
  try {
    if (req.user.role !== 'patient') return res.status(403).json({ message: 'Patient access required' });
    const { templateId, signedByName, signatureHash, doctorId } = req.body;
    if (!templateId || !signedByName || !signatureHash || !doctorId) return res.status(400).json({ message: 'templateId, signedByName, signatureHash, doctorId required' });

    const sig = new ConsentSignature({ templateId, patientId: req.user.id, doctorId, signedByName, signatureHash });
    await sig.save();
    res.status(201).json({ message: 'Consent signed', consent: sig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listMyConsents = async (req, res) => {
  try {
    const consents = await ConsentSignature.find({ patientId: req.user.id }).sort({ signedAt: -1 });
    res.status(200).json({ consents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
