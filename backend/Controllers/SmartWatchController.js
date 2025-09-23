import { google } from "googleapis";
import SmartwatchData from '../models/SmartWatchSchema.js';
import User from '../models/UserSchema.js';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const getAccessToken = async (refreshToken) => {
    try {
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        const { credentials } = await oauth2Client.refreshAccessToken();
        return credentials.access_token;
    } catch (error) {
        console.error("Error refreshing access token:", error.message);
        return null;
    }
};

const fetchGoogleFitData = async (accessToken, dataTypeName) => {
    try {
        const fitness = google.fitness({ version: "v1", auth: accessToken });
        const response = await fitness.users.dataset.aggregate({
            userId: "me",
            requestBody: {
                aggregateBy: [{ dataTypeName: dataTypeName }],
                bucketByTime: { durationMillis: 86400000 }, // daily data
                startTimeMillis: Date.now() - 30 * 24 * 60 * 60 * 1000,
                endTimeMillis: Date.now(),
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${dataTypeName} data:`, error.message);
        return null;
    }
};

export const initiateGoogleFitAuth = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/fitness.activity.read",
            "https://www.googleapis.com/auth/fitness.body.read",
            "https://www.googleapis.com/auth/fitness.sleep.read",
            "https://www.googleapis.com/auth/fitness.heart_rate.read",
            "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
            "https://www.googleapis.com/auth/fitness.blood_pressure.read"
        ],
        state: req.user.id,
    });
    res.redirect(url);
};

export const handleGoogleFitCallback = async (req, res) => {
    try {
        const { code, state: userId } = req.query;
        if (!code || !userId) {
            return res.status(400).json({ message: "Authorization code or user ID is missing." });
        }

        const { tokens } = await oauth2Client.getToken(code);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.googleFitTokens = tokens;
        await user.save();
        
        res.status(200).json({ 
            message: "Google Fit authenticated successfully. Tokens saved." 
        });
    } catch (error) {
        console.error("Error during Google Fit OAuth callback:", error.message);
        res.status(500).json({ message: "Error during authentication.", error: error.message });
    }
};

export const syncAndCleanData = async (req, res) => {
    try {
        const users = await User.find({ googleFitTokens: { $exists: true, $ne: null } });

        for (const user of users) {
            const accessToken = await getAccessToken(user.googleFitTokens.refresh_token);
            if (!accessToken) {
                console.error(`Skipping data sync for user ${user._id}: failed to get access token.`);
                continue;
            }

            const dataToSave = {};

            const heartRateData = await fetchGoogleFitData(accessToken, "com.google.heart_rate.bpm");
            const bloodPressureData = await fetchGoogleFitData(accessToken, "com.google.blood_pressure");
            const oxygenSaturationData = await fetchGoogleFitData(accessToken, "com.google.oxygen_saturation");
            const respiratoryRateData = await fetchGoogleFitData(accessToken, "com.google.respiration.rate");

            if (heartRateData || bloodPressureData || oxygenSaturationData || respiratoryRateData) {
                dataToSave.vitals = {
                    heartRate: heartRateData?.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal || null,
                    bloodPressure: {
                        systolic: bloodPressureData?.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal || null,
                        diastolic: bloodPressureData?.bucket[0]?.dataset[0]?.point[0]?.value[1]?.fpVal || null,
                    },
                    oxygenSaturation: oxygenSaturationData?.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal || null,
                    respiratoryRate: respiratoryRateData?.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal || null,
                };
            }

            const sleepData = await fetchGoogleFitData(accessToken, "com.google.sleep.segment");
            if (sleepData) {

                const totalSleepMillis = sleepData.bucket.reduce((total, bucket) => {
                    return total + (bucket.endTimeMillis - bucket.startTimeMillis);
                }, 0);
                const totalSleepMinutes = Math.floor(totalSleepMillis / (1000 * 60));

                dataToSave.sleep = {
                    sleepDuration: totalSleepMinutes,
                    startTime: new Date(parseInt(sleepData?.bucket[0]?.startTimeMillis)),
                    endTime: new Date(parseInt(sleepData?.bucket[0]?.endTimeMillis)),
                };
            }

            const stepsData = await fetchGoogleFitData(accessToken, "com.google.step_count.delta");
            if (stepsData) {
                const totalSteps = stepsData.bucket.reduce((total, bucket) => {
                    return total + (bucket.dataset[0]?.point[0]?.value[0]?.intVal || 0);
                }, 0);
                dataToSave.activity = { steps: totalSteps };
            }

            const weightData = await fetchGoogleFitData(accessToken, "com.google.weight");
            if (weightData) {
                dataToSave.bodyData = { weight: weightData.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal || null };
            }
 
            if (Object.keys(dataToSave).length > 0) {
                const newRecord = new SmartwatchData({
                    userId: user._id,
                    ...dataToSave,
                    source: 'Google Fit',
                });
                await newRecord.save();
                console.log(`Successfully synced Google Fit data for user ${user._id}`);
            } else {
                console.log(`No new data fetched for user ${user._id}`);
            }
        }

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await SmartwatchData.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });
        console.log(`Successfully cleaned up old smartwatch data.`);

        if (res) {
            res.status(200).json({ message: "Data sync and cleanup completed successfully." });
        }
    } catch (error) {
        console.error("Error during automated data sync:", error.message);
        if (res) {
            res.status(500).json({ message: "Error during automated data sync", error: error.message });
        }
    }
};

export const getSmartwatchData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        let query = { userId };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                query.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                query.timestamp.$lte = new Date(endDate);
            }
        }

        const data = await SmartwatchData.find(query).sort({ timestamp: -1 });

        res.status(200).json({
            message: "Data retrieved successfully.",
            data,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving data", error: error.message });
    }
};


export const getLatestVitals = async (req, res) => {
    try {
        const userId = req.user.id;
        const latestVitals = await SmartwatchData.findOne({
            userId,
            'vitals.heartRate': { $exists: true }
        }).sort({ timestamp: -1 });

        if (!latestVitals) {
            return res.status(404).json({ message: "No vital data found for this user." });
        }

        res.status(200).json({
            message: "Latest vitals retrieved successfully.",
            vitals: latestVitals.vitals,
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving vitals", error: error.message });
    }
};
