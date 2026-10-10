import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CalendarCheck,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Lock,
    LogOut,
    Sparkle,
    Star,
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

    /* UI-only helpers (no data is changed) */

    const getCardTag = (reward) => {
        if (reward.status === "AVAILABLE") return "Today";
        if (reward.day === 7) return "VIP";
        if (reward.rewardType === "GIFT_CARD" && reward.day === 5) return "Gift Card";
        if (reward.day === 6) return "Coin";
        return "";
    };

    const getTagClass = (tag) => {
        if (tag === "Today") return styles.tagToday;
        if (tag === "VIP") return styles.tagVip;
        return styles.tagSoft;
    };

    const getAmountText = (reward) =>
        String(reward.title ?? "").replace(/\s*VES?\s*$/i, "");

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

    const ultimateReward =
        streak.rewards?.find((reward) => reward.day === 7);

    return (

        <div className={styles.page}>

            <div className={styles.shell}>

                {/* =====================================
                    MOBILE TOP BAR
                ====================================== */}

                <div className={styles.topbar}>

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <h1 className={styles.topTitle}>
                        Daily Streak
                        <img src={flameImg} alt="" />
                    </h1>

                    <button
                        type="button"
                        className={styles.balanceButton}
                        onClick={() => navigate("/wallet")}
                        aria-label="Open wallet"
                    >
                        <img src={coinImg} alt="" />
                        <span>{streak.vesBalance}</span>
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


                {/* =====================================
                    DESKTOP PAGE HEADER
                ====================================== */}

                <header className={styles.pageHead}>

                    <div className={styles.pageHeadText}>
                        <h1>Daily Streak</h1>
                        <p>
                            Check in daily, maintain your streak, and
                            unlock bigger rewards every day!
                        </p>
                    </div>

                    <div className={styles.pageHeadActions}>

                        <button
                            type="button"
                            className={styles.balanceButton}
                            onClick={() => navigate("/wallet")}
                            aria-label="Open wallet"
                        >
                            <img src={coinImg} alt="" />
                            <span>{streak.vesBalance}</span>
                            <small>VES</small>
                        </button>

                        <button
                            type="button"
                            className={styles.logoutButton}
                            onClick={handleLogout}
                            aria-label="Logout"
                        >
                            <LogOut size={17} />
                        </button>

                        <div className={styles.streakTab}>
                            <img src={flameImg} alt="" />
                            <div>
                                <strong>{streak.currentStreak} Day Streak</strong>
                                <span>Keep it going!</span>
                            </div>
                        </div>

                    </div>

                </header>


                {/* =====================================
                    MOBILE BANNER
                ====================================== */}

                <section className={styles.banner}>

                    <div className={styles.bannerIcon}>
                        <CalendarCheck size={34} />
                    </div>

                    <div className={styles.bannerText}>
                        <h2>
                            Login Daily &amp; Earn
                            <br />
                            <span>Bigger Rewards!</span>
                        </h2>
                        <p>
                            Maintain your streak and unlock{" "}
                            <em>exciting rewards</em> every day.
                        </p>
                    </div>

                    <img
                        className={styles.bannerGift}
                        src={heroGiftImg}
                        alt=""
                    />

                </section>


                {/* =====================================
                    SUMMARY
                ====================================== */}

                <section className={styles.summary}>

                    {/* Desktop hero */}
                    <div className={styles.hero}>

                        <div className={styles.heroGift}>
                            <img src={heroGiftImg} alt="Daily rewards gift" />
                        </div>

                        <div className={styles.heroText}>
                            <h2>
                                Daily Check-In
                                <span>Rewards</span>
                            </h2>
                            <p>
                                Check in every day and earn
                                <br />
                                <em>exciting rewards!</em>
                            </p>
                        </div>

                    </div>


                    {/* Mobile streak row */}
                    <div className={styles.streakRow}>

                        <div className={styles.streakPill}>
                            <img src={flameImg} alt="" />
                            <span>{streak.currentStreak} Day Streak</span>
                        </div>

                        <button
                            type="button"
                            className={styles.calendarLink}
                            onClick={() => navigate("/streak-history")}
                        >
                            <CalendarDays size={14} />
                            Streak Calendar
                            <ChevronRight size={14} />
                        </button>

                    </div>


                    {/* Stats */}
                    <div className={styles.stats}>

                        <div className={styles.stat}>
                            <span className={`${styles.statIcon} ${styles.iconPurple}`}>
                                <WalletCards size={20} />
                            </span>
                            <div>
                                <small>Total Rewards</small>
                                <strong>{streak.totalRewards}</strong>
                            </div>
                        </div>

                        <div className={styles.stat}>
                            <span className={`${styles.statIcon} ${styles.iconGreen}`}>
                                <CalendarCheck size={20} />
                            </span>
                            <div>
                                <small>Checked In</small>
                                <strong>{streak.checkedIn}</strong>
                            </div>
                        </div>

                        <div className={styles.stat}>
                            <span className={`${styles.statIcon} ${styles.iconGold}`}>
                                <Star size={18} />
                            </span>
                            <div>
                                <small>Next Reward</small>
                                <strong className={styles.gold}>
                                    {streak.nextReward?.title || "See your reward cards"}
                                </strong>
                            </div>
                        </div>

                    </div>


                    {/* Ultimate reward */}
                    <div className={styles.ultimate}>

                        <div className={styles.crown}>
                            <img src={heroCrownImg} alt="Ultimate reward crown" />
                        </div>

                        <div className={styles.ultimateText}>
                            <span className={styles.ultimateLabel}>
                                Ultimate Reward
                            </span>

                            <h2>
                                {ultimateReward?.title || "Day 7"}
                            </h2>

                            <div className={styles.giftPill}>
                                <img src={day5Img} alt="" />
                                <span>
                                    {ultimateReward?.description || "Day 7 reward"}
                                </span>
                            </div>

                            <p className={styles.unlockInline}>
                                Unlock on <strong>Day 7</strong>
                            </p>
                        </div>

                        <div className={styles.unlockTile}>
                            <Lock size={22} />
                            <span>
                                Unlock on
                                <strong>Day 7</strong>
                            </span>
                        </div>

                    </div>

                </section>


                {/* =====================================
                    REMINDER
                ====================================== */}

                <div className={styles.reminder}>

                    <span className={styles.reminderLine}></span>

                    <p>
                        <Sparkle size={11} />
                        {streak.todayClaimed
                            ? <>Next claim in <strong>{countdown}</strong></>
                            : "Come back tomorrow for more rewards!"}
                        <Sparkle size={11} />
                    </p>

                    <span className={styles.reminderLine}></span>

                </div>


                {/* =====================================
                    MESSAGES
                ====================================== */}

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


                {/* =====================================
                    7 DAY REWARD GRID
                ====================================== */}

                <section className={styles.rewardGrid}>

                    {streak.rewards.map((reward) => {

                        const tag = getCardTag(reward);

                        return (

                            <article
                                key={reward.day}
                                role="button"
                                tabIndex={0}
                                className={`${styles.rewardCard} ${getDayStatusClass(
                                    reward.status
                                )} ${reward.day === 7 ? styles.vip : ""}`}
                                onClick={() => handleRewardClick(reward)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleRewardClick(reward);
                                    }
                                }}
                            >

                                <div className={styles.rewardTop}>

                                    <span className={styles.dayChip}>
                                        Day {reward.day}
                                    </span>

                                    {reward.status === "CLAIMED" && (
                                        <span className={styles.claimedBadge}>
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                    )}

                                    {reward.status !== "CLAIMED" && tag && (
                                        <span className={getTagClass(tag)}>
                                            {tag}
                                        </span>
                                    )}

                                </div>


                                <div className={styles.rewardImage}>
                                    <img
                                        src={getRewardImage(reward)}
                                        alt=""
                                    />
                                </div>


                                <span className={styles.rewardLabel}>
                                    {reward.day === 7
                                        ? "Ultimate Reward"
                                        : "Daily Reward"}
                                </span>

                                <strong className={styles.rewardAmount}>
                                    {getAmountText(reward)}
                                </strong>

                                <small className={styles.rewardSub}>
                                    {reward.description}
                                </small>


                                {reward.status === "AVAILABLE" ? (

                                    <button
                                        type="button"
                                        className={styles.claimButton}
                                        disabled={claiming}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClaim();
                                        }}
                                    >
                                        {claiming ? (
                                            "Claiming..."
                                        ) : (
                                            <>
                                                <span className={styles.claimDesktop}>Claim Reward</span>
                                                <span className={styles.claimMobile}>Claim Now</span>
                                                <ChevronRight size={14} />
                                            </>
                                        )}
                                    </button>

                                ) : reward.status === "CLAIMED" ? (

                                    <div className={styles.statusClaimed}>
                                        <Check size={13} strokeWidth={3} />
                                        Claimed
                                    </div>

                                ) : (

                                    <div className={styles.statusLocked}>
                                        <Lock size={12} />
                                        Locked
                                    </div>

                                )}

                            </article>
                        );
                    })}

                </section>


                {/* =====================================
                    BENEFITS
                ====================================== */}

                <section className={styles.benefits}>

                    <h3 className={styles.benefitsTitle}>
                        <Sparkle size={10} />
                        Why Maintain Your Streak?
                        <Sparkle size={10} />
                    </h3>

                    <div className={styles.benefitsGrid}>

                        <div className={styles.benefitItem}>
                            <img src={activeImg} alt="" />
                            <div>
                                <h4>Stay Active</h4>
                                <p>Keep your streak alive &amp; earn more!</p>
                            </div>
                        </div>

                        <div className={styles.benefitItem}>
                            <img src={biggerStreakImg} alt="" />
                            <div>
                                <h4>Bigger Streak</h4>
                                <p>More consecutive logins, bigger rewards!</p>
                            </div>
                        </div>

                        <div className={styles.benefitItem}>
                            <img src={exclusiveImg} alt="" />
                            <div>
                                <h4>Exclusive Rewards</h4>
                                <p>Get coins, gift cards &amp; special bonuses!</p>
                            </div>
                        </div>

                        <div className={styles.benefitItem}>
                            <img src={trustImg} alt="" />
                            <div>
                                <h4>Don't Miss Out</h4>
                                <p>Come back every day &amp; unlock all rewards!</p>
                            </div>
                        </div>

                    </div>

                </section>


                {/* =====================================
                    OFFICIAL REWARDS STRIP
                ====================================== */}

                <div className={styles.trustNotice}>
                    <img src={trustImg} alt="" />
                    <div className={styles.trustText}>
                        <strong>
                            Official rewards only on <span>VeloopRewards.in</span>
                        </strong>
                        <p>Stay active, stay rewarded!</p>
                    </div>
                    <ArrowRight className={styles.trustArrow} size={18} />
                </div>

            </div>


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
                            aria-label="Close"
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
