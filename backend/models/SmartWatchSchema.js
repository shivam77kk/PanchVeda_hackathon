import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
    heartRate: Number,
    bloodPressure: {
        systolic: Number,
        diastolic: Number,
    },
    oxygenSaturation: Number,
    respiratoryRate: Number,
});

const sleepSchema = new mongoose.Schema({
    sleepDuration: Number, 
    sleepQuality: String,
    startTime: Date,
    endTime: Date,
});

const activitySchema = new mongoose.Schema({
    steps: Number,
    distance: Number, 
    caloriesBurned: Number,
});

const bodyDataSchema = new mongoose.Schema({
    weight: Number, 
    bmi: Number,
});


const smartwatchDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, 
    },

    vitals: vitalsSchema,
    sleep: sleepSchema,
    activity: activitySchema,
    bodyData: bodyDataSchema,

    source: {
        type: String,
        required: true,
        enum: ['Google Fit', 'Manual Entry'], 
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true, 
    }
}, { timestamps: true });

const SmartwatchData = mongoose.model('SmartwatchData', smartwatchDataSchema);

export default SmartwatchData;
