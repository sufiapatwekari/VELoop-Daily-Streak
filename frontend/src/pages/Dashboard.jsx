import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Check,
    Lock,
    LogOut,
    WalletCards,
    X
} from "lucide-react";

import {
    getStreakStatus,
    claimStreak
} from "../services/streakApi";

import styles from "./Dashboard.module.css";

import flameImg from "../../assests/Flame.png";
import coinImg from "../../assests/VEs_Coin.png";
import heroGiftImg from "../../assests/Top_Left.png";
import heroCrownImg from "../../assests/Top_right.png";
import day4Img from "../../assests/Day-4.png";
import day5Img from "../../assests/Day-5.png";
import day7Img from "../../assests/Day-7.png";
import activeImg from "../../assests/Stay_Active.png";
import biggerStreakImg from "../../assests/Bigger_Streak.png";
import exclusiveImg from "../../assests/Exclusive-reward.png";
import trustImg from "../../assests/Trust.png";

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
            setError("");

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

            const difference =
                targetTime - now;

            if (difference <= 0) {

                setCountdown("00:00:00");

                return;
            }

            const totalSeconds =
                Math.floor(difference / 1000);

            const hours =
                Math.floor(totalSeconds / 3600);

            const minutes =
                Math.floor(
                    (totalSeconds % 3600) / 60
                );

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

    const getRewardImage = (reward) => {

        if (!reward) {
            return coinImg;
        }

        if (reward.rewardType === "GIFT_CARD") {

            if (reward.day === 4) {
                return day4Img;
            }

            if (reward.day === 5) {
                return day5Img;
            }

            if (reward.day === 7) {
                return day7Img;
            }

            return day5Img;
        }

        return coinImg;
    };

    const getDayStatusClass = (status) => {

        if (status === "CLAIMED") {
            return styles.claimed;
        }

        if (status === "AVAILABLE") {
            return styles.available;
        }

        return styles.locked;
    };

    if (loading) {

        return (
            <div className={styles.loadingPage}>

                <div className={styles.loadingLogo}>
                    <img
                        src={flameImg}
                        alt="VELoop"
                    />
                </div>

                <div className={styles.loadingSpinner}></div>

                <p>
                    Loading your daily rewards...
                </p>

            </div>
        );
    }

    if (error && !streak) {

        return (
            <div className={styles.errorPage}>

                <div className={styles.errorBox}>

                    <div className={styles.errorIcon}>
                        !
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadStreak}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    const progress =
        streak?.totalRewards
            ? Math.min(
                (streak.currentDay /
                    streak.totalRewards) * 100,
                100
            )
            : 0;

    return (

        <div className={styles.page}>

            {/* =====================================
                HEADER
            ====================================== */}

            <header className={styles.header}>

                <div className={styles.headerInner}>

                    <div
                        className={styles.brand}
                        onClick={() => navigate("/dashboard")}
                    >

                        <div className={styles.brandMark}>
                            V
                        </div>

                        <div>
                            <strong>
                                VELoop
                            </strong>

                            <span>
                                Daily Streak
                            </span>
                        </div>

                    </div>

                    <div className={styles.headerRight}>

                        <div className={styles.streakBadge}>

                            <img
                                src={flameImg}
                                alt=""
                            />

                            <span>
                                {streak.currentStreak}
                            </span>

                            <small>
                                day streak
                            </small>

                        </div>

                        <button
                            type="button"
                            className={styles.balanceButton}
                            onClick={() => navigate("/wallet")}
                        >

                            <img
                                src={coinImg}
                                alt=""
                            />

                            <span>
                                {streak.vesBalance}
                            </span>

                            <small>
                                VES
                            </small>

                        </button>

                        <button
                            type="button"
                            className={styles.logoutButton}
                            onClick={handleLogout}
                            aria-label="Logout"
                        >
                            <LogOut size={17} />
                        </button>

                    </div>

                </div>

            </header>


            {/* =====================================
                MAIN
            ====================================== */}

            <main className={styles.main}>

                {/* REFERENCE DESIGN: DAILY CHECK-IN + ULTIMATE REWARD */}
                <section className={styles.referenceSummary}>
                    <div className={styles.referenceLeft}>
                        <div className={styles.referenceHeading}>
                            <h1>Daily Check-In <span>Rewards</span></h1>
                            <p>Check in every day and earn exciting rewards!</p>
                        </div>

                        <div className={styles.referenceStatsLayout}>
                            <div className={styles.referenceGift}>
                                <img src={heroGiftImg} alt="Daily rewards gift" />
                                <img className={styles.referenceFloatingCoin} src={coinImg} alt="" />
                            </div>

                            <div className={styles.referenceStats}>
                                <div className={styles.referenceStat}>
                                    <span className={styles.referenceStatIcon}>
                                        <WalletCards size={20} />
                                    </span>
                                    <div>
                                        <small>TOTAL REWARDS</small>
                                        <strong>{streak.totalRewards}</strong>
                                    </div>
                                </div>

                                <div className={styles.referenceStat}>
                                    <span className={styles.referenceStatIcon}>
                                        <Check size={21} />
                                    </span>
                                    <div>
                                        <small>CHECKED IN</small>
                                        <strong>{streak.checkedIn}</strong>
                                    </div>
                                </div>

                                <div className={styles.referenceStat}>
                                    <span className={styles.referenceStatIcon}>
                                        <img src={coinImg} alt="" />
                                    </span>
                                    <div>
                                        <small>NEXT REWARD</small>
                                        <strong className={styles.referenceGold}>
                                            {streak.nextReward?.title || "See your reward cards"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.referenceClaimRow}>
                            {streak.todayClaimed ? (
                                <div className={styles.referenceCountdown}>
                                    <span>Next claim in</span>
                                    <strong>{countdown}</strong>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.referenceClaimButton}
                                    onClick={handleClaim}
                                    disabled={claiming}
                                >
                                    {claiming ? "Claiming..." : "Claim Reward"}
                                    {!claiming && <ArrowRight size={16} />}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.referenceUltimate}>
                        <div className={styles.referenceStreakBadge}>
                            <img src={flameImg} alt="" />
                            <strong>{streak.currentStreak} Day Streak</strong>
                            <span>Keep it going!</span>
                        </div>

                        <div className={styles.referenceUltimateContent}>
                            <div className={styles.referenceCrown}>
                                <img src={heroCrownImg} alt="Ultimate reward crown" />
                            </div>

                            <div className={styles.referenceUltimateText}>
                                <span>ULTIMATE REWARD</span>
                                <h2>
                                    {streak.rewards?.find((reward) => reward.day === 7)?.title || "Day 7"}
                                </h2>
                                <div className={styles.referenceGiftLabel}>
                                    <img src={day7Img} alt="" />
                                    <span>
                                        {streak.rewards?.find((reward) => reward.day === 7)?.description || "Day 7 reward"}
                                    </span>
                                </div>
                                <p>Unlock on <strong>Day 7</strong></p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={styles.referenceReminder}>
                    <span>✦</span>
                    Come back tomorrow for more rewards!
                    <span>✦</span>
                </div>

                {/* =================================
                    MESSAGES
                ================================== */}

                {claimMessage && (

                    <div className={styles.successMessage}>

                        <Check size={17} />

                        <span>
                            {claimMessage}
                        </span>

                    </div>
                )}

                {error && (

                    <div className={styles.warningMessage}>

                        <span>!</span>

                        <p>
                            {error}
                        </p>

                    </div>
                )}


                {/* =================================
                    7 DAY REWARD GRID
                ================================== */}

                <section className={styles.rewardsSection}>

                    <div className={styles.sectionTitle}>

                        <div>

                            <span>
                                STREAK CALENDAR
                            </span>

                            <h2>
                                7-Day Reward Journey
                            </h2>

                        </div>

                        <div className={styles.completedBadge}>
                            {streak.checkedIn} / {streak.totalRewards}
                        </div>

                    </div>


                    <div className={styles.rewardGrid}>

                        {streak.rewards.map((reward) => (

                            <button
                                key={reward.day}
                                type="button"
                                className={`${styles.rewardCard} ${getDayStatusClass(
                                    reward.status
                                )}`}
                                onClick={() =>
                                    handleRewardClick(reward)
                                }
                            >

                                <div className={styles.rewardTop}>

                                    <span>
                                        Day {reward.day}
                                    </span>

                                    {reward.status === "CLAIMED" && (
                                        <Check size={14} />
                                    )}

                                    {reward.status === "LOCKED" && (
                                        <Lock size={13} />
                                    )}

                                </div>


                                <div className={styles.rewardImage}>

                                    <img
                                        src={getRewardImage(reward)}
                                        alt=""
                                    />

                                </div>


                                <strong>
                                    {reward.title}
                                </strong>

                                <small>
                                    {reward.status === "CLAIMED"
                                        ? "Claimed"
                                        : reward.status === "AVAILABLE"
                                        ? "Available today"
                                        : "Locked"}
                                </small>


                                {reward.status === "AVAILABLE" && (

                                    <span className={styles.claimNow}>
                                        Claim now
                                        <ArrowRight size={13} />
                                    </span>

                                )}

                            </button>

                        ))}

                    </div>

                </section>


                {/* =================================
                    BENEFITS
                ================================== */}

                <section className={styles.benefitsSection}>

                    <div className={styles.sectionTitle}>

                        <div>

                            <span>
                                WHY MAINTAIN YOUR STREAK?
                            </span>

                            <h2>
                                Bigger consistency. Bigger rewards.
                            </h2>

                        </div>

                    </div>


                    <div className={styles.benefitsGrid}>

                        <div className={styles.benefitCard}>

                            <img
                                src={activeImg}
                                alt=""
                            />

                            <h3>
                                Stay Active
                            </h3>

                            <p>
                                Keep your daily streak alive
                                and never miss an eligible reward.
                            </p>

                        </div>


                        <div className={styles.benefitCard}>

                            <img
                                src={biggerStreakImg}
                                alt=""
                            />

                            <h3>
                                Bigger Streak
                            </h3>

                            <p>
                                Stay consistent to unlock
                                higher-value rewards.
                            </p>

                        </div>


                        <div className={styles.benefitCard}>

                            <img
                                src={exclusiveImg}
                                alt=""
                            />

                            <h3>
                                Exclusive Rewards
                            </h3>

                            <p>
                                Reach later days to unlock
                                special reward types.
                            </p>

                        </div>


                        <div className={styles.benefitCard}>

                            <img
                                src={trustImg}
                                alt=""
                            />

                            <h3>
                                Don't Miss Out
                            </h3>

                            <p>
                                Come back every day to protect
                                your progress.
                            </p>

                        </div>

                    </div>

                </section>


                {/* OFFICIAL REWARDS TRUST STRIP */}
                <div className={styles.trustNotice}>
                    <img src={trustImg} alt="" />
                    <div>
                        <strong>Official rewards only on <span>VeloopRewards.in</span></strong>
                        <p>Stay active, stay rewarded!</p>
                    </div>
                    <ArrowRight className={styles.trustArrow} size={18} />
                </div>

            </main>


            {/* =====================================
                FOOTER
            ====================================== */}

          {/* <footer className={styles.footer}>

                <div className={styles.footerInner}>

                    <div className={styles.footerBrand}>

                      <div className={styles.footerLogo}>

                           <div className={styles.footerBrandMark}>
                                V
                           </div>

                            <strong>
                             VELoop Rewards
                            </strong>

                      </div>

                        <p>
                            Stay active. Build your streak.
                            Unlock your rewards.
                        </p>

                    </div>


                    <div className={styles.footerLinks}>

                        <button
                            onClick={() =>
                                navigate("/wallet")
                            }
                        >
                            Wallet
                        </button>

                        <button
                            onClick={() =>
                                navigate("/transactions")
                            }
                        >
                            Transactions
                        </button>

                        <button
                            onClick={() =>
                                navigate("/streak-history")
                            }
                        >
                            Streak History
                        </button>

                        <button
                            onClick={() =>
                                navigate("/privacy-policy")
                            }
                        >
                            Privacy
                        </button>

                        <button
                            onClick={() =>
                                navigate("/terms")
                            }
                        >
                            Terms
                        </button>

                    </div>

                </div>

                <div className={styles.footerBottom}>
                    © {new Date().getFullYear()} VELoop Rewards.
                    All rights reserved.
                </div>

            </footer>*/}


            {/* =====================================
                REWARD MODAL
            ====================================== */}

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
                            type="button"
                            className={styles.closeButton}
                            onClick={() =>
                                setSelectedReward(null)
                            }
                        >
                            <X size={18} />
                        </button>


                        <img
                            className={styles.modalRewardImage}
                            src={getRewardImage(
                                selectedReward
                            )}
                            alt=""
                        />


                        <span className={styles.modalDay}>
                            DAY {selectedReward.day}
                        </span>


                        <h2>

                            {selectedReward.status === "CLAIMED"
                                ? "Reward Collected!"
                                : selectedReward.status === "AVAILABLE"
                                ? "Your Reward Awaits!"
                                : "Not Unlocked Yet"}

                        </h2>


                        <p>

                            {selectedReward.status === "CLAIMED"
                                ? `You already collected ${selectedReward.title}. Keep your streak alive for the next reward!`
                                : selectedReward.status === "AVAILABLE"
                                ? `${selectedReward.title} is ready for you. Claim your daily reward now!`
                                : `Complete the previous streak days to unlock ${selectedReward.title}.`}

                        </p>


                        <button
                            type="button"
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