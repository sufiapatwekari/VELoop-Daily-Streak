import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    History,
    WalletCards,
} from "lucide-react";

import { getWallet } from "../services/streakApi";
import styles from "./Wallet.module.css";

import vesCoin from "../../assests/VEs_Coin.png";
import flame from "../../assests/Flame.png";
import trust from "../../assests/Trust.png";

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

                <img
                    src={flame}
                    alt=""
                    className={styles.loadingImage}
                />

                <p>Loading your wallet...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorPage}>
                <div className={styles.errorBox}>

                    <div className={styles.errorIcon}>
                        !
                    </div>

                    <h3>Unable to load wallet</h3>

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

    const balance = wallet?.vesBalance ?? 0;

    return (
        <div className={styles.page}>

            {/* ================= NAVBAR ================= */}

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
                            <span>Daily Rewards</span>
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
                            className={styles.activeLink}
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
                            onClick={() => navigate("/streak-history")}
                        >
                            Streak History
                        </button>

                    </nav>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className={styles.main}>

                {/* PAGE HEADING */}

                <section className={styles.pageHeading}>

                    <span className={styles.eyebrow}>
                        VELoop Rewards
                    </span>

                    <h1>My Wallet</h1>

                    <p>
                        View your earned VES and keep track of your
                        reward balance.
                    </p>

                </section>


                {/* ================= BALANCE ================= */}

                <section className={styles.balanceCard}>

                    <div className={styles.balanceGlow}></div>

                    <div className={styles.balanceTop}>

                        <div className={styles.walletIcon}>
                            <WalletCards size={21} />
                        </div>

                        <span>
                            Available Balance
                        </span>

                    </div>


                    <div className={styles.balanceMain}>

                        <div>

                            <div className={styles.balanceValue}>
                                {balance}
                                <span> VES</span>
                            </div>

                            <p className={styles.balanceDescription}>
                                Your earned VES rewards are stored in your
                                VELoop wallet.
                            </p>

                        </div>


                        <div className={styles.coinDisplay}>

                            <img
                                src={vesCoin}
                                alt="VES Coins"
                            />

                        </div>

                    </div>

                </section>


                {/* ================= QUICK ACTIONS ================= */}

                <section className={styles.actionsGrid}>

                    <button
                        type="button"
                        className={styles.actionCard}
                        onClick={() => navigate("/transactions")}
                    >

                        <div className={styles.actionIcon}>
                            <History size={20} />
                        </div>

                        <div className={styles.actionContent}>

                            <strong>
                                Transactions
                            </strong>

                            <span>
                                View your reward activity
                            </span>

                        </div>

                        <ArrowRight
                            size={18}
                            className={styles.actionArrow}
                        />

                    </button>


                    <button
                        type="button"
                        className={styles.actionCard}
                        onClick={() => navigate("/dashboard")}
                    >

                        <div className={styles.actionIcon}>
                            <WalletCards size={20} />
                        </div>

                        <div className={styles.actionContent}>

                            <strong>
                                Daily Rewards
                            </strong>

                            <span>
                                Continue your streak
                            </span>

                        </div>

                        <ArrowRight
                            size={18}
                            className={styles.actionArrow}
                        />

                    </button>

                </section>


                {/* ================= ABOUT VES ================= */}

                <section className={styles.infoSection}>

                    <div className={styles.infoHeader}>

                        <div className={styles.infoIcon}>
                            <img
                                src={vesCoin}
                                alt="VES"
                            />
                        </div>

                        <div>

                            <span>
                                ABOUT VES
                            </span>

                            <h2>
                                Your reward currency
                            </h2>

                        </div>

                    </div>


                    <p>
                        VES is the reward currency used by the
                        VELoop Daily Streak system. Maintain your
                        streak and claim eligible rewards to increase
                        your balance.
                    </p>

                </section>


                {/* ================= STREAK TIP ================= */}

                <section className={styles.tipCard}>

                    <div className={styles.tipIcon}>

                        <img
                            src={flame}
                            alt="Streak"
                        />

                    </div>

                    <div>

                        <strong>
                            Keep your streak alive
                        </strong>

                        <p>
                            Consistency unlocks more rewards.
                            Come back every day to continue
                            your journey.
                        </p>

                    </div>

                </section>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className={styles.footer}>

                <div className={styles.footerInner}>

                    <div className={styles.footerLogo}>

                        <div className={styles.footerBrandMark}>
                            V
                        </div>

                        <strong>
                            VELoop Rewards
                        </strong>

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

export default Wallet;