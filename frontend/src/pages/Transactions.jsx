
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    History,
    Wallet,
    RefreshCw,
    X,
    ShieldCheck,
} from "lucide-react";

import { getTransactions } from "../services/streakApi";
import vesCoin from "../../assests/VEs_Coin.png";
import flame from "../../assests/Flame.png";
import styles from "./Transactions.module.css";

function Transactions() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    const loadTransactions = async () => {
        try {
            setError("");

            const data = await getTransactions();

            const transactionData = Array.isArray(data)
                ? data
                : data?.transactions || data?.data || [];

            setTransactions(
                Array.isArray(transactionData) ? transactionData : []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load transaction history."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getAmount = (transaction) =>
        Number(
            transaction.amount ??
            transaction.gems ??
            transaction.vesAmount ??
            0
        );

    const totalAmount = transactions.reduce(
        (total, transaction) => total + getAmount(transaction),
        0
    );

    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === "all") return true;

        const type = String(
            transaction.type || "DAILY REWARD"
        ).toLowerCase();

        if (filter === "ves") {
            return (
                type.includes("ves") ||
                type.includes("coin") ||
                type.includes("reward") ||
                type.includes("streak")
            );
        }

        return type.includes("voucher");
    });

    if (loading) {
        return (
            <div className={styles.statusPage}>
                <div className={styles.loader}></div>
                <p>Loading transaction history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.statusPage}>
                <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>!</div>
                    <h2>Unable to load transactions</h2>
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
            {/* PAGE HEADER */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <div className={styles.headerIcon}>
                        <Wallet size={22} />
                    </div>

                    <div>
                        <h1>Transaction Ledger</h1>
                        <p>
                            Your recorded VES rewards and wallet activity
                        </p>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={loadTransactions}
                        aria-label="Refresh transactions"
                        title="Refresh transactions"
                    >
                        <RefreshCw size={17} />
                    </button>

                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => navigate("/wallet")}
                        aria-label="Back to wallet"
                        title="Back to wallet"
                    >
                        <X size={18} />
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                {/* SUMMARY CARDS */}
                <section className={styles.balanceGrid}>
                    <article className={styles.balanceCard}>
                        <div className={styles.cardTop}>
                            <div className={styles.coinIcon}>
                                <img src={vesCoin} alt="VES coin" />
                            </div>

                            <span className={styles.purpleBadge}>
                                PLATFORM COIN
                            </span>
                        </div>

                        <div className={styles.balanceDetails}>
                            <span className={styles.balanceLabel}>
                                Total Transaction Amount
                            </span>

                            <div className={styles.balanceValue}>
                                {totalAmount.toLocaleString("en-IN")}
                                <small>VES</small>
                            </div>
                        </div>

                        <div className={styles.cardFoot}>
                            <span>Transaction activity</span>
                            <ShieldCheck size={14} />
                        </div>
                    </article>

                    <article className={styles.recordsCard}>
                        <div className={styles.cardTop}>
                            <div className={styles.recordsIcon}>
                                <History size={21} />
                            </div>

                            <span className={styles.goldBadge}>
                                ACTIVITY LOG
                            </span>
                        </div>

                        <div className={styles.balanceDetails}>
                            <span className={styles.balanceLabel}>
                                Total Records
                            </span>

                            <div className={styles.balanceValue}>
                                {transactions.length}
                                <small>
                                    {transactions.length === 1
                                        ? "record"
                                        : "records"}
                                </small>
                            </div>
                        </div>

                        <div className={styles.cardFoot}>
                            <span>Loaded from your account</span>
                            <History size={14} />
                        </div>
                    </article>
                </section>

                {/* TRANSACTION LEDGER */}
                <section className={styles.ledger}>
                    <div className={styles.ledgerHeader}>
                        <div>
                            <h2>Transaction Ledger</h2>
                            <p>Review your recorded transaction details</p>
                        </div>

                        <div className={styles.filters}>
                            <button
                                type="button"
                                className={
                                    filter === "all" ? styles.selectedFilter : ""
                                }
                                onClick={() => setFilter("all")}
                            >
                                All ({transactions.length})
                            </button>

                            <button
                                type="button"
                                className={
                                    filter === "ves" ? styles.selectedFilter : ""
                                }
                                onClick={() => setFilter("ves")}
                            >
                                VES Coins
                            </button>

                            <button
                                type="button"
                                className={
                                    filter === "voucher"
                                        ? styles.selectedFilter
                                        : ""
                                }
                                onClick={() => setFilter("voucher")}
                            >
                                Vouchers
                            </button>
                        </div>
                    </div>

                    {filteredTransactions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <img src={flame} alt="" />
                            </div>

                            <h3>
                                {transactions.length === 0
                                    ? "No transactions yet"
                                    : "No matching transactions"}
                            </h3>

                            <p>
                                {transactions.length === 0
                                    ? "Your transaction records will appear here when activity is available."
                                    : "Try selecting another transaction filter."}
                            </p>

                            {transactions.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Go to Dashboard
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={styles.transactionList}>
                            {filteredTransactions.map((transaction, index) => {
                                const amount = getAmount(transaction);

                                const transactionDate =
                                    transaction.createdAt ||
                                    transaction.date ||
                                    transaction.timestamp;

                                const description =
                                    transaction.description ||
                                    transaction.title ||
                                    transaction.type ||
                                    "VELoop Reward";

                                const source =
                                    transaction.source || "DAILY_STREAK";

                                return (
                                    <article
                                        className={styles.transactionRow}
                                        key={
                                            transaction._id ||
                                            transaction.id ||
                                            `${transactionDate || "transaction"}-${index}`
                                        }
                                    >
                                        <div className={styles.transactionIcon}>
                                            <img src={flame} alt="Activity" />
                                        </div>

                                        <div className={styles.transactionInfo}>
                                            <div className={styles.transactionTitle}>
                                                <h3>{description}</h3>

                                                <span className={styles.typeBadge}>
                                                    {String(
                                                        transaction.type ||
                                                        "DAILY REWARD"
                                                    ).replaceAll("_", " ")}
                                                </span>
                                            </div>

                                            <p>{source}</p>

                                            <time>
                                                {formatDate(transactionDate)}
                                            </time>
                                        </div>

                                        <div className={styles.amount}>
                                            <strong className={
                                                amount < 0
                                                    ? styles.negativeAmount
                                                    : ""
                                            }>
                                                {amount >= 0 ? "+" : ""}
                                                {amount.toLocaleString("en-IN")}
                                            </strong>

                                            <span>
                                                <img src={vesCoin} alt="" />
                                                VES
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Transactions;

