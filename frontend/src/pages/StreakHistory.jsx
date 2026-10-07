import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStreakHistory } from "../services/streakApi";
import styles from "./StreakHistory.module.css";

function StreakHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await getStreakHistory();

                const historyData =
                    Array.isArray(data)
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
        if (!date) {
            return "N/A";
        }

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
                <div className={styles.loader}></div>
                <p>Loading your journey...</p>
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
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>

            <header className={styles.header}>

                <button
                    className={styles.logo}
                    type="button"
                    onClick={() => navigate("/dashboard")}
                >
                    <span className={styles.logoIcon}>V</span>

                    <span>
                        <strong>VELoop</strong>
                        <small>Daily Rewards</small>
                    </span>
                </button>


                <nav className={styles.nav}>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                    >
                        🏠 Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/wallet")}
                    >
                        💎 Wallet
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/transactions")}
                    >
                        📋 Transactions
                    </button>

                </nav>

            </header>


            <main className={styles.main}>

                <div className={styles.headingRow}>

                    <div>
                        <span className={styles.kicker}>
                            🔥 YOUR JOURNEY
                        </span>

                        <h1>Streak History</h1>

                        <p>
                            Every check-in is a step toward your next reward.
                        </p>
                    </div>

                    <div className={styles.recordBadge}>
                        <strong>{history.length}</strong>
                        <span>Records</span>
                    </div>

                </div>


                <section className={styles.overviewCard}>

                    <div className={styles.overviewIcon}>
                        🔥
                    </div>

                    <div className={styles.overviewText}>
                        <span>STREAK ACTIVITY</span>

                        <h2>
                            {history.length > 0
                                ? "Your journey is underway"
                                : "Your journey starts here"}
                        </h2>

                        <p>
                            {history.length > 0
                                ? "Keep checking in to unlock more rewards."
                                : "Claim your first daily reward to create your history."}
                        </p>
                    </div>

                    <div className={styles.overviewDiamond}>
                        💎
                    </div>

                </section>


                <section className={styles.historySection}>

                    <div className={styles.sectionTitle}>
                        <div>
                            <span>ACTIVITY</span>
                            <h2>Reward Journey</h2>
                        </div>
                    </div>


                    {history.length === 0 ? (

                        <div className={styles.emptyState}>

                            <div className={styles.emptyCircle}>
                                💎
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
                                Start My Streak →
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
                                    <div
                                        className={styles.timelineItem}
                                        key={
                                            item._id ||
                                            item.id ||
                                            index
                                        }
                                    >

                                        <div className={styles.timelineRail}>
                                            <div className={styles.timelineDot}>
                                                ✓
                                            </div>

                                            {index !== history.length - 1 && (
                                                <div className={styles.timelineLine}></div>
                                            )}
                                        </div>


                                        <div className={styles.historyCard}>

                                            <div className={styles.cardIcon}>
                                                💎
                                            </div>

                                            <div className={styles.cardContent}>

                                                <div className={styles.cardTop}>
                                                    <span>
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
                                                    Daily streak activity recorded
                                                    successfully.
                                                </p>

                                            </div>

                                            <div className={styles.completed}>
                                                ✓
                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </section>

            </main>


            <footer className={styles.footer}>

                <span>
                    © {new Date().getFullYear()} VELoop. All rights reserved.
                </span>

                <div>

                    <button
                        type="button"
                        onClick={() => navigate("/privacy-policy")}
                    >
                        Privacy
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/terms")}
                    >
                        Terms
                    </button>

                </div>

            </footer>

        </div>
    );
}

export default StreakHistory;