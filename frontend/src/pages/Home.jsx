import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Sparkle } from "lucide-react";

import styles from "./Home.module.css";

import vesCoin from "../../assests/VEs_Coin.png";
import flame from "../../assests/Flame.png";
import stayActive from "../../assests/Stay_Active.png";
import biggerStreak from "../../assests/Bigger_Streak.png";
import day4 from "../../assests/Day-4.png";
import day5 from "../../assests/Day-5.png";
import day7 from "../../assests/Day-7.png";
import exclusiveReward from "../../assests/Exclusive-reward.png";
import trust from "../../assests/Trust.png";
import topLeft from "../../assests/Top_Left.png";
import topRight from "../../assests/Top_right.png";

/* the 7 reward days (same content as before) */
const REWARDS = [
    { day: 1, img: vesCoin, amount: "+5 VES", label: "First Claim" },
    { day: 2, img: vesCoin, amount: "+10 VES", label: "Keep Going" },
    { day: 3, img: vesCoin, amount: "+15 VES", label: "Build Momentum" },
    { day: 4, img: day4, amount: "₹1", label: "Amazon Gift Card" },
    { day: 5, img: day5, amount: "₹2", label: "Amazon Gift Card" },
    { day: 6, img: vesCoin, amount: "+30 VES", label: "Almost There" },
    { day: 7, img: day7, amount: "₹5", label: "Ultimate Reward" }
];

const STEPS = [
    {
        number: "01",
        img: trust,
        title: "Create your account",
        text: "Register with your email and start your VELoop reward journey."
    },
    {
        number: "02",
        img: stayActive,
        title: "Check in every day",
        text: "Claim your daily reward and continue your streak without missing a day."
    },
    {
        number: "03",
        img: exclusiveReward,
        title: "Unlock rewards",
        text: "Progress through seven days and unlock VES and gift-card rewards."
    }
];

const BENEFITS = [
    {
        img: flame,
        title: "Keep your streak alive",
        text: "Return every day and continue your journey."
    },
    {
        img: vesCoin,
        title: "Build your VES balance",
        text: "Earn VES through your daily reward claims."
    },
    {
        img: exclusiveReward,
        title: "Unlock special rewards",
        text: "Reach gift-card reward days as you progress."
    },
    {
        img: trust,
        title: "One secure reward journey",
        text: "Your streak and reward progress stay tied to your account."
    }
];

const pad = (n) => String(n).padStart(2, "0");

function Home() {
    const navigate = useNavigate();
    const pageRef = useRef(null);

    const [activeDay, setActiveDay] = useState(1);
    const [autoPlay, setAutoPlay] = useState(true);

    const current = REWARDS[activeDay - 1];

    /* preview auto-cycles through the 7 days */
    useEffect(() => {
        if (!autoPlay) {
            return;
        }

        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const timer = setInterval(() => {
            setActiveDay((day) => (day >= 7 ? 1 : day + 1));
        }, 2800);

        return () => clearInterval(timer);
    }, [autoPlay]);

    /* fade-in sections as they scroll into view */
    useEffect(() => {
        const nodes = pageRef.current
            ? pageRef.current.querySelectorAll("[data-reveal]")
            : [];

        if (!("IntersectionObserver" in window)) {
            nodes.forEach((node) => node.classList.add(styles.revealIn));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.revealIn);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        nodes.forEach((node) => observer.observe(node));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (e, id) => {
        e.preventDefault();

        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const selectDay = (day) => {
        setActiveDay(day);
        setAutoPlay(false);
    };

    return (
        <div className={styles.page} ref={pageRef}>

            {/* background layers */}
            <div className={styles.bg} aria-hidden="true">
                <span className={styles.orbA}></span>
                <span className={styles.orbB}></span>
                <span className={styles.orbC}></span>
                <span className={styles.gridPattern}></span>
            </div>

            <div className={styles.content}>

                {/* ================================
                    NAVBAR
                ================================= */}

                <div className={styles.navWrap}>
                    <header className={styles.navbar}>

                        <button
                            type="button"
                            className={styles.brand}
                            onClick={() => navigate("/")}
                        >
                            <span className={styles.brandIcon}>V</span>

                            <span className={styles.brandText}>
                                <strong>VELoop</strong>
                                <small>DAILY STREAK</small>
                            </span>
                        </button>

                        <nav className={styles.navLinks}>
                            <a
                                href="#how-it-works"
                                onClick={(e) => scrollToSection(e, "how-it-works")}
                            >
                                How It Works
                            </a>

                            <a
                                href="#rewards"
                                onClick={(e) => scrollToSection(e, "rewards")}
                            >
                                Rewards
                            </a>

                            <a
                                href="#why-veloop"
                                onClick={(e) => scrollToSection(e, "why-veloop")}
                            >
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
                </div>


                <main>

                    {/* ================================
                        HERO
                    ================================= */}

                    <section className={`${styles.container} ${styles.hero}`}>

                        <div className={styles.heroContent}>

                            <div className={styles.kicker}>
                                <img src={flame} alt="" />
                                DAILY STREAK REWARDS
                            </div>

                            <h1 className={styles.title}>
                                Show up every day.
                                <span>Earn something back.</span>
                            </h1>

                            <p className={styles.lead}>
                                Build your daily streak, collect VES rewards,
                                and unlock exciting gift-card rewards as you
                                keep going.
                            </p>

                            <div className={styles.whatIs}>
                                <span className={styles.whatIsIcon}>
                                    <Sparkle size={15} />
                                </span>

                                <p>
                                    <strong>What is VELoop?</strong>{" "}
                                    A daily check-in rewards app. Claim once
                                    every 24 hours, grow a 7-day streak and
                                    collect VES coins and Amazon gift cards.
                                </p>
                            </div>

                            <div className={styles.heroActions}>

                                <button
                                    type="button"
                                    className={styles.primaryCta}
                                    onClick={() => navigate("/register")}
                                >
                                    Start Your Streak
                                    <ArrowRight size={18} />
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

                                <div className={styles.statChip}>
                                    <strong>7</strong>
                                    <span>Reward Days</span>
                                </div>

                                <div className={styles.statChip}>
                                    <strong>24h</strong>
                                    <span>Claim Cycle</span>
                                </div>

                                <div className={styles.statChip}>
                                    <strong>
                                        <img src={vesCoin} alt="" />
                                    </strong>
                                    <span>VES Rewards</span>
                                </div>

                            </div>

                        </div>


                        {/* ---------- interactive dashboard preview ---------- */}

                        <div
                            className={styles.preview}
                            onMouseEnter={() => setAutoPlay(false)}
                            onMouseLeave={() => setAutoPlay(true)}
                        >

                            <span className={styles.previewGlow}></span>

                            <img
                                src={topLeft}
                                alt=""
                                className={styles.decorGift}
                            />

                            <img
                                src={topRight}
                                alt=""
                                className={styles.decorCrown}
                            />

                            <div className={`${styles.chip} ${styles.chipStreak}`}>
                                <img src={flame} alt="" />
                                <span>7 Day Streak</span>
                            </div>

                            <div className={`${styles.chip} ${styles.chipBigger}`}>
                                <img src={biggerStreak} alt="" />
                                <span>Bigger Streak</span>
                            </div>

                            <div className={styles.window}>

                                <div className={styles.windowBar}>

                                    <div className={styles.windowTitle}>
                                        <img src={flame} alt="" />
                                        <span>Daily Streak</span>
                                    </div>

                                    <span className={styles.livePill}>
                                        <i></i>
                                        Live preview
                                    </span>

                                </div>


                                <div className={styles.spotlight} key={current.day}>

                                    <div className={styles.spotImage}>
                                        <img src={current.img} alt="" />
                                    </div>

                                    <div className={styles.spotText}>
                                        <span className={styles.dayPill}>
                                            DAY {pad(current.day)}
                                        </span>

                                        <strong>{current.amount}</strong>

                                        <small>{current.label}</small>
                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className={styles.claimDemo}
                                    onClick={() => navigate("/register")}
                                >
                                    Claim this reward
                                    <ArrowRight size={16} />
                                </button>


                                <div className={styles.dayTiles}>
                                    {REWARDS.map((reward) => (
                                        <button
                                            key={reward.day}
                                            type="button"
                                            className={`${styles.tile} ${
                                                reward.day === activeDay
                                                    ? styles.tileActive
                                                    : ""
                                            } ${
                                                reward.day === 7
                                                    ? styles.tileFinal
                                                    : ""
                                            }`}
                                            onClick={() => selectDay(reward.day)}
                                            aria-label={`Day ${reward.day}: ${reward.amount}`}
                                            aria-pressed={reward.day === activeDay}
                                        >
                                            <small>D{reward.day}</small>
                                            <img src={reward.img} alt="" />
                                        </button>
                                    ))}
                                </div>


                                <p className={styles.windowFoot}>
                                    <Clock size={13} />
                                    Claim once every 24 hours
                                </p>

                            </div>

                        </div>

                    </section>


                    {/* ================================
                        HOW IT WORKS
                    ================================= */}

                    <section
                        id="how-it-works"
                        className={`${styles.container} ${styles.section}`}
                    >

                        <div
                            className={`${styles.heading} ${styles.reveal}`}
                            data-reveal
                        >
                            <span>SIMPLE BY DESIGN</span>

                            <h2>How your daily streak works</h2>

                            <p>
                                Stay consistent. Claim once every 24 hours.
                                Keep your streak alive and unlock the next
                                reward.
                            </p>
                        </div>


                        <div className={styles.steps}>
                            {STEPS.map((step, index) => (
                                <article
                                    key={step.number}
                                    className={`${styles.stepCard} ${styles.reveal}`}
                                    style={{ "--d": `${index * 90}ms` }}
                                    data-reveal
                                >
                                    <div className={styles.stepTop}>
                                        <span className={styles.stepNumber}>
                                            {step.number}
                                        </span>

                                        <div className={styles.stepIcon}>
                                            <img src={step.img} alt="" />
                                        </div>
                                    </div>

                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </article>
                            ))}
                        </div>

                    </section>


                    {/* ================================
                        REWARD JOURNEY
                    ================================= */}

                    <section
                        id="rewards"
                        className={`${styles.container} ${styles.section}`}
                    >

                        <div
                            className={`${styles.journeyPanel} ${styles.reveal}`}
                            data-reveal
                        >

                            <div className={styles.heading}>
                                <span className={styles.gold}>
                                    YOUR REWARD JOURNEY
                                </span>

                                <h2>Seven days. Seven reasons to return.</h2>

                                <p>
                                    Every successful claim moves you closer to
                                    the ultimate reward.
                                </p>
                            </div>


                            <div className={styles.track}>
                                {REWARDS.map((reward) => (
                                    <div
                                        key={reward.day}
                                        className={`${styles.rewardCard} ${
                                            reward.day === 1
                                                ? styles.firstReward
                                                : ""
                                        } ${
                                            reward.day === 7
                                                ? styles.finalReward
                                                : ""
                                        }`}
                                    >
                                        <span className={styles.rewardDay}>
                                            DAY {pad(reward.day)}
                                        </span>

                                        <div className={styles.rewardImage}>
                                            <img src={reward.img} alt="" />
                                        </div>

                                        <strong>{reward.amount}</strong>

                                        <small>{reward.label}</small>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </section>


                    {/* ================================
                        WHY VELOOP
                    ================================= */}

                    <section
                        id="why-veloop"
                        className={`${styles.container} ${styles.section} ${styles.why}`}
                    >

                        <div
                            className={`${styles.whyContent} ${styles.reveal}`}
                            data-reveal
                        >

                            <span className={styles.kickerText}>
                                WHY VELOOP?
                            </span>

                            <h2>
                                Small daily actions.
                                <span>Real rewards.</span>
                            </h2>

                            <p>
                                VELoop turns consistency into a simple reward
                                journey. Your streak grows one day at a time,
                                while your wallet keeps track of your earned
                                VES.
                            </p>

                            <button
                                type="button"
                                className={styles.primaryCta}
                                onClick={() => navigate("/register")}
                            >
                                Start Earning
                                <ArrowRight size={18} />
                            </button>

                        </div>


                        <div className={styles.benefits}>
                            {BENEFITS.map((benefit, index) => (
                                <article
                                    key={benefit.title}
                                    className={`${styles.benefitCard} ${styles.reveal}`}
                                    style={{ "--d": `${index * 80}ms` }}
                                    data-reveal
                                >
                                    <div className={styles.benefitIcon}>
                                        <img src={benefit.img} alt="" />
                                    </div>

                                    <div>
                                        <strong>{benefit.title}</strong>
                                        <span>{benefit.text}</span>
                                    </div>
                                </article>
                            ))}
                        </div>

                    </section>


                    {/* ================================
                        FINAL CTA
                    ================================= */}

                    <section className={`${styles.container} ${styles.ctaWrap}`}>

                        <div
                            className={`${styles.finalCta} ${styles.reveal}`}
                            data-reveal
                        >

                            <div className={styles.finalIcon}>
                                <img src={vesCoin} alt="" />
                            </div>

                            <span className={styles.gold}>
                                YOUR NEXT REWARD IS ONE CLAIM AWAY
                            </span>

                            <h2>Ready to start your streak?</h2>

                            <p>
                                Create your VELoop account and begin your
                                seven-day reward journey.
                            </p>

                            <div className={styles.finalActions}>

                                <button
                                    type="button"
                                    className={styles.primaryCta}
                                    onClick={() => navigate("/register")}
                                >
                                    Create Your Account
                                    <ArrowRight size={18} />
                                </button>

                                <button
                                    type="button"
                                    className={styles.secondaryCta}
                                    onClick={() => navigate("/login")}
                                >
                                    I already have an account
                                </button>

                            </div>

                        </div>

                    </section>

                </main>


                {/* ================================
                    FOOTER
                ================================= */}

                <footer className={`${styles.container} ${styles.footer}`}>

                    <div className={styles.footerBrand}>
                        <span className={styles.brandIcon}>V</span>

                        <div>
                            <strong>VELoop</strong>
                            <small>Reward • Repeat • Grow</small>
                        </div>
                    </div>

                    <p>© 2026 VELoop. Daily streak rewards.</p>

                </footer>

            </div>

        </div>
    );
}

export default Home;
