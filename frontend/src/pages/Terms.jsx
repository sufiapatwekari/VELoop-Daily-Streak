import { useNavigate } from "react-router-dom";
import styles from "./Terms.module.css";

function Terms() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>

            {/* HEADER */}
            <header className={styles.header}>
                <div className={styles.headerInner}>

                    <button
                        type="button"
                        className={styles.brand}
                        onClick={() => navigate("/dashboard")}
                    >
                        <div className={styles.brandMark}>V</div>

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


            {/* MAIN CONTENT */}
            <main className={styles.main}>

                <section className={styles.pageHeading}>
                    <span className={styles.eyebrow}>LEGAL</span>

                    <h1>Terms &amp; Conditions</h1>

                    <p>
                        Please review the rules and conditions for using
                        the VELoop Daily Streak application.
                    </p>
                </section>


                <section className={styles.content}>

                    <section className={styles.contentSection}>

                        <h2>1. Introduction</h2>

                        <p>
                            Welcome to VELoop. These Terms &amp; Conditions
                            explain the rules and conditions that apply when
                            you use the VELoop Daily Streak application.
                        </p>

                        <p>
                            By creating an account or using the application,
                            you agree to use VELoop according to these terms.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>2. Account Registration</h2>

                        <p>
                            To use VELoop, you may be required to create an
                            account using accurate and valid information.
                        </p>

                        <p>
                            You are responsible for maintaining the
                            confidentiality of your account credentials and
                            for activities performed through your account.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>3. Daily Streak</h2>

                        <p>
                            VELoop provides a daily streak system that allows
                            eligible users to claim configured rewards at
                            permitted intervals.
                        </p>

                        <p>
                            Streak progress is maintained by the VELoop
                            application and is subject to the configured
                            claim interval and streak rules.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>4. Reward Claims</h2>

                        <p>
                            Rewards are provided according to the reward
                            configuration available in the VELoop system.
                            The available reward, reward day, and claim
                            eligibility are determined by the application.
                        </p>

                        <p>
                            A reward can only be claimed when the user meets
                            the applicable eligibility conditions.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>5. Reward and Wallet Records</h2>

                        <p>
                            VELoop may maintain records of rewards credited
                            to your account, wallet balances, and transaction
                            activity.
                        </p>

                        <p>
                            Transaction records are maintained to support
                            accurate reward tracking and wallet functionality.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>6. Streak Reset and Missed Claims</h2>

                        <p>
                            If the applicable conditions for maintaining a
                            streak are not satisfied, the streak may be reset
                            according to the rules configured by VELoop.
                        </p>

                        <p>
                            Users are responsible for claiming available
                            daily rewards within the permitted claim period.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>7. Prohibited Activities</h2>

                        <p>
                            Users must not attempt to misuse, manipulate, or
                            interfere with the VELoop application.
                        </p>

                        <ul>
                            <li>
                                Attempting to claim the same reward multiple
                                times outside the permitted system flow
                            </li>

                            <li>
                                Attempting to bypass authentication or
                                authorization controls
                            </li>

                            <li>
                                Attempting to modify wallet or reward records
                                through unauthorized methods
                            </li>

                            <li>
                                Using automated or malicious methods to
                                interfere with the application
                            </li>
                        </ul>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>8. Account Suspension</h2>

                        <p>
                            VELoop may restrict or suspend access to an account
                            if there is evidence of unauthorized use,
                            security abuse, or violation of these terms.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>9. Application Availability</h2>

                        <p>
                            VELoop is provided as an application service and
                            may occasionally be unavailable due to maintenance,
                            technical issues, updates, or other operational
                            reasons.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>10. Changes to These Terms</h2>

                        <p>
                            These Terms &amp; Conditions may be updated when
                            the application, its features, or its operating
                            rules change.
                        </p>

                        <p>
                            Updated terms will be reflected on this page.
                        </p>

                    </section>


                    <section className={styles.contentSection}>

                        <h2>11. Contact</h2>

                        <p>
                            If you have questions about these Terms &amp;
                            Conditions or the VELoop application, please use
                            the support contact provided by the application
                            administrator.
                        </p>

                    </section>

                </section>

            </main>


            {/* FOOTER */}
            <footer className={styles.footer}>

                <div className={styles.footerInner}>

                    <div className={styles.footerLogo}>
                        <div className={styles.footerBrandMark}>V</div>

                        <strong>VELoop Rewards</strong>
                    </div>

                    <div className={styles.footerLinks}>

                        <button
                            type="button"
                            onClick={() => navigate("/privacy-policy")}
                        >
                            Privacy Policy
                        </button>

                        <button
                            type="button"
                            className={styles.activeFooterLink}
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

export default Terms;