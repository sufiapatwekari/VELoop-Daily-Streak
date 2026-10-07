const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        currentStreak: {
            type: Number,
            default: 0
        },

        longestStreak: {
            type: Number,
            default: 0
        },

        currentDay: {
            type: Number,
            default: 0
        },

        cycleId: {
            type: String,
            default: null
        },

        lastClaimDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Streak = mongoose.model("Streak", streakSchema);

module.exports = Streak;