import { useNavigate } from "react-router-dom";
import styles from "./PrivacyPolicy.module.css";


function PrivacyPolicy() {

    const navigate = useNavigate();


    return (

        <div className={styles.page}>

            {/* HEADER */}

            <header className={styles.header}>

                <div
                    className={styles.logo}
                    onClick={() => navigate("/dashboard")}
                >

                    <span className={styles.logoIcon}>
                        V
                    </span>

                    <span>
                        VELoop
                    </span>

                </div>


                <div className={styles.headerActions}>

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

                </div>

            </header>


            {/* MAIN */}

            <main className={styles.main}>

                <div className={styles.heading}>

                    <p>
                        LEGAL
                    </p>

                    <h1>
                        Privacy Policy
                    </h1>
                    
                </div>


                <div className={styles.content}>

                    <section>

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


                    <section>

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

                            <li>
                                Name
                            </li>

                            <li>
                                Email address
                            </li>

                            <li>
                                Account authentication information
                            </li>

                            <li>
                                Streak and reward activity
                            </li>

                            <li>
                                Wallet and transaction records
                            </li>

                        </ul>

                    </section>


                    <section>

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


                    <section>

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


                    <section>

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


                    <section>

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


                    <section>

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


                    <section>

                        <h2>
                            8. Cookies and Local Storage
                        </h2>

                        <p>
                            The VELoop frontend may use browser local storage
                            to maintain authentication information required
                            for the current application session.
                        </p>

                    </section>


                    <section>

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


                    <section>

                        <h2>
                            10. Contact
                        </h2>

                        <p>
                            If you have questions about this Privacy Policy
                            or the VELoop application, please use the support
                            contact provided by the application administrator.
                        </p>

                    </section>


                </div>


                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </main>


            {/* FOOTER */}

            <footer className={styles.footer}>

                <span>
                    © {new Date().getFullYear()} VELoop. All rights reserved.
                </span>

                <div className={styles.footerLinks}>

                    <button
                        type="button"
                        onClick={() => navigate("/privacy-policy")}
                    >
                        Privacy Policy
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/terms")}
                    >
                        Terms &amp; Conditions
                    </button>

                </div>

            </footer>

        </div>

    );

}


export default PrivacyPolicy;