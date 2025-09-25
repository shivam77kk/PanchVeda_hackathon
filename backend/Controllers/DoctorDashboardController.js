import TreatmentPlan from "../models/TreatmentPlanSchema.js";
import User from "../models/UserSchema.js";

const computeProgress = (plan) => {
  const total = plan.days?.length || 0;
  const done = plan.days?.filter(d => d.completed)?.length || 0;
  return total ? Math.round((done / total) * 100) : 0;
};

export const getDoctorPatientPlansSummary = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const plans = await TreatmentPlan.find({ doctorId: req.user.id }).sort({ updatedAt: -1 });
    const patientIds = plans.map(p => p.patientId);
    const users = await User.find({ _id: { $in: patientIds } }, 'name email profileImage');
    const userMap = new Map(users.map(u => [String(u._id), u]));

    const data = plans.map(p => ({
      planId: p._id,
      title: p.title,
      startDate: p.startDate,
      endDate: p.days?.length ? p.days[p.days.length - 1].date : undefined,
      progress: computeProgress(p),
      patient: userMap.get(String(p.patientId)) || { _id: p.patientId }
    }));

    res.status(200).json({ patients: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanDailySchedule = async (req, res) => {
  try {
    const { id } = req.params; // plan id
    const dateStr = req.query.date; // YYYY-MM-DD
    const plan = await TreatmentPlan.findById(id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const date = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(plan.startDate);
    const dayNumber = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / (24*60*60*1000)) + 1;

    const day = plan.days.find(d => d.dayNumber === dayNumber);
    const schedule = (day?.therapies || []).map(t => ({ time: t.time || '', name: t.name, instructions: t.instructions, completed: !!day?.completed }));

    res.status(200).json({ dayNumber, schedule, completed: !!day?.completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanPhases = async (req, res) => {
  try {
    const { id } = req.params; // plan id
    const plan = await TreatmentPlan.findById(id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const phases = { Purvakarma: [], Pradhankarma: [], Paschatkarma: [], Other: [] };

    for (const d of plan.days) {
      const items = d.therapies?.length ? d.therapies : [];
      for (const t of items) {
        const key = ['Purvakarma','Pradhankarma','Paschatkarma'].includes(t.phase) ? t.phase : 'Other';
        phases[key].push({ dayNumber: d.dayNumber, name: t.name, completed: !!d.completed, date: d.date });
      }
    }

    const progress = Object.fromEntries(Object.entries(phases).map(([k,v]) => {
      const total = v.length; const done = v.filter(x=>x.completed).length; const pct = total ? Math.round(done*100/total) : 0; return [k,{total,done,percent:pct}];
    }));

    res.status(200).json({ phases, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
