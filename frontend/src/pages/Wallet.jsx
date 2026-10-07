import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWallet } from "../services/streakApi";
import styles from "./Wallet.module.css";

function Wallet() {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadWallet = async () => {
            try {
                const data = await getWallet();
                setWallet(data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load wallet."
                );
            } finally {
                setLoading(false);
            }
        };

        loadWallet();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loader}></div>
                <p>Loading your wallet...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorPage}>
                <div className={styles.errorBox}>
                    <div className={styles.errorIcon}>!</div>
                    <h3>Unable to load wallet</h3>
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

    const balance = wallet?.vesBalance ?? 0;

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
                        onClick={() => navigate("/transactions")}
                    >
                        📋 Transactions
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

                <div className={styles.heading}>

                    <span className={styles.kicker}>
                        💎 MY REWARDS
                    </span>

                    <h1>VES Wallet</h1>

                    <p>
                        Your earned VES, collected through daily consistency.
                    </p>

                </div>


                <section className={styles.walletHero}>

                    <div className={styles.walletTop}>

                        <div>
                            <span>AVAILABLE BALANCE</span>

                            <h2>
                                {balance}
                                <small>VES</small>
                            </h2>
                        </div>

                        <div className={styles.diamond}>
                            💎
                        </div>

                    </div>


                    <div className={styles.walletBottom}>

                        <span>VELoop Reward Wallet</span>

                        <span className={styles.walletStatus}>
                            ● Active
                        </span>

                    </div>

                </section>


                <section className={styles.quickGrid}>

                    <button
                        type="button"
                        className={styles.quickCard}
                        onClick={() => navigate("/transactions")}
                    >
                        <div className={styles.quickIcon}>
                            📋
                        </div>

                        <div>
                            <strong>Transactions</strong>
                            <span>View reward activity</span>
                        </div>

                        <b>→</b>
                    </button>


                    <button
                        type="button"
                        className={styles.quickCard}
                        onClick={() => navigate("/dashboard")}
                    >
                        <div className={styles.quickIcon}>
                            🎁
                        </div>

                        <div>
                            <strong>Daily Rewards</strong>
                            <span>Continue your streak</span>
                        </div>

                        <b>→</b>
                    </button>

                </section>


                <section className={styles.infoSection}>

                    <div className={styles.infoHeader}>
                        <div className={styles.infoIcon}>
                            💎
                        </div>

                        <div>
                            <span>ABOUT VES</span>
                            <h2>Your reward currency</h2>
                        </div>
                    </div>

                    <p>
                        VES is the reward currency used by the VELoop
                        Daily Streak system. Maintain your streak and
                        claim eligible rewards to increase your balance.
                    </p>

                </section>


                <section className={styles.tipCard}>

                    <span>🔥</span>

                    <div>
                        <strong>Keep your streak alive</strong>

                        <p>
                            Consistency unlocks more rewards. Come back
                            every day to continue your journey.
                        </p>
                    </div>

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

export default Wallet;