const mongoose = require("mongoose");

const streakConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        totalDays: {
            type: Number,
            required: true,
            min: 1,
            default: 7
        },

        claimIntervalHours: {
            type: Number,
            required: true,
            min: 1,
            default: 24
        },

        missedResetHours: {
            type: Number,
            required: true,
            min: 1,
            default: 48
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const StreakConfig = mongoose.model(
    "StreakConfig",
    streakConfigSchema
);

module.exports = StreakConfig;