
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    History,
    RefreshCw,
    ShieldCheck,
    WalletCards,
    X,
} from "lucide-react";

import {
    getWallet,
    getTransactions,
} from "../services/streakApi";

import styles from "./Wallet.module.css";

import vesCoin from "../../assests/VEs_Coin.png";
import flame from "../../assests/Flame.png";

function Wallet() {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [transactionError, setTransactionError] = useState("");

    const navigate = useNavigate();

    const loadWalletData = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");
        setTransactionError("");

        try {
            const walletData = await getWallet();
            setWallet(walletData);
        } catch (err) {
            console.error("Wallet loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load your wallet."
            );

            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            const transactionData = await getTransactions();

            let list = [];

            if (Array.isArray(transactionData)) {
                list = transactionData;
            } else if (Array.isArray(transactionData?.transactions)) {
                list = transactionData.transactions;
            } else if (Array.isArray(transactionData?.data)) {
                list = transactionData.data;
            } else if (Array.isArray(transactionData?.history)) {
                list = transactionData.history;
            }

            setTransactions(list);
        } catch (err) {
            console.error("Transaction loading error:", err);

            setTransactionError(
                err.response?.data?.message ||
                "Unable to load transactions right now."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadWalletData();
    }, [loadWalletData]);

    const balance =
        wallet?.vesBalance ??
        wallet?.balance ??
        0;

    const formatAmount = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return String(value ?? 0);
        }

        return number.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        });
    };

    const getType = (item) => {
        const type = String(
            item?.type ??
            item?.transactionType ??
            item?.category ??
            ""
        ).toLowerCase();

        return type.includes("debit") ||
            type.includes("spent") ||
            type.includes("deduct")
            ? "debit"
            : "credit";
    };

    const getTitle = (item) => (
        item?.description ??
        item?.title ??
        item?.transactionType ??
        item?.type ??
        "Wallet transaction"
    );

    const getAmount = (item) => (
        item?.amount ??
        item?.rewardAmount ??
        item?.coins ??
        item?.vesAmount ??
        item?.value ??
        null
    );

    const getDate = (item) => {
        const value =
            item?.createdAt ??
            item?.timestamp ??
            item?.date ??
            item?.transactionDate;

        if (!value) return "Date unavailable";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredTransactions = transactions.filter((item) => {
        if (activeFilter === "all") return true;

        return getType(item) === activeFilter;
    });

    if (loading) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loader} />

                <img
                    src={flame}
                    alt=""
                    className={styles.loadingImage}
                />

                <p>Loading your wallet...</p>
            </div>
        );
    }

    if (error && !wallet) {
        return (
            <div className={styles.errorPage}>
                <div className={styles.errorBox}>
                    <div className={styles.errorIcon}>!</div>

                    <h2>Unable to load wallet</h2>
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() => loadWalletData()}
                    >
                        Try Again
                    </button>

                    <button
                        type="button"
                        className={styles.secondaryButton}
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
            <main className={styles.walletPanel}>
                {/* Header */}
                <header className={styles.walletHeader}>
                    <div className={styles.headerIcon}>
                        <WalletCards size={23} />
                    </div>

                    <div className={styles.headerText}>
                        <h1>My Wallet</h1>
                        <p>Your VES balance and reward activity</p>
                    </div>

                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => loadWalletData(true)}
                        disabled={refreshing}
                        aria-label="Refresh wallet"
                        title="Refresh wallet"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing ? styles.spinIcon : ""
                            }
                        />
                    </button>

                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => navigate("/dashboard")}
                        aria-label="Close wallet"
                        title="Back to dashboard"
                    >
                        <X size={19} />
                    </button>
                </header>

                {/* Balance */}
                <section className={styles.balanceGrid}>
                    <article className={styles.balanceCard}>
                        <div className={styles.balanceTop}>
                            <div className={styles.coinIcon}>
                                <img src={vesCoin} alt="VES coin" />
                            </div>

                            <span className={styles.balanceBadge}>
                                VES REWARDS
                            </span>
                        </div>

                        <span className={styles.balanceLabel}>
                            Available Balance
                        </span>

                        <div className={styles.balanceValue}>
                            {formatAmount(balance)}
                            <span> VES</span>
                        </div>

                        <div className={styles.balanceFoot}>
                            <ShieldCheck size={14} />
                            <span>Your wallet reward balance</span>
                        </div>

                        <div className={styles.cardGlow} />
                    </article>

                    <article className={styles.rewardCard}>
                        <div className={styles.rewardImage}>
                            <img src={flame} alt="Daily streak" />
                        </div>

                        <div className={styles.rewardText}>
                            <span>DAILY REWARDS</span>
                            <h2>Keep your streak alive</h2>
                            <p>
                                Return daily and continue earning
                                eligible VES rewards.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                Go to Dashboard
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </article>
                </section>

                {/* Transactions */}
                <section className={styles.ledgerSection}>
                    <div className={styles.ledgerHeading}>
                        <div>
                            <h2>Transaction History</h2>
                            <p>
                                Review your recent wallet activity
                            </p>
                        </div>

                        <button
                            type="button"
                            className={styles.viewAllButton}
                            onClick={() => navigate("/transactions")}
                        >
                            View All
                            <ArrowRight size={15} />
                        </button>
                    </div>

                    <div
                        className={styles.filterBar}
                        role="group"
                        aria-label="Filter wallet transactions"
                    >
                        <button
                            type="button"
                            className={
                                activeFilter === "all"
                                    ? styles.activeFilter
                                    : ""
                            }
                            onClick={() => setActiveFilter("all")}
                        >
                            All ({transactions.length})
                        </button>

                        <button
                            type="button"
                            className={
                                activeFilter === "credit"
                                    ? styles.activeFilter
                                    : ""
                            }
                            onClick={() => setActiveFilter("credit")}
                        >
                            Rewards
                        </button>

                        <button
                            type="button"
                            className={
                                activeFilter === "debit"
                                    ? styles.activeFilter
                                    : ""
                            }
                            onClick={() => setActiveFilter("debit")}
                        >
                            Deductions
                        </button>
                    </div>

                    {transactionError ? (
                        <div className={styles.emptyState}>
                            <History size={24} />
                            <p>{transactionError}</p>

                            <button
                                type="button"
                                onClick={() => loadWalletData(true)}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <History size={23} />
                            </div>

                            <h3>
                                {transactions.length === 0
                                    ? "No transactions yet"
                                    : "No matching transactions"}
                            </h3>

                            <p>
                                {transactions.length === 0
                                    ? "Your wallet activity will appear here when available."
                                    : "Choose another filter to see your activity."}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.transactionList}>
                            {filteredTransactions.map((item, index) => {
                                const type = getType(item);
                                const amount = getAmount(item);

                                const key =
                                    item?.id ??
                                    item?._id ??
                                    item?.transactionId ??
                                    `${getDate(item)}-${index}`;

                                return (
                                    <article
                                        className={styles.transactionRow}
                                        key={key}
                                    >
                                        <div
                                            className={`${styles.transactionIcon} ${
                                                type === "debit"
                                                    ? styles.debitIcon
                                                    : ""
                                            }`}
                                        >
                                            <img
                                                src={vesCoin}
                                                alt=""
                                            />
                                        </div>

                                        <div
                                            className={styles.transactionInfo}
                                        >
                                            <strong>{getTitle(item)}</strong>
                                            <span>{getDate(item)}</span>
                                        </div>

                                        <div
                                            className={`${styles.transactionAmount} ${
                                                type === "debit"
                                                    ? styles.debitAmount
                                                    : ""
                                            }`}
                                        >
                                            <strong>
                                                {amount === null
                                                    ? "—"
                                                    : `${type === "debit" ? "−" : "+"}${formatAmount(amount)} VES`}
                                            </strong>

                                            <span>
                                                {type === "debit"
                                                    ? "Deduction"
                                                    : "Reward"}
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {/* Keep both navigation options */}
                    <div className={styles.bottomActions}>
                        <button
                            type="button"
                            onClick={() => navigate("/transactions")}
                        >
                            <History size={17} />
                            Transactions
                            <ArrowRight size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/streak-history")}
                        >
                            <WalletCards size={17} />
                            Streak History
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Wallet;

