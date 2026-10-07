import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStreakStatus, claimStreak } from "../services/streakApi";
import styles from "./Dashboard.module.css";

function Dashboard() {
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [error, setError] = useState("");
    const [claimMessage, setClaimMessage] = useState("");
    const [selectedReward, setSelectedReward] = useState(null);
    const [countdown, setCountdown] = useState("00:00:00");

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/login", {
            replace: true
        });
    };

    const loadStreak = async () => {
        try {
            const data = await getStreakStatus();
            setStreak(data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load streak information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStreak();
    }, []);

    const handleClaim = async () => {
        try {
            setClaiming(true);
            setError("");
            setClaimMessage("");

            const data = await claimStreak();

            setClaimMessage(
                `${data.reward.title} claimed successfully!`
            );

            await loadStreak();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to claim reward."
            );
        } finally {
            setClaiming(false);
        }
    };

    useEffect(() => {
        if (!streak?.nextClaimAt) {
            setCountdown("00:00:00");
            return;
        }

        const targetTime =
            new Date(streak.nextClaimAt).getTime();

        const updateCountdown = () => {
            const now = Date.now();
            const difference = targetTime - now;

            if (difference <= 0) {
                setCountdown("00:00:00");
                return;
            }

            const totalSeconds =
                Math.floor(difference / 1000);

            const hours =
                Math.floor(totalSeconds / 3600);

            const minutes =
                Math.floor((totalSeconds % 3600) / 60);

            const seconds =
                totalSeconds % 60;

            setCountdown(
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            );
        };

        updateCountdown();

        const timer =
            setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);

    }, [streak?.nextClaimAt]);

    const handleRewardClick = (reward) => {
        setSelectedReward(reward);
    };

    if (loading) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loader}></div>
                <p>Loading VELoop...</p>
            </div>
        );
    }

    if (error && !streak) {
        return (
            <div className={styles.errorPage}>
                <div className={styles.errorBox}>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>

            {/* ================= HEADER ================= */}

            <header className={styles.header}>

                <div
                    className={styles.logo}
                    onClick={() => navigate("/dashboard")}
                >
                    <span className={styles.logoMark}>
                        V
                    </span>

                    <div>
                        <strong>VELoop</strong>
                        <small>Daily Rewards</small>
                    </div>
                </div>

                <div className={styles.headerRight}>

                    <div className={styles.headerStreak}>
                        <span>🔥</span>

                        <div>
                            <strong>
                                {streak.currentStreak}
                            </strong>

                            <small>
                                day streak
                            </small>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={styles.profileButton}
                        onClick={() => navigate("/wallet")}
                        title="My Wallet"
                    >
                        👤
                    </button>

                    <button
                        type="button"
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        title="Logout"
                    >
                        🚪
                    </button>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className={styles.main}>

                {/* ================= WELCOME ================= */}

                <section className={styles.welcome}>

                    <div>

                        <p className={styles.eyebrow}>
                            YOUR DAILY REWARD
                        </p>

                        <h1>
                            Keep showing up.
                            <span>Keep earning.</span>
                        </h1>

                        <p className={styles.welcomeText}>
                            Complete your daily check-in and
                            unlock the next reward in your journey.
                        </p>

                    </div>

                    <div className={styles.welcomeBadge}>
                        <span>🔥</span>
                        <strong>
                            {streak.currentStreak}
                        </strong>
                        <small>
                            DAYS
                        </small>
                    </div>

                </section>


                {/* ================= TOP CARDS ================= */}

                <section className={styles.topGrid}>

                    {/* STREAK CARD */}

                    <div className={styles.streakCard}>

                        <div className={styles.cardTop}>

                            <div>

                                <span className={styles.cardEyebrow}>
                                    CURRENT STREAK
                                </span>

                                <div className={styles.bigNumber}>
                                    {streak.currentStreak}
                                    <small>days</small>
                                </div>

                            </div>

                            <div className={styles.fireCircle}>
                                🔥
                            </div>

                        </div>

                        <div className={styles.progressTrack}>

                            <div
                                className={styles.progressFill}
                                style={{
                                    width: `${Math.min(
                                        (streak.currentDay /
                                            streak.totalRewards) * 100,
                                        100
                                    )}%`
                                }}
                            ></div>

                        </div>

                        <div className={styles.progressInfo}>
                            <span>
                                Day {streak.currentDay}
                            </span>

                            <span>
                                {streak.totalRewards} day journey
                            </span>
                        </div>

                    </div>


                    {/* WALLET CARD */}

                    <div className={styles.walletCard}>

                        <div className={styles.walletHeader}>

                            <span className={styles.cardEyebrow}>
                                VES WALLET
                            </span>

                            <span className={styles.walletIcon}>
                                💎
                            </span>

                        </div>

                        <div className={styles.walletAmount}>
                            {streak.vesBalance}
                            <span>VES</span>
                        </div>

                        <button
                            type="button"
                            className={styles.walletButton}
                            onClick={() => navigate("/wallet")}
                        >
                            View Wallet →
                        </button>

                    </div>

                </section>


                {/* ================= TODAY REWARD ================= */}

                <section className={styles.todaySection}>

                    <div className={styles.sectionHeading}>

                        <div>

                            <span className={styles.sectionKicker}>
                                TODAY
                            </span>

                            <h2>
                                Your reward is waiting
                            </h2>

                        </div>

                        <span className={styles.dayPill}>
                            DAY {streak.currentDay + 1}
                        </span>

                    </div>


                    <div className={styles.todayCard}>

                        <div className={styles.rewardOrb}>

                            {streak.nextReward?.rewardType ===
                            "GIFT_CARD"
                                ? "🎁"
                                : "💎"}

                        </div>

                        <div className={styles.todayInfo}>

                            <span>
                                NEXT REWARD
                            </span>

                            <h3>
                                {streak.todayClaimed
                                    ? "Come back tomorrow"
                                    : streak.nextReward?.title}
                            </h3>

                            <p>
                                {streak.todayClaimed
                                    ? "Your next reward will unlock when the timer ends."
                                    : streak.nextReward?.description ||
                                      "Your daily reward is ready to claim."}
                            </p>

                        </div>

                        <div className={styles.todayAction}>

                            {streak.todayClaimed ? (
                                <>
                                    <small>
                                        NEXT CLAIM IN
                                    </small>

                                    <strong>
                                        {countdown}
                                    </strong>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.claimButton}
                                    onClick={handleClaim}
                                    disabled={claiming}
                                >
                                    {claiming
                                        ? "Claiming..."
                                        : "🎁 Claim Reward"}
                                </button>
                            )}

                        </div>

                    </div>

                </section>


                {/* ================= MESSAGES ================= */}

                {claimMessage && (
                    <div className={styles.successMessage}>
                        ✓ {claimMessage}
                    </div>
                )}

                {error && (
                    <div className={styles.warningMessage}>
                        ⚠ {error}
                    </div>
                )}


                {/* ================= JOURNEY ================= */}

                <section className={styles.journeySection}>

                    <div className={styles.sectionHeading}>

                        <div>

                            <span className={styles.sectionKicker}>
                                YOUR PROGRESS
                            </span>

                            <h2>
                                7-Day Reward Journey
                            </h2>

                        </div>

                        <span className={styles.completedText}>
                            {streak.checkedIn} / {streak.totalRewards}
                        </span>

                    </div>


                    <div className={styles.journey}>

                        <div className={styles.journeyLine}></div>

                        {streak.rewards.map((reward) => (

                            <div
                                key={reward.day}
                                className={`${styles.rewardItem} ${
                                    reward.status === "CLAIMED"
                                        ? styles.itemClaimed
                                        : reward.status === "AVAILABLE"
                                        ? styles.itemAvailable
                                        : styles.itemLocked
                                }`}
                                onClick={() =>
                                    handleRewardClick(reward)
                                }
                            >

                                <div className={styles.dayCircle}>

                                    {reward.status === "CLAIMED"
                                        ? "✓"
                                        : reward.day}

                                </div>

                                <div className={styles.rewardBox}>

                                    <div className={styles.rewardEmoji}>

                                        {reward.rewardType ===
                                        "GIFT_CARD"
                                            ? "🎁"
                                            : "💎"}

                                    </div>

                                    <div className={styles.rewardDetails}>

                                        <small>
                                            DAY {reward.day}
                                        </small>

                                        <strong>
                                            {reward.title}
                                        </strong>

                                        <span>
                                            {reward.status ===
                                            "CLAIMED"
                                                ? "Reward collected"
                                                : reward.status ===
                                                  "AVAILABLE"
                                                ? "Ready to claim"
                                                : "Complete previous day"}
                                        </span>

                                    </div>

                                    <div className={styles.rewardArrow}>
                                        →
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                {/* ================= QUICK ACTIONS ================= */}

                <section className={styles.quickSection}>

                    <div className={styles.sectionHeading}>

                        <div>

                            <span className={styles.sectionKicker}>
                                EXPLORE
                            </span>

                            <h2>
                                Your VELoop
                            </h2>

                        </div>

                    </div>


                    <div className={styles.quickGrid}>

                        <button
                            type="button"
                            onClick={() => navigate("/wallet")}
                            className={styles.quickCard}
                        >
                            <span>💎</span>

                            <div>
                                <strong>
                                    VES Wallet
                                </strong>

                                <small>
                                    Check your balance
                                </small>
                            </div>

                            <b>→</b>
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/transactions")
                            }
                            className={styles.quickCard}
                        >
                            <span>💳</span>

                            <div>
                                <strong>
                                    Transactions
                                </strong>

                                <small>
                                    View reward activity
                                </small>
                            </div>

                            <b>→</b>
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/streak-history")
                            }
                            className={styles.quickCard}
                        >
                            <span>📈</span>

                            <div>
                                <strong>
                                    Streak History
                                </strong>

                                <small>
                                    See your journey
                                </small>
                            </div>

                            <b>→</b>
                        </button>

                    </div>

                </section>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className={styles.footer}>

                <div className={styles.footerInner}>

                    <div className={styles.footerBrand}>

                        <div className={styles.footerLogo}>
                            <span>V</span>
                            <strong>VELoop</strong>
                        </div>

                        <p>
                            Build your streak.
                            Stay consistent.
                            Unlock rewards.
                        </p>

                    </div>


                    <div className={styles.footerLinks}>

                        <button
                            onClick={() => navigate("/wallet")}
                        >
                            💎 Wallet
                        </button>

                        <button
                            onClick={() =>
                                navigate("/transactions")
                            }
                        >
                            💳 Transactions
                        </button>

                        <button
                            onClick={() =>
                                navigate("/streak-history")
                            }
                        >
                            📈 History
                        </button>

                        <button
                            onClick={() =>
                                navigate("/privacy-policy")
                            }
                        >
                            🔐 Privacy
                        </button>

                        <button
                            onClick={() =>
                                navigate("/terms")
                            }
                        >
                            📄 Terms
                        </button>

                    </div>

                </div>

                <div className={styles.footerBottom}>
                    © {new Date().getFullYear()} VELoop.
                    All rights reserved.
                </div>

            </footer>


            {/* ================= MODAL ================= */}

            {selectedReward && (

                <div
                    className={styles.rewardOverlay}
                    onClick={() =>
                        setSelectedReward(null)
                    }
                >

                    <div
                        className={styles.rewardModal}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className={styles.closeButton}
                            onClick={() =>
                                setSelectedReward(null)
                            }
                        >
                            ×
                        </button>

                        <div className={styles.modalIcon}>

                            {selectedReward.status === "CLAIMED"
                                ? "✓"
                                : selectedReward.status ===
                                  "AVAILABLE"
                                ? "🎁"
                                : "🔒"}

                        </div>

                        <span className={styles.modalDay}>
                            DAY {selectedReward.day}
                        </span>

                        <h2>
                            {selectedReward.status ===
                            "CLAIMED"
                                ? "Reward Collected!"
                                : selectedReward.status ===
                                  "AVAILABLE"
                                ? "Your Reward Awaits!"
                                : "Not Unlocked Yet"}
                        </h2>

                        <p>
                            {selectedReward.status ===
                            "CLAIMED"
                                ? `You already collected ${selectedReward.title}. Keep your streak alive for the next reward!`
                                : selectedReward.status ===
                                  "AVAILABLE"
                                ? `${selectedReward.title} is ready for you. Claim your daily reward now!`
                                : `Complete the previous streak days to unlock ${selectedReward.title}.`}
                        </p>

                        <button
                            className={styles.modalButton}
                            onClick={() =>
                                setSelectedReward(null)
                            }
                        >
                            Got it
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;