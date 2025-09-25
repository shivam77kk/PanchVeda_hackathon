import PrepResource from "../models/PrepResourceSchema.js";

export const createOrUpdatePrep = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { therapyName, language = 'en', videoUrl = '', checklist = [] } = req.body;
    if (!therapyName) return res.status(400).json({ message: 'therapyName is required' });

    const doc = await PrepResource.findOneAndUpdate(
      { therapyName, language },
      { therapyName, language, videoUrl, checklist, createdBy: req.user.id },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Preparation saved', prep: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrep = async (req, res) => {
  try {
    const { therapyName } = req.params;
    const { language = 'en' } = req.query;
    const doc = await PrepResource.findOne({ therapyName, language });
    res.status(200).json({ prep: doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listPrep = async (req, res) => {
  try {
    const { language } = req.query;
    const query = language ? { language } : {};
    const items = await PrepResource.find(query).sort({ therapyName: 1 });
    res.status(200).json({ prepItems: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
