import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    History,
    WalletCards,
} from "lucide-react";

import { getTransactions } from "../services/streakApi";
import vesCoin from "../../assests/VEs_Coin.png";
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
            minute: "2-digit",
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
                        Back to Dashboard
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

            {/* NAVBAR */}
            <header className={styles.header}>
                <div className={styles.headerInner}>

                    <button
                        type="button"
                        className={styles.brand}
                        onClick={() => navigate("/dashboard")}
                    >
                        <div className={styles.brandMark}>
                            V
                        </div>

                        <div className={styles.brandText}>
                            <strong>VELoop</strong>
                            <span>Daily Streak</span>
                        </div>
                    </button>

                    <nav className={styles.navLinks}>
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
                            className={styles.activeLink}
                        >
                            Transactions
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/streak-history")}
                        >
                            Streak History
                        </button>
                    </nav>

                </div>
            </header>

            {/* MAIN */}
            <main className={styles.main}>

                {/* HEADING */}
                <section className={styles.pageHeading}>
                    <div>
                        <span className={styles.eyebrow}>
                            Wallet Activity
                        </span>

                        <h1>Transactions</h1>

                        <p>
                            A clear record of every reward added
                            to your VELoop wallet.
                        </p>
                    </div>

                    <div className={styles.countBadge}>
                        <strong>{transactions.length}</strong>
                        <span>Transactions</span>
                    </div>
                </section>

                {/* SUMMARY */}
                <section className={styles.summaryCard}>

                    <div className={styles.summaryLeft}>

                        <div className={styles.summaryCoin}>
                            <img
                                src={vesCoin}
                                alt="VES"
                            />
                        </div>

                        <div>
                            <span>TOTAL REWARD ACTIVITY</span>

                            <h2>
                                {totalAmount}
                                <small> VES</small>
                            </h2>
                        </div>

                    </div>

                    <div className={styles.summaryRight}>
                        <span>RECORDS</span>
                        <strong>{transactions.length}</strong>
                    </div>

                </section>

                {/* TRANSACTIONS */}
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
                                <img
                                    src={vesCoin}
                                    alt="VES coin"
                                />
                            </div>

                            <h3>No transactions yet</h3>

                            <p>
                                Your VES reward transactions will
                                appear here after you claim your
                                daily rewards.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                Claim a Reward
                                <ArrowRight size={16} />
                            </button>

                        </div>

                    ) : (

                        <div className={styles.transactionList}>

                            {transactions.map(
                                (transaction, index) => {

                                    const amount =
                                        transaction.amount ??
                                        transaction.gems ??
                                        transaction.vesAmount ??
                                        0;

                                    return (
                                        <div
                                            className={
                                                styles.transactionCard
                                            }
                                            key={
                                                transaction._id ||
                                                transaction.id ||
                                                index
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.transactionIcon
                                                }
                                            >
                                                <img
                                                    src={vesCoin}
                                                    alt="VES"
                                                />
                                            </div>

                                            <div
                                                className={
                                                    styles.transactionInfo
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.transactionTop
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.rewardTag
                                                        }
                                                    >
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
                                                    {
                                                        transaction.description ||
                                                        transaction.title ||
                                                        transaction.type ||
                                                        "VELoop Reward"
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        transaction.source ||
                                                        "DAILY_STREAK"
                                                    }
                                                </p>

                                            </div>

                                            <div
                                                className={styles.amount}
                                            >
                                                <strong>
                                                    +{amount}
                                                </strong>

                                                <span>VES</span>
                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </section>

            </main>

            {/* FOOTER */}
            <footer className={styles.footer}>

                <div className={styles.footerInner}>

                    <div className={styles.footerLogo}>
                        <div className={styles.footerBrandMark}>
                            V
                        </div>

                        <strong>VELoop Rewards</strong>
                    </div>

                    <div className={styles.footerLinks}>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/privacy-policy")
                            }
                        >
                            Privacy Policy
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/terms")
                            }
                        >
                            Terms
                        </button>

                    </div>

                </div>

                <p className={styles.copyright}>
                    © {new Date().getFullYear()} VELoop Rewards.
                    All rights reserved.
                </p>

            </footer>

        </div>
    );
}

export default Transactions;