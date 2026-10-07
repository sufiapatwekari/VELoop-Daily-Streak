const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        rewardType: {
            type: String,
            required: true,
            enum: ["VES", "GIFT_CARD"]
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            required: true
        },

        source: {
            type: String,
            required: true,
            default: "DAILY_STREAK"
        },

        referenceId: {
            type: String,
            required: true
        },

        streakDay: {
            type: Number,
            required: true
        },

        balanceBefore: {
            type: Number,
            required: true
        },

        balanceAfter: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ["SUCCESS", "FAILED"],
            default: "SUCCESS"
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model(
    "Transaction",
    transactionSchema
);

module.exports = Transaction;