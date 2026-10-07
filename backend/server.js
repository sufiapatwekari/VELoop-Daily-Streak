const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Streak = require("./models/Streak");
const Reward = require("./models/Reward");
const Transaction = require("./models/Transaction");
const StreakHistory = require("./models/StreakHistory");
const Wallet = require("./models/Wallet");
const StreakConfig = require("./models/StreakConfig");
const AuditLog = require("./models/AuditLog");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://veloop-daily-streak-frontend.onrender.com"
    ]
}));

app.use(express.json());

const streakClaimLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // maximum 10 requests
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many claim requests. Please try again later."
    }
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error);
    });

app.get("/", (req, res) => {
    res.send("VELoop Backend is running!");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // -----------------------------------------
        // CREATE USER
        // -----------------------------------------

        const user = new User({
            name: name,
            email: normalizedEmail,
            password: hashedPassword
        });

        const savedUser = await user.save();


        // -----------------------------------------
        // CREATE WALLET
        // -----------------------------------------

        await Wallet.create({
            userId: savedUser._id,
            vesBalance: 0
        });


        // -----------------------------------------
        // CREATE STREAK
        // -----------------------------------------

        await Streak.create({
            userId: savedUser._id,
            currentStreak: 0,
            longestStreak: 0,
            currentDay: 0,
            cycleId: `cycle-${Date.now()}-${savedUser._id}`,
            lastClaimDate: null
        });


        // -----------------------------------------
        // RESPONSE
        // -----------------------------------------

        res.status(201).json({
            message: "Registration successful",

            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

    } catch (error) {

        console.log("REGISTRATION ERROR:", error);

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
});

app.post("/streak/create", authMiddleware, async (req, res) => {
    try {

        const existingStreak = await Streak.findOne({
            userId: req.userId
        });

        if (existingStreak) {
            return res.status(400).json({
                message: "Streak already exists"
            });
        }

        const cycleId = `cycle-${Date.now()}-${req.userId}`;

        const streak = new Streak({
            userId: req.userId,
            currentStreak: 0,
            longestStreak: 0,
            currentDay: 0,
            cycleId: cycleId,
            lastClaimDate: null
        });

        const savedStreak = await streak.save();

        res.status(201).json({
            message: "Streak created successfully",
            streak: savedStreak
        });

    } catch (error) {

        res.status(500).json({
            message: "Streak creation failed",
            error: error.message
        });

    }
});

app.post("/rewards/setup", async (req, res) => {
    try {

        await Reward.deleteMany({});

        const rewards = [
            {
                day: 1,
                rewardType: "VES",
                currency: "VES",
                amount: 5,
                title: "5 VEs",
                description: "Earn 5 VEs for completing Day 1",
                assetType: "VES",
                active: true
            },
            {
                day: 2,
                rewardType: "VES",
                currency: "VES",
                amount: 10,
                title: "10 VEs",
                description: "Earn 10 VEs for completing Day 2",
                assetType: "VES",
                active: true
            },
            {
                day: 3,
                rewardType: "VES",
                currency: "VES",
                amount: 15,
                title: "15 VEs",
                description: "Earn 15 VEs for completing Day 3",
                assetType: "VES",
                active: true
            },
            {
                day: 4,
                rewardType: "GIFT_CARD",
                currency: "INR",
                amount: 1,
                title: "₹1 Amazon Gift Card",
                description: "Earn a ₹1 Amazon Gift Card",
                assetType: "AMAZON_GIFT_CARD",
                active: true
            },
            {
                day: 5,
                rewardType: "GIFT_CARD",
                currency: "INR",
                amount: 2,
                title: "₹2 Amazon Gift Card",
                description: "Earn a ₹2 Amazon Gift Card",
                assetType: "AMAZON_GIFT_CARD",
                active: true
            },
            {
                day: 6,
                rewardType: "VES",
                currency: "VES",
                amount: 30,
                title: "30 VEs",
                description: "Earn 30 VEs for completing Day 6",
                assetType: "VES",
                active: true
            },
            {
                day: 7,
                rewardType: "GIFT_CARD",
                currency: "INR",
                amount: 5,
                title: "₹5 Amazon Gift Card",
                description: "Earn a ₹5 Amazon Gift Card",
                assetType: "AMAZON_GIFT_CARD",
                active: true
            }
        ];

        const savedRewards = await Reward.insertMany(rewards);

        res.status(201).json({
            message: "Rewards configured successfully",
            rewards: savedRewards
        });

    } catch (error) {

        res.status(500).json({
            message: "Reward setup failed",
            error: error.message
        });

    }
});

app.post("/streak/claim", streakClaimLimiter, authMiddleware, async (req, res) => {

    console.log("CLAIM USER ID:", req.userId);

    const session = await mongoose.startSession();

    try {

        // ------------------------------------------------
        // CLAIM REQUEST AUDIT
        // ------------------------------------------------

        await AuditLog.create({
            userId: req.userId,
            action: "STREAK_CLAIM_REQUEST",
            status: "SUCCESS",
            message: "Daily streak claim requested"
        });

        let claimResult;
        let resetAuditData = null;

        // ------------------------------------------------
        // START TRANSACTION
        // ------------------------------------------------

        await session.withTransaction(async () => {

            // ------------------------------------------------
            // GET USER
            // ------------------------------------------------

            const user = await User.findById(req.userId)
                .session(session);

            if (!user) {
                throw new Error("USER_NOT_FOUND");
            }

            // ------------------------------------------------
            // GET STREAK
            // ------------------------------------------------

            const streak = await Streak.findOne({
                userId: req.userId
            }).session(session);

            if (!streak) {
                throw new Error("STREAK_NOT_FOUND");
            }

            // ------------------------------------------------
            // GET ACTIVE STREAK CONFIGURATION
            // ------------------------------------------------

            const config = await StreakConfig.findOne({
                active: true
            }).session(session);

            if (!config) {
                throw new Error("STREAK_CONFIG_NOT_FOUND");
            }

            const now = new Date();

            // ------------------------------------------------
            // CREATE CYCLE ID IF MISSING
            // ------------------------------------------------

            if (!streak.cycleId) {

                streak.cycleId =
                    `cycle-${Date.now()}-${req.userId}`;

            }

            // ------------------------------------------------
            // GET WALLET
            // ------------------------------------------------

            let wallet = await Wallet.findOne({
                userId: req.userId
            }).session(session);

            if (!wallet) {

                wallet = new Wallet({
                    userId: req.userId,
                    vesBalance: 0
                });

                await wallet.save({
                    session
                });

            }

            // ------------------------------------------------
            // CHECK 24-HOUR CLAIM INTERVAL
            // ------------------------------------------------

            if (streak.lastClaimDate) {

                const nextClaimAt = new Date(
                    streak.lastClaimDate.getTime() +
                    (
                        config.claimIntervalHours *
                        60 *
                        60 *
                        1000
                    )
                );

                if (now < nextClaimAt) {

                    await AuditLog.create(
                        [{
                            userId: req.userId,

                            action:
                                "STREAK_CLAIM_REJECTED",

                            status:
                                "REJECTED",

                            message:
                                "Daily reward already claimed",

                            metadata: {
                                nextClaimAt:
                                    nextClaimAt
                            }
                        }],
                        {
                            session
                        }
                    );

                    throw new Error(
                        `ALREADY_CLAIMED|${nextClaimAt.toISOString()}`
                    );

                }

            }

            // ------------------------------------------------
            // DETERMINE NEXT DAY
            // ------------------------------------------------

            let nextDay =
                streak.currentDay + 1;

            if (
                nextDay >
                config.totalDays
            ) {

                nextDay = 1;

            }

            let newStreak =
                streak.currentStreak;

            // ------------------------------------------------
            // CHECK MISSED DAY / RESET
            // ------------------------------------------------

            if (streak.lastClaimDate) {

                const timeDifference =
                    now.getTime() -
                    streak.lastClaimDate.getTime();

                const hoursDifference =
                    timeDifference /
                    (1000 * 60 * 60);

                if (
                    hoursDifference >
                    config.missedResetHours
                ) {

                    console.log(
                        "MISSED DAY RESET TRIGGERED"
                    );

                    // ----------------------------------------
                    // SAVE PREVIOUS VALUES
                    // ----------------------------------------

                    const previousStreak =
                        streak.currentStreak;

                    const previousDay =
                        streak.currentDay;

                    // ----------------------------------------
                    // RECORD MISSED PREVIOUS DAY
                    // ----------------------------------------

                    if (
                        streak.currentDay > 0
                    ) {

                        const missedReward =
                            await Reward.findOne({
                                day:
                                    streak.currentDay,

                                active:
                                    true

                            }).session(session);

                        if (missedReward) {

                            const missedHistory =
                                new StreakHistory({

                                    userId:
                                        req.userId,

                                    day:
                                        streak.currentDay,

                                    cycleId:
                                        streak.cycleId,

                                    claimedAt:
                                        now,

                                    reward: {

                                        rewardType:
                                            missedReward.rewardType,

                                        amount:
                                            missedReward.amount,

                                        currency:
                                            missedReward.currency,

                                        title:
                                            missedReward.title

                                    },

                                    transactionId:
                                        `MISSED-${Date.now()}-${req.userId}`,

                                    status:
                                        "MISSED"

                                });

                            await missedHistory.save({
                                session
                            });

                        }

                    }

                    // ----------------------------------------
                    // RESET STREAK
                    // ----------------------------------------

                    newStreak = 0;

                    nextDay = 1;

                    // ----------------------------------------
                    // CREATE NEW CYCLE
                    // ----------------------------------------

                    streak.cycleId =
                        `cycle-${Date.now()}-${req.userId}`;

                    // ----------------------------------------
                    // PREPARE RESET AUDIT
                    // ----------------------------------------

                    resetAuditData = {

                        userId:
                            req.userId,

                        action:
                            "STREAK_RESET",

                        status:
                            "SUCCESS",

                        message:
                            "Streak reset due to missed claim period",

                        metadata: {

                            previousStreak:
                                previousStreak,

                            previousDay:
                                previousDay,

                            missedResetHours:
                                config.missedResetHours,

                            newCycleId:
                                streak.cycleId

                        }

                    };

                }

            }

            // ------------------------------------------------
            // SEQUENTIAL DAY VALIDATION
            // ------------------------------------------------
            //
            // If this is not the first day of a cycle,
            // verify that the previous day was actually
            // claimed in the CURRENT cycle.
            //
            // This prevents:
            //
            // currentDay = 1
            // but no Day 1 CLAIMED history
            //
            // from receiving Day 2.
            // ------------------------------------------------

            if (nextDay > 1) {

                const previousDay =
                    nextDay - 1;

                const previousDayClaim =
                    await StreakHistory.findOne({

                        userId:
                            req.userId,

                        cycleId:
                            streak.cycleId,

                        day:
                            previousDay,

                        status:
                            "CLAIMED"

                    }).session(session);

                if (!previousDayClaim) {

                    await AuditLog.create(
                        [{
                            userId:
                                req.userId,

                            action:
                                "STREAK_CLAIM_REJECTED",

                            status:
                                "REJECTED",

                            message:
                                "Previous day must be claimed first",

                            metadata: {

                                attemptedDay:
                                    nextDay,

                                previousDay:
                                    previousDay,

                                cycleId:
                                    streak.cycleId

                            }

                        }],
                        {
                            session
                        }
                    );

                    throw new Error(
                        "PREVIOUS_DAY_NOT_CLAIMED"
                    );

                }

            }

            // ------------------------------------------------
            // INCREASE STREAK
            // ------------------------------------------------

            newStreak += 1;

            // ------------------------------------------------
            // GET REWARD FROM DATABASE
            // ------------------------------------------------

            const reward =
                await Reward.findOne({

                    day:
                        nextDay,

                    active:
                        true

                }).session(session);

            if (!reward) {

                throw new Error(
                    "REWARD_NOT_CONFIGURED"
                );

            }

            // ------------------------------------------------
            // DUPLICATE CLAIM CHECK
            // ------------------------------------------------

            const existingClaim =
                await StreakHistory.findOne({

                    userId:
                        req.userId,

                    cycleId:
                        streak.cycleId,

                    day:
                        nextDay,

                    status:
                        "CLAIMED"

                }).session(session);

            if (existingClaim) {

                await AuditLog.create(
                    [{
                        userId:
                            req.userId,

                        action:
                            "DUPLICATE_CLAIM",

                        status:
                            "REJECTED",

                        message:
                            "Duplicate streak claim detected",

                        metadata: {

                            day:
                                nextDay,

                            transactionId:
                                existingClaim.transactionId

                        }

                    }],
                    {
                        session
                    }
                );

                throw new Error(
                    "DUPLICATE_CLAIM"
                );

            }

            // ------------------------------------------------
            // CREATE TRANSACTION ID
            // ------------------------------------------------

            const transactionId =
                `TXN-${Date.now()}-${Math.floor(
                    Math.random() * 100000
                )}`;

            // ------------------------------------------------
            // UPDATE WALLET
            // ------------------------------------------------

            const balanceBefore =
                wallet.vesBalance;

            let balanceAfter =
                balanceBefore;

            // Only VES rewards increase wallet
            if (
                reward.rewardType === "VES"
            ) {

                balanceAfter =
                    balanceBefore +
                    reward.amount;

                wallet.vesBalance =
                    balanceAfter;

                await wallet.save({
                    session
                });

            }

            // ------------------------------------------------
            // UPDATE STREAK
            // ------------------------------------------------

            streak.currentStreak =
                newStreak;

            streak.currentDay =
                nextDay;

            streak.lastClaimDate =
                now;

            if (
                newStreak >
                streak.longestStreak
            ) {

                streak.longestStreak =
                    newStreak;

            }

            await streak.save({
                session
            });

            // ------------------------------------------------
            // CREATE TRANSACTION
            // ------------------------------------------------

            const transaction =
                new Transaction({

                    transactionId:
                        transactionId,

                    userId:
                        req.userId,

                    rewardType:
                        reward.rewardType,

                    amount:
                        reward.amount,

                    currency:
                        reward.currency,

                    source:
                        "DAILY_STREAK",

                    referenceId:
                        reward._id.toString(),

                    streakDay:
                        nextDay,

                    balanceBefore:
                        balanceBefore,

                    balanceAfter:
                        balanceAfter,

                    status:
                        "SUCCESS"

                });

            await transaction.save({
                session
            });

            // ------------------------------------------------
            // CREATE STREAK HISTORY
            // ------------------------------------------------

            const history =
                new StreakHistory({

                    userId:
                        req.userId,

                    day:
                        nextDay,

                    cycleId:
                        streak.cycleId,

                    claimedAt:
                        now,

                    reward: {

                        rewardType:
                            reward.rewardType,

                        amount:
                            reward.amount,

                        currency:
                            reward.currency,

                        title:
                            reward.title

                    },

                    transactionId:
                        transactionId,

                    status:
                        "CLAIMED"

                });

            await history.save({
                session
            });

            // ------------------------------------------------
            // CREATE SUCCESS AUDIT LOG
            // ------------------------------------------------

            const successAudit =
                new AuditLog({

                    userId:
                        req.userId,

                    action:
                        "STREAK_CLAIM_SUCCESS",

                    status:
                        "SUCCESS",

                    message:
                        "Daily streak reward claimed successfully",

                    metadata: {

                        day:
                            nextDay,

                        rewardType:
                            reward.rewardType,

                        amount:
                            reward.amount,

                        transactionId:
                            transactionId

                    }

                });

            await successAudit.save({
                session
            });

            // ------------------------------------------------
            // PREPARE RESPONSE
            // ------------------------------------------------

            claimResult = {

                streak:
                    newStreak,

                day:
                    nextDay,

                reward: {

                    rewardType:
                        reward.rewardType,

                    amount:
                        reward.amount,

                    currency:
                        reward.currency,

                    title:
                        reward.title

                },

                vesBalance:
                    balanceAfter,

                lastClaimDate:
                    now

            };

        });

        // ------------------------------------------------
        // SAVE RESET AUDIT AFTER TRANSACTION
        // ------------------------------------------------

        if (resetAuditData) {

            try {

                await AuditLog.create(
                    resetAuditData
                );

            } catch (auditError) {

                console.log(
                    "STREAK RESET AUDIT ERROR:",
                    auditError.message
                );

            }

        }

        // ------------------------------------------------
        // SUCCESS RESPONSE
        // ------------------------------------------------

        res.status(200).json({

            message:
                "Daily reward claimed successfully",

            streak:
                claimResult.streak,

            day:
                claimResult.day,

            reward:
                claimResult.reward,

            vesBalance:
                claimResult.vesBalance,

            lastClaimDate:
                claimResult.lastClaimDate

        });

    } catch (error) {

        // ------------------------------------------------
        // ERROR HANDLING
        // ------------------------------------------------

        if (
            error.message ===
            "USER_NOT_FOUND"
        ) {

            return res.status(404).json({
                message:
                    "User not found"
            });

        }

        if (
            error.message ===
            "STREAK_NOT_FOUND"
        ) {

            return res.status(404).json({
                message:
                    "Streak not found"
            });

        }

        if (
            error.message ===
            "STREAK_CONFIG_NOT_FOUND"
        ) {

            return res.status(404).json({
                message:
                    "Streak configuration not found"
            });

        }

        if (
            error.message ===
            "REWARD_NOT_CONFIGURED"
        ) {

            return res.status(404).json({
                message:
                    "Reward not configured for this streak day"
            });

        }

        // ------------------------------------------------
        // PREVIOUS DAY VALIDATION ERROR
        // ------------------------------------------------

        if (
            error.message ===
            "PREVIOUS_DAY_NOT_CLAIMED"
        ) {

            return res.status(400).json({

                message:
                    "Previous day must be claimed first"

            });

        }

        if (
            error.message.startsWith(
                "ALREADY_CLAIMED|"
            )
        ) {

            const nextClaimAt =
                error.message.split("|")[1];

            return res.status(400).json({

                message:
                    "Daily reward already claimed",

                nextClaimAt:
                    nextClaimAt

            });

        }

        if (
            error.message ===
            "DUPLICATE_CLAIM"
        ) {

            return res.status(400).json({

                message:
                    "Duplicate claim detected"

            });

        }

        if (
            error.code ===
            11000
        ) {

            console.log(
                "DUPLICATE KEY ERROR:",
                error.message
            );

            console.log(
                "KEY PATTERN:",
                error.keyPattern
            );

            console.log(
                "KEY VALUE:",
                error.keyValue
            );

            return res.status(400).json({

                message:
                    "Duplicate key error",

                error:
                    error.message,

                keyPattern:
                    error.keyPattern,

                keyValue:
                    error.keyValue

            });

        }

        console.log(
            "DAILY CLAIM ERROR:",
            error
        );

        return res.status(500).json({

            message:
                "Daily claim failed",

            error:
                error.message

        });

    } finally {

        await session.endSession();

    }

});

app.get("/streak/status", authMiddleware, async (req, res) => {
    try {

        const streak = await Streak.findOne({
            userId: req.userId
        });

        if (!streak) {
            return res.status(404).json({
                message: "Streak not found"
            });
        }

        const config = await StreakConfig.findOne({
            active: true
        });

        if (!config) {
            return res.status(404).json({
                message: "Streak configuration not found"
            });
        }

        const wallet = await Wallet.findOne({
            userId: req.userId
        });

        const rewards = await Reward.find({
            active: true
        }).sort({ day: 1 });

        const now = new Date();

        let todayClaimed = false;
        let nextClaimAt = null;

        // Check claim timing
        if (streak.lastClaimDate) {

            nextClaimAt = new Date(
                streak.lastClaimDate.getTime() +
                (config.claimIntervalHours * 60 * 60 * 1000)
            );

            if (now < nextClaimAt) {
                todayClaimed = true;
            }
        }

        // Determine next reward day
        let nextRewardDay = streak.currentDay + 1;

        if (nextRewardDay > config.totalDays) {
            nextRewardDay = 1;
        }

        if (!streak.lastClaimDate) {
            nextRewardDay = 1;
        }

        // Generate reward cards
       const rewardCards = rewards.map((reward) => {

    let status = "LOCKED";

    // Already completed rewards
    if (reward.day <= streak.currentDay) {
        status = "CLAIMED";
    }

    // Next reward becomes available only
    // after the claim interval is completed
    if (
        reward.day === nextRewardDay &&
        !todayClaimed
    ) {
        status = "AVAILABLE";
    }

    return {
        day: reward.day,
        rewardType: reward.rewardType,
        amount: reward.amount,
        currency: reward.currency,
        title: reward.title,
        description: reward.description,
        assetType: reward.assetType,
        status: status
    };
});

        // Find next reward
        const nextReward = rewards.find(
            reward => reward.day === nextRewardDay
        );

        // Count successfully completed rewards
        const checkedIn = streak.currentStreak;

        res.status(200).json({

            currentStreak: streak.currentStreak,

            longestStreak: streak.longestStreak,

            currentDay: streak.currentDay,

            totalRewards: config.totalDays,

            checkedIn: checkedIn,

            nextReward: nextReward
                ? {
                    day: nextReward.day,
                    rewardType: nextReward.rewardType,
                    amount: nextReward.amount,
                    currency: nextReward.currency,
                    title: nextReward.title
                }
                : null,

            nextRewardDay: nextRewardDay,

            vesBalance: wallet
                ? wallet.vesBalance
                : 0,

            todayClaimed: todayClaimed,

            nextClaimAt: nextClaimAt,

            serverTime: now,

            rewards: rewardCards
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to get streak status",
            error: error.message
        });

    }
});

app.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            transactions: transactions
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get transactions",
            error: error.message
        });
    }
});

app.get("/wallet", authMiddleware, async (req, res) => {
    try {

        const wallet = await Wallet.findOne({
            userId: req.userId
        });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }

        res.status(200).json({
            userId: req.userId,
            vesBalance: wallet.vesBalance
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to get wallet",
            error: error.message
        });

    }
});

app.get("/streak/history", authMiddleware, async (req, res) => {
    try {
        const history = await StreakHistory.find({
            userId: req.userId
        }).sort({ claimedAt: -1 });

        res.status(200).json({
            history: history
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get streak history",
            error: error.message
        });
    }
});

app.post("/test-user", async (req, res) => {
    try {
        const user = new User({
            name: "Test User",
            email: "test@example.com",
            password: "test123"
        });

        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({
            message: "User creation failed",
            error: error.message
        });
    }
});

app.post("/test/reset-streak", authMiddleware, async (req, res) => {
    try {

        await Streak.findOneAndUpdate(
            { userId: req.userId },
            {
                $set: {
                    currentStreak: 0,
                    longestStreak: 0,
                    currentDay: 0,
                    cycleId: `cycle-${Date.now()}-${req.userId}`,
                    lastClaimDate: null
                }
            },
            { upsert: true, new: true }
        );

        await Wallet.findOneAndUpdate(
            { userId: req.userId },
            {
                $set: {
                    vesBalance: 0
                }
            },
            { upsert: true, new: true }
        );

        await StreakHistory.deleteMany({
            userId: req.userId
        });

        await Transaction.deleteMany({
            userId: req.userId
        });

        res.status(200).json({
            message: "Test streak data reset successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Reset failed",
            error: error.message
        });

    }
});

app.post("/streak-config/setup", async (req, res) => {
    try {

        await StreakConfig.deleteMany({});

        const config = new StreakConfig({
            name: "VELoop Daily Streak",
            totalDays: 7,
            claimIntervalHours: 24,
            missedResetHours: 48,
            active: true
        });

        const savedConfig = await config.save();

        res.status(201).json({
            message: "Streak configuration created successfully",
            config: savedConfig
        });

    } catch (error) {

        res.status(500).json({
            message: "Streak configuration setup failed",
            error: error.message
        });

    }
});

app.post("/test/advance-day", authMiddleware, async (req, res) => {
    try {

        const streak = await Streak.findOne({
            userId: req.userId
        });

        if (!streak) {
            return res.status(404).json({
                message: "Streak not found"
            });
        }

        if (!streak.lastClaimDate) {
            return res.status(400).json({
                message: "No claim found to advance"
            });
        }

        streak.lastClaimDate = new Date(
            streak.lastClaimDate.getTime() -
            (49 * 60 * 60 * 1000)
        );

        await streak.save();

        res.status(200).json({
            message: "Test time advanced successfully",
            lastClaimDate: streak.lastClaimDate
        });

    } catch (error) {

        res.status(500).json({
            message: "Test time advance failed",
            error: error.message
        });

    }
});

app.get("/test/streak-history-indexes", async (req, res) => {
    try {
        const indexes = await StreakHistory.collection.indexes();

        res.status(200).json(indexes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get indexes",
            error: error.message
        });
    }
});

app.post("/test/create-streak-history-index", async (req, res) => {
    try {

        await StreakHistory.collection.createIndex(
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

        res.status(200).json({
            message: "Streak history unique index created successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to create streak history index",
            error: error.message
        });

    }
});