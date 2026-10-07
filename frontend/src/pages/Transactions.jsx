import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../services/streakApi";
import styles from "./Transactions.module.css";

function Transactions() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await getTransactions();

                const transactionData =
                    Array.isArray(data)
                        ? data
                        : data.transactions || data.data || [];

                setTransactions(transactionData);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load transaction history."
                );
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
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
                <p>Loading wallet activity...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorPage}>
                <div className={styles.errorBox}>
                    <div className={styles.errorIcon}>!</div>
                    <h3>Unable to load transactions</h3>
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

    const totalAmount = transactions.reduce(
        (total, transaction) =>
            total +
            Number(
                transaction.amount ??
                transaction.gems ??
                transaction.vesAmount ??
                0
            ),
        0
    );

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
                        onClick={() => navigate("/streak-history")}
                    >
                        🔥 Streak
                    </button>

                </nav>

            </header>


            <main className={styles.main}>

                <div className={styles.headingRow}>

                    <div>
                        <span className={styles.kicker}>
                            💎 WALLET ACTIVITY
                        </span>

                        <h1>Transactions</h1>

                        <p>
                            A clear record of every reward added to your wallet.
                        </p>
                    </div>

                    <div className={styles.countBadge}>
                        <strong>{transactions.length}</strong>
                        <span>Transactions</span>
                    </div>

                </div>


                <section className={styles.balanceStrip}>

                    <div className={styles.balanceIcon}>
                        💎
                    </div>

                    <div>
                        <span>TOTAL REWARD ACTIVITY</span>

                        <h2>
                            {totalAmount} <small>VES</small>
                        </h2>
                    </div>

                    <div className={styles.balanceSide}>
                        <span>RECORDS</span>
                        <strong>{transactions.length}</strong>
                    </div>

                </section>


                <section className={styles.transactionSection}>

                    <div className={styles.sectionHeading}>
                        <div>
                            <span>HISTORY</span>
                            <h2>Recent Transactions</h2>
                        </div>
                    </div>


                    {transactions.length === 0 ? (

                        <div className={styles.emptyState}>

                            <div className={styles.emptyIcon}>
                                💎
                            </div>

                            <h3>No transactions yet</h3>

                            <p>
                                Your VES reward transactions will appear
                                here after you claim your daily rewards.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                Claim a Reward →
                            </button>

                        </div>

                    ) : (

                        <div className={styles.transactionList}>

                            {transactions.map((transaction, index) => {

                                const amount =
                                    transaction.amount ??
                                    transaction.gems ??
                                    transaction.vesAmount ??
                                    0;

                                return (
                                    <div
                                        className={styles.transactionCard}
                                        key={
                                            transaction._id ||
                                            transaction.id ||
                                            index
                                        }
                                    >

                                        <div className={styles.transactionIcon}>
                                            💎
                                        </div>


                                        <div className={styles.transactionInfo}>

                                            <div className={styles.transactionTop}>

                                                <span className={styles.rewardTag}>
                                                    DAILY REWARD
                                                </span>

                                                <small>
                                                    {formatDate(
                                                        transaction.createdAt ||
                                                        transaction.date ||
                                                        transaction.timestamp
                                                    )}
                                                </small>

                                            </div>

                                            <h3>
                                                {transaction.description ||
                                                    transaction.title ||
                                                    transaction.type ||
                                                    "VELoop Reward"}
                                            </h3>

                                            <p>
                                                {transaction.source ||
                                                    "DAILY_STREAK"}
                                            </p>

                                        </div>


                                        <div className={styles.amount}>
                                            <strong>+{amount}</strong>
                                            <span>VES</span>
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

export default Transactions;