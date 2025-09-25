import TherapyGuideline from "../models/TherapyGuidelineSchema.js";

export const createOrUpdateGuideline = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { therapyName, language = 'en', preInstructions = [], postInstructions = [] } = req.body;
    if (!therapyName) return res.status(400).json({ message: 'therapyName is required' });

    const doc = await TherapyGuideline.findOneAndUpdate(
      { therapyName, language },
      { therapyName, language, preInstructions, postInstructions, createdBy: req.user.id },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Guideline saved', guideline: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGuideline = async (req, res) => {
  try {
    const { therapyName } = req.params;
    const { language = 'en' } = req.query;
    const doc = await TherapyGuideline.findOne({ therapyName, language });
    res.status(200).json({ guideline: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listGuidelines = async (req, res) => {
  try {
    const { language } = req.query;
    const query = language ? { language } : {};
    const items = await TherapyGuideline.find(query).sort({ therapyName: 1 });
    res.status(200).json({ guidelines: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
