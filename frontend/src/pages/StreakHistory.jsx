
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStreakHistory } from "../services/streakApi";
import styles from "./StreakHistory.module.css";

import flame from "../../assests/Flame.png";
import vesCoin from "../../assests/VEs_Coin.png";
import trust from "../../assests/Trust.png";

function StreakHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await getStreakHistory();

                const historyData = Array.isArray(data)
                    ? data
                    : data.history || data.data || [];

                setHistory(historyData);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load streak history."
                );
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loadingCard}>
                    <div className={styles.loader}></div>
                    <img src={flame} alt="" className={styles.loadingImage} />
                    <h2>Loading your journey</h2>
                    <p>Getting your latest streak activity...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorPage}>
                <div className={styles.errorBox}>
                    <div className={styles.errorIcon}>!</div>
                    <h3>Unable to load history</h3>
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <main className={styles.panel}>
                {/* PAGE HEADER */}
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <div className={styles.headerIcon}>
                            <img src={flame} alt="" />
                        </div>

                        <div>
                            <h1>Streak History</h1>
                            <p>Your daily check-ins and reward journey</p>
                        </div>
                    </div>

                    <div className={styles.headerActions}>
                        <button
                            type="button"
                            className={styles.headerButton}
                            onClick={() => window.location.reload()}
                            aria-label="Refresh streak history"
                            title="Refresh"
                        >
                            ↻
                        </button>

                        <button
                            type="button"
                            className={styles.headerButton}
                            onClick={() => navigate("/dashboard")}
                            aria-label="Close streak history"
                            title="Back to dashboard"
                        >
                            ×
                        </button>
                    </div>
                </header>

                {/* NAVIGATION */}
                <nav className={styles.nav}>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/wallet")}
                    >
                        Wallet
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/transactions")}
                    >
                        Transactions
                    </button>

                    <button
                        type="button"
                        className={styles.activeNav}
                    >
                        Streak History
                    </button>
                </nav>

                {/* MAIN CONTENT */}
                <div className={styles.main}>
                    <section className={styles.headingRow}>
                        <div>
                            <span className={styles.eyebrow}>
                                <img src={flame} alt="" />
                                YOUR DAILY JOURNEY
                            </span>

                            <h2>Every day counts.</h2>

                            <p>
                                Track your check-ins and keep building
                                your VELoop streak.
                            </p>
                        </div>

                        <div className={styles.recordBadge}>
                            <strong>{history.length}</strong>
                            <span>
                                {history.length === 1 ? "Record" : "Records"}
                            </span>
                        </div>
                    </section>

                    {/* OVERVIEW */}
                    <section className={styles.overviewGrid}>
                        <div className={styles.overviewCard}>
                            <div className={styles.overviewTop}>
                                <div className={styles.overviewIcon}>
                                    <img src={flame} alt="Streak" />
                                </div>

                                <span className={styles.purpleTag}>
                                    STREAK ACTIVITY
                                </span>
                            </div>

                            <div className={styles.overviewLabel}>
                                YOUR JOURNEY
                            </div>

                            <h3>
                                {history.length > 0
                                    ? "Your journey is underway"
                                    : "Your journey starts here"}
                            </h3>

                            <p>
                                {history.length > 0
                                    ? "Keep checking in to continue your reward journey."
                                    : "Claim your first daily reward to create your history."}
                            </p>

                            <div className={styles.cardDecoration}>
                                <img src={flame} alt="" />
                            </div>
                        </div>

                        <div className={styles.overviewCard}>
                            <div className={styles.overviewTop}>
                                <div className={styles.coinIcon}>
                                    <img src={vesCoin} alt="VES coins" />
                                </div>

                                <span className={styles.greenTag}>
                                    VERIFIED ACTIVITY
                                </span>
                            </div>

                            <div className={styles.overviewLabel}>
                                HISTORY RECORDS
                            </div>

                            <h3>{history.length} activity records</h3>

                            <p>
                                Your recorded streak events are collected
                                here for easy reference.
                            </p>

                            <div className={styles.cardDecoration}>
                                <img src={trust} alt="" />
                            </div>
                        </div>
                    </section>

                    {/* HISTORY LIST */}
                    <section className={styles.historySection}>
                        <div className={styles.sectionHeading}>
                            <div>
                                <span className={styles.sectionEyebrow}>
                                    ACTIVITY LOG
                                </span>
                                <h2>Reward Journey</h2>
                            </div>

                            <span className={styles.countPill}>
                                {history.length}{" "}
                                {history.length === 1 ? "entry" : "entries"}
                            </span>
                        </div>

                        {history.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <img src={flame} alt="" />
                                </div>

                                <h3>No activity yet</h3>

                                <p>
                                    Your daily reward claims will appear here
                                    as you build your VELoop streak.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Start My Streak
                                    <span>→</span>
                                </button>
                            </div>
                        ) : (
                            <div className={styles.timeline}>
                                {history.map((item, index) => {
                                    const day =
                                        item.day ||
                                        item.currentDay ||
                                        item.rewardDay ||
                                        "-";

                                    const description =
                                        item.description ||
                                        item.event ||
                                        item.action ||
                                        "Streak Activity";

                                    return (
                                        <article
                                            className={styles.timelineItem}
                                            key={item._id || item.id || index}
                                        >
                                            <div className={styles.timelineRail}>
                                                <div className={styles.timelineDot}>
                                                    ✓
                                                </div>

                                                {index !== history.length - 1 && (
                                                    <div
                                                        className={styles.timelineLine}
                                                    />
                                                )}
                                            </div>

                                            <div className={styles.historyCard}>
                                                <div className={styles.cardIcon}>
                                                    <img
                                                        src={vesCoin}
                                                        alt="Reward"
                                                    />
                                                </div>

                                                <div className={styles.cardContent}>
                                                    <div className={styles.cardTop}>
                                                        <span className={styles.dayTag}>
                                                            DAY {day}
                                                        </span>

                                                        <small>
                                                            {formatDate(
                                                                item.createdAt ||
                                                                item.date ||
                                                                item.timestamp
                                                            )}
                                                        </small>
                                                    </div>

                                                    <h3>{description}</h3>

                                                    <p>
                                                        Daily streak activity
                                                        recorded successfully.
                                                    </p>
                                                </div>

                                                <div
                                                    className={styles.completed}
                                                    title="Recorded activity"
                                                >
                                                    ✓
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default StreakHistory;

