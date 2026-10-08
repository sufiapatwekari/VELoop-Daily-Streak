import { useNavigate } from "react-router-dom";
import styles from "./PrivacyPolicy.module.css";

function PrivacyPolicy() {
    const navigate = useNavigate();

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

                <section className={styles.pageHeading}>

                    <span className={styles.eyebrow}>
                        LEGAL
                    </span>

                    <h1>
                        Privacy Policy
                    </h1>

                    <p>
                        Learn how VELoop handles account, streak,
                        reward, wallet, and application information.
                    </p>

                </section>


                {/* ================= CONTENT ================= */}

                <section className={styles.content}>

                    <section className={styles.contentSection}>

                        <h2>
                            1. Introduction
                        </h2>

                        <p>
                            Welcome to VELoop. This Privacy Policy explains
                            how information is handled when you use the VELoop
                            Daily Streak application.
                        </p>

                        <p>
                            VELoop is designed to provide users with a daily
                            streak and reward experience while maintaining
                            appropriate protection of account information.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            2. Information We Collect
                        </h2>

                        <p>
                            When you create and use a VELoop account, the
                            application may collect information required for
                            account management and application functionality,
                            including:
                        </p>

                        <ul>
                            <li>Name</li>

                            <li>Email address</li>

                            <li>Account authentication information</li>

                            <li>Streak and reward activity</li>

                            <li>Wallet and transaction records</li>
                        </ul>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            3. How We Use Information
                        </h2>

                        <p>
                            Information collected by VELoop may be used to:
                        </p>

                        <ul>
                            <li>
                                Create and manage user accounts
                            </li>

                            <li>
                                Authenticate users securely
                            </li>

                            <li>
                                Maintain daily streak information
                            </li>

                            <li>
                                Process reward claims
                            </li>

                            <li>
                                Maintain wallet and transaction records
                            </li>

                            <li>
                                Improve application functionality
                            </li>
                        </ul>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            4. Account Security
                        </h2>

                        <p>
                            VELoop uses authentication mechanisms to protect
                            user accounts. Passwords are handled through
                            secure password hashing, and authenticated API
                            requests use JSON Web Tokens (JWT).
                        </p>

                        <p>
                            Users are responsible for keeping their account
                            credentials confidential.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            5. Wallet and Transaction Information
                        </h2>

                        <p>
                            VELoop may maintain records of rewards credited
                            to your account, wallet balances, and related
                            transactions. These records are used to provide
                            accurate reward and streak functionality.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            6. Data Sharing
                        </h2>

                        <p>
                            VELoop does not use your account information for
                            unrelated purposes. Information may be processed
                            when necessary to operate, secure, maintain, or
                            improve the application.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            7. Data Retention
                        </h2>

                        <p>
                            Account, streak, reward, and transaction
                            information may be retained for as long as
                            necessary to provide the application's services
                            and maintain appropriate records.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            8. Cookies and Local Storage
                        </h2>

                        <p>
                            The VELoop frontend may use browser local storage
                            to maintain authentication information required
                            for the current application session.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            9. Changes to This Policy
                        </h2>

                        <p>
                            This Privacy Policy may be updated when the
                            application, its features, or its data practices
                            change. Updated versions will be reflected on
                            this page.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>
                            10. Contact
                        </h2>

                        <p>
                            If you have questions about this Privacy Policy
                            or the VELoop application, please use the support
                            contact provided by the application administrator.
                        </p>

                    </section>

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
                            onClick={() => navigate("/privacy-policy")}
                            className={styles.activeFooterLink}
                        >
                            Privacy Policy
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/terms")}
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

export default PrivacyPolicy;