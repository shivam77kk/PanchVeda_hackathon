import UserSettings from "../models/UserSettingsSchema.js";

export const getMySettings = async (req, res) => {
  try {
    const s = await UserSettings.findOne({ userId: req.user.id });
    res.status(200).json({ settings: s });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMySettings = async (req, res) => {
  try {
    const updates = req.body || {};
    const s = await UserSettings.findOneAndUpdate(
      { userId: req.user.id },
      { ...updates },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Settings saved', settings: s });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
