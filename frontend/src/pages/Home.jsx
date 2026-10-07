import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>

            {/* =========================================
                NAVBAR
            ========================================= */}

            <header className={styles.navbar}>

                <button
                    type="button"
                    className={styles.brand}
                    onClick={() => navigate("/")}
                >
                    <div className={styles.brandIcon}>
                        V
                    </div>

                    <div>
                        <strong>VELoop</strong>
                        <span>DAILY STREAK</span>
                    </div>
                </button>


                <nav className={styles.navLinks}>
                    <a href="#how-it-works">
                        How It Works
                    </a>

                    <a href="#rewards">
                        Rewards
                    </a>

                    <a href="#why-veloop">
                        Why VELoop
                    </a>
                </nav>


                <div className={styles.navActions}>

                    <button
                        type="button"
                        className={styles.loginButton}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className={styles.registerButton}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>

                </div>

            </header>


            {/* =========================================
                HERO
            ========================================= */}

            <main>

                <section className={styles.hero}>

                    <div className={styles.heroContent}>

                        <div className={styles.heroKicker}>
                            🔥 DAILY STREAK REWARDS
                        </div>

                        <h1>
                            Show up every day.
                            <br />
                            <span>Earn something back.</span>
                        </h1>

                        <p>
                            Build your daily streak, collect VES rewards,
                            and unlock exciting gift-card rewards as you
                            keep going.
                        </p>


                        <div className={styles.heroActions}>

                            <button
                                type="button"
                                className={styles.primaryCta}
                                onClick={() => navigate("/register")}
                            >
                                Start Your Streak
                                <span>→</span>
                            </button>

                            <button
                                type="button"
                                className={styles.secondaryCta}
                                onClick={() => navigate("/login")}
                            >
                                Already a member?
                            </button>

                        </div>


                        <div className={styles.heroStats}>

                            <div>
                                <strong>7</strong>
                                <span>Reward Days</span>
                            </div>

                            <div>
                                <strong>24h</strong>
                                <span>Claim Cycle</span>
                            </div>

                            <div>
                                <strong>💎</strong>
                                <span>VES Rewards</span>
                            </div>

                        </div>

                    </div>


                    {/* HERO REWARD VISUAL */}

                    <div className={styles.heroVisual}>

                        <div className={styles.visualGlow}></div>

                        <div className={styles.rewardOrb}>

                            <div className={styles.diamondLarge}>
                                💎
                            </div>

                            <strong>
                                +5 VES
                            </strong>

                            <span>
                                DAY 01 REWARD
                            </span>

                        </div>


                        <div className={`${styles.floatingReward} ${styles.rewardOne}`}>
                            💎
                            <span>+10 VES</span>
                        </div>

                        <div className={`${styles.floatingReward} ${styles.rewardTwo}`}>
                            🎁
                            <span>₹1 Gift Card</span>
                        </div>

                        <div className={`${styles.floatingReward} ${styles.rewardThree}`}>
                            🪙
                            <span>VES</span>
                        </div>

                        <div className={`${styles.floatingReward} ${styles.rewardFour}`}>
                            🔥
                            <span>7 Day Streak</span>
                        </div>

                    </div>

                </section>


                {/* =========================================
                    HOW IT WORKS
                ========================================= */}

                <section
                    id="how-it-works"
                    className={styles.section}
                >

                    <div className={styles.sectionHeading}>

                        <span>
                            SIMPLE BY DESIGN
                        </span>

                        <h2>
                            How your daily streak works
                        </h2>

                        <p>
                            Stay consistent. Claim once every 24 hours.
                            Keep your streak alive and unlock the next reward.
                        </p>

                    </div>


                    <div className={styles.steps}>

                        <div className={styles.stepCard}>

                            <div className={styles.stepNumber}>
                                01
                            </div>

                            <div className={styles.stepIcon}>
                                🔐
                            </div>

                            <h3>
                                Create your account
                            </h3>

                            <p>
                                Register with your email and start your
                                VELoop reward journey.
                            </p>

                        </div>


                        <div className={styles.stepCard}>

                            <div className={styles.stepNumber}>
                                02
                            </div>

                            <div className={styles.stepIcon}>
                                🔥
                            </div>

                            <h3>
                                Check in every day
                            </h3>

                            <p>
                                Claim your daily reward and continue your
                                streak without missing a day.
                            </p>

                        </div>


                        <div className={styles.stepCard}>

                            <div className={styles.stepNumber}>
                                03
                            </div>

                            <div className={styles.stepIcon}>
                                🎁
                            </div>

                            <h3>
                                Unlock rewards
                            </h3>

                            <p>
                                Progress through seven days and unlock
                                VES and gift-card rewards.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    REWARD JOURNEY
                ========================================= */}

                <section
                    id="rewards"
                    className={`${styles.section} ${styles.rewardSection}`}
                >

                    <div className={styles.sectionHeading}>

                        <span>
                            YOUR REWARD JOURNEY
                        </span>

                        <h2>
                            Seven days. Seven reasons to return.
                        </h2>

                        <p>
                            Every successful claim moves you closer to
                            the ultimate reward.
                        </p>

                    </div>


                    <div className={styles.rewardJourney}>

                        <div className={`${styles.rewardCard} ${styles.activeReward}`}>

                            <div className={styles.rewardDay}>
                                DAY 01
                            </div>

                            <div className={styles.rewardEmoji}>
                                💎
                            </div>

                            <strong>
                                +5 VES
                            </strong>

                            <span>
                                First Claim
                            </span>

                        </div>


                        <div className={styles.journeyLine}></div>


                        <div className={styles.rewardCard}>

                            <div className={styles.rewardDay}>
                                DAY 02
                            </div>

                            <div className={styles.rewardEmoji}>
                                💎
                            </div>

                            <strong>
                                +10 VES
                            </strong>

                            <span>
                                Keep Going
                            </span>

                        </div>


                        <div className={styles.journeyLine}></div>


                        <div className={styles.rewardCard}>

                            <div className={styles.rewardDay}>
                                DAY 03
                            </div>

                            <div className={styles.rewardEmoji}>
                                💎
                            </div>

                            <strong>
                                +15 VES
                            </strong>

                            <span>
                                Build Momentum
                            </span>

                        </div>


                        <div className={styles.journeyLine}></div>


                        <div className={styles.rewardCard}>

                            <div className={styles.rewardDay}>
                                DAY 04
                            </div>

                            <div className={styles.rewardEmoji}>
                                🎁
                            </div>

                            <strong>
                                ₹1
                            </strong>

                            <span>
                                Amazon Gift Card
                            </span>

                        </div>


                        <div className={styles.journeyLine}></div>


                        <div className={styles.rewardCard}>

                            <div className={styles.rewardDay}>
                                DAY 05
                            </div>

                            <div className={styles.rewardEmoji}>
                                🎁
                            </div>

                            <strong>
                                ₹2
                            </strong>

                            <span>
                                Amazon Gift Card
                            </span>

                        </div>


                        <div className={styles.journeyLine}></div>


                        <div className={styles.rewardCard}>

                            <div className={styles.rewardDay}>
                                DAY 06
                            </div>

                            <div className={styles.rewardEmoji}>
                                💎
                            </div>

                            <strong>
                                +30 VES
                            </strong>

                            <span>
                                Almost There
                            </span>

                        </div>


                        <div className={styles.journeyLine}></div>


                        <div className={`${styles.rewardCard} ${styles.finalReward}`}>

                            <div className={styles.rewardDay}>
                                DAY 07
                            </div>

                            <div className={styles.rewardEmoji}>
                                🎁
                            </div>

                            <strong>
                                ₹5
                            </strong>

                            <span>
                                Ultimate Reward
                            </span>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    WHY VELOOP
                ========================================= */}

                <section
                    id="why-veloop"
                    className={styles.whySection}
                >

                    <div className={styles.whyContent}>

                        <span className={styles.sectionKicker}>
                            WHY VELOOP?
                        </span>

                        <h2>
                            Small daily actions.
                            <br />
                            <span>Real rewards.</span>
                        </h2>

                        <p>
                            VELoop turns consistency into a simple reward
                            journey. Your streak grows one day at a time,
                            while your wallet keeps track of your earned VES.
                        </p>


                        <button
                            type="button"
                            className={styles.primaryCta}
                            onClick={() => navigate("/register")}
                        >
                            Start Earning
                            <span>→</span>
                        </button>

                    </div>


                    <div className={styles.benefits}>

                        <div className={styles.benefitCard}>

                            <div>
                                🔥
                            </div>

                            <section>
                                <strong>
                                    Keep your streak alive
                                </strong>

                                <span>
                                    Return every day and continue your journey.
                                </span>
                            </section>

                        </div>


                        <div className={styles.benefitCard}>

                            <div>
                                💎
                            </div>

                            <section>
                                <strong>
                                    Build your VES balance
                                </strong>

                                <span>
                                    Earn VES through your daily reward claims.
                                </span>
                            </section>

                        </div>


                        <div className={styles.benefitCard}>

                            <div>
                                🎁
                            </div>

                            <section>
                                <strong>
                                    Unlock special rewards
                                </strong>

                                <span>
                                    Reach gift-card reward days as you progress.
                                </span>
                            </section>

                        </div>


                        <div className={styles.benefitCard}>

                            <div>
                                🔒
                            </div>

                            <section>
                                <strong>
                                    One secure reward journey
                                </strong>

                                <span>
                                    Your streak and reward progress stay tied
                                    to your account.
                                </span>
                            </section>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    FINAL CTA
                ========================================= */}

                <section className={styles.finalCta}>

                    <div className={styles.finalIcon}>
                        💎
                    </div>

                    <span>
                        YOUR NEXT REWARD IS ONE CLAIM AWAY
                    </span>

                    <h2>
                        Ready to start your streak?
                    </h2>

                    <p>
                        Create your VELoop account and begin your
                        seven-day reward journey.
                    </p>

                    <button
                        type="button"
                        className={styles.finalButton}
                        onClick={() => navigate("/register")}
                    >
                        Create Your Account
                        <span>→</span>
                    </button>

                </section>

            </main>


            {/* =========================================
                FOOTER
            ========================================= */}

            <footer className={styles.footer}>

                <div className={styles.footerBrand}>

                    <div className={styles.brandIcon}>
                        V
                    </div>

                    <div>
                        <strong>VELoop</strong>
                        <span>Daily Streak Rewards</span>
                    </div>

                </div>


                <div className={styles.footerLinks}>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>

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


                <div className={styles.footerBottom}>
                    © 2026 VELoop. Daily streak rewards.
                </div>

            </footer>

        </div>
    );
}

export default Home;