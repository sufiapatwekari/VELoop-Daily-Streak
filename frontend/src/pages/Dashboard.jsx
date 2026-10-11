import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CalendarCheck,
    CalendarDays,
    Check,
    ChevronDown,
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

/* ---- small helpers to read the signed-in user's info ---- */

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) || {} : {};
    } catch {
        return {};
    }
};

const readTokenUser = () => {
    try {
        const payload = localStorage.getItem("token")?.split(".")[1];

        if (!payload) {
            return {};
        }

        const json = decodeURIComponent(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(json) || {};
    } catch {
        return {};
    }
};

function Dashboard() {

    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [countdown, setCountdown] = useState("00:00:00");

    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

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
            setToast(null);

            const data = await claimStreak();

            setToast({
                id: Date.now(),
                title: "Reward Claimed!",
                message: `${data.reward.title} claimed successfully!`
            });

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

    /* success toast auto-dismiss */
    useEffect(() => {

        if (!toast) {
            return;
        }

        const timer = setTimeout(() => setToast(null), 5000);

        return () => clearTimeout(timer);

    }, [toast]);

    /* close the account menu on outside click / Escape */
    useEffect(() => {

        if (!menuOpen) {
            return;
        }

        const handleClick = (e) => {
            if (!e.target.closest("[data-user-menu]")) {
                setMenuOpen(false);
            }
        };

        const handleKey = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };

    }, [menuOpen]);

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

    /* signed-in user info */

    const storedUser = readStoredUser();
    const tokenUser = readTokenUser();

    const userEmail =
        storedUser.email ||
        streak.user?.email ||
        streak.email ||
        tokenUser.email ||
        "";

    const rawName =
        storedUser.name ||
        streak.user?.name ||
        streak.name ||
        streak.userName ||
        tokenUser.name ||
        tokenUser.username ||
        "";

    const userName =
        rawName ||
        (userEmail ? userEmail.split("@")[0] : "VELoop User");

    const userInitial =
        userName.trim().charAt(0).toUpperCase() || "U";

    const streakCount = Number(streak.currentStreak) || 0;

    const cycleCount = Math.min(
        Number(streak.checkedIn ?? streakCount) || 0,
        7
    );

    const renderUserMenu = () => (
        <div className={styles.userMenu} data-user-menu>

            <button
                type="button"
                className={styles.avatarButton}
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
            >
                <span className={styles.avatar}>
                    {userInitial}
                </span>

                <ChevronDown
                    size={14}
                    className={menuOpen ? styles.chevronOpen : ""}
                />
            </button>

            {menuOpen && (
                <div className={styles.menuPanel} role="menu">

                    <span className={styles.menuLabel}>
                        SIGNED IN AS
                    </span>

                    <strong className={styles.menuName}>
                        {userName}
                    </strong>

                    {userEmail && (
                        <span className={styles.menuEmail}>
                            {userEmail}
                        </span>
                    )}

                    <div className={styles.menuStats}>
                        <div>
                            <small>Streak</small>
                            <strong>
                                {streakCount} {streakCount === 1 ? "Day" : "Days"}
                            </strong>
                        </div>

                        <div>
                            <small>Cycle</small>
                            <strong>{cycleCount}/7</strong>
                        </div>
                    </div>

                    <button
                        type="button"
                        role="menuitem"
                        className={styles.menuItem}
                        onClick={() => {
                            setMenuOpen(false);
                            navigate("/wallet");
                        }}
                    >
                        <WalletCards size={16} />
                        View Wallet &amp; Ledger
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        className={`${styles.menuItem} ${styles.menuDanger}`}
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>

                </div>
            )}

        </div>
    );

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
                        onClick={goToLogin}
                        aria-label="Back to login"
                    >
                        <ArrowLeft size={19} />
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

                    {renderUserMenu()}

                </div>


                {/* =====================================
                    DESKTOP PAGE HEADER
                ====================================== */}

                <header className={styles.pageHead}>

                    <div className={styles.pageHeadLeft}>

                        <button
                            type="button"
                            className={`${styles.backButton} ${styles.pageBack}`}
                            onClick={goToLogin}
                            aria-label="Back to login"
                            title="Back to login"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div className={styles.pageHeadText}>
                            <h1>Daily Streak</h1>
                            <p>
                                Check in daily, maintain your streak, and
                                unlock bigger rewards every day!
                            </p>
                        </div>

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

                        {renderUserMenu()}

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

            {toast && (

                <div
                    className={styles.toastWrap}
                    role="status"
                    aria-live="polite"
                >

                    <div className={styles.toast} key={toast.id}>

                        <div className={styles.confetti} aria-hidden="true">
                            {Array.from({ length: 14 }).map((_, i) => (
                                <span key={i} style={{ "--i": i }} />
                            ))}
                        </div>

                        <div className={styles.toastIcon}>
                            <Check size={22} strokeWidth={3} />
                        </div>

                        <div className={styles.toastText}>
                            <strong>{toast.title}</strong>
                            <span>{toast.message}</span>
                        </div>

                        <button
                            type="button"
                            className={styles.toastClose}
                            onClick={() => setToast(null)}
                            aria-label="Dismiss"
                        >
                            <X size={15} />
                        </button>

                        <span className={styles.toastBar} />

                    </div>

                </div>

            )}


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
