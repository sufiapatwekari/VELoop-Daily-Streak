const mongoose = require("mongoose");

const streakHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        day: {
            type: Number,
            required: true
        },

        cycleId: {
            type: String,
            required: true
        },

        claimedAt: {
            type: Date,
            required: true,
            default: Date.now
        },

        reward: {
            rewardType: {
                type: String,
                required: true
            },

            amount: {
                type: Number,
                required: true
            },

            currency: {
                type: String,
                required: true
            },

            title: {
                type: String,
                required: true
            }
        },

        transactionId: {
            type: String,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ["CLAIMED", "MISSED"],
            default: "CLAIMED"
        }
    },
    {
        timestamps: true
    }
);


// Prevent two successful claims for the same
// user + cycle + day
streakHistorySchema.index(
    {
        userId: 1,
        cycleId: 1,
        day: 1,
        status: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            status: "CLAIMED"
        }
    }
);


const StreakHistory =
    mongoose.model(
        "StreakHistory",
        streakHistorySchema
    );

module.exports = StreakHistory;