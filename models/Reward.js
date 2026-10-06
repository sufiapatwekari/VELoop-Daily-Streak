const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true,
            unique: true
        },

        rewardType: {
            type: String,
            required: true,
            enum: ["VES", "GIFT_CARD"]
        },

        currency: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        assetType: {
            type: String,
            required: true
        },

        active: {
            type: Boolean,
            default: true
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;