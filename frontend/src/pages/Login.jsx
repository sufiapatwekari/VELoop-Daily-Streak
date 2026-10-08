import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

import vesCoin from "../../assests/VEs_Coin.png";
import flame from "../../assests/Flame.png";
import trust from "../../assests/Trust.png";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://veloop-daily-streak-1-bwlb.onrender.com/login",
                formData
            );

            const token = response.data.token;

            localStorage.setItem("token", token);

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>

            <div className={styles.glowOne}></div>
            <div className={styles.glowTwo}></div>

            <div className={styles.loginLayout}>

                {/* =========================================
                    LEFT BRAND PANEL
                ========================================= */}
                <section className={styles.brandPanel}>

                    <button
                        type="button"
                        className={styles.brand}
                        onClick={() => navigate("/login")}
                    >
                        <span className={styles.brandIcon}>
                            V
                        </span>

                        <span className={styles.brandText}>
                            <strong>VELoop</strong>
                            <small>Daily Rewards</small>
                        </span>
                    </button>


                    <div className={styles.brandContent}>

                        <div className={styles.kicker}>
                            <img
                                src={flame}
                                alt=""
                            />
                            DAILY REWARDS
                        </div>


                        <h1>
                            Keep your streak.
                            <br />
                            <span>Earn more.</span>
                        </h1>


                        <p>
                            Sign in to continue your daily journey,
                            collect VES rewards and keep your progress
                            moving forward.
                        </p>


                        <div className={styles.rewardPreview}>

                            <div className={styles.previewIcon}>
                                <img
                                    src={vesCoin}
                                    alt="VES"
                                />
                            </div>

                            <div className={styles.previewText}>
                                <strong>
                                    Your rewards are waiting
                                </strong>

                                <span>
                                    Claim your daily VES reward
                                </span>
                            </div>

                            <span className={styles.previewArrow}>
                                →
                            </span>

                        </div>


                        <div className={styles.trustRow}>

                            <img
                                src={trust}
                                alt=""
                            />

                            <span>
                                Secure and simple reward tracking
                            </span>

                        </div>

                    </div>


                    <div className={styles.brandFooter}>

                        <span>
                            VELoop Daily Streak
                        </span>

                        <span>
                            Reward • Repeat • Grow
                        </span>

                    </div>

                </section>


                {/* =========================================
                    RIGHT FORM PANEL
                ========================================= */}
                <section className={styles.formPanel}>

                    {/* MOBILE BRAND */}

                    <button
                        type="button"
                        className={styles.mobileBrand}
                        onClick={() => navigate("/login")}
                    >
                        <span className={styles.brandIcon}>
                            V
                        </span>

                        <span>
                            <strong>VELoop</strong>
                            <small>Daily Rewards</small>
                        </span>
                    </button>


                    {/* FORM HEADER */}

                    <div className={styles.formHeader}>

                        <span className={styles.formKicker}>
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in
                        </h2>

                        <p>
                            Sign in to continue your daily streak.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className={styles.messageError}>

                            <span>!</span>

                            <div>
                                {error}
                            </div>

                        </div>
                    )}


                    {/* LOGIN FORM */}

                    <form onSubmit={handleSubmit}>

                        {/* EMAIL */}

                        <div className={styles.inputGroup}>

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className={styles.inputWrap}>

                                <span className={styles.inputIcon}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="2"
                                        />
                                        <path d="m4 7 8 6 8-6" />
                                    </svg>
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className={styles.inputGroup}>

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className={styles.inputWrap}>

                                <span className={styles.inputIcon}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="5"
                                            y="10"
                                            width="14"
                                            height="10"
                                            rx="2"
                                        />
                                        <path
                                            d="M8 10V7a4 4 0 0 1 8 0v3"
                                        />
                                    </svg>
                                </span>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className={styles.loginButton}
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span>
                                        Signing in...
                                    </span>

                                    <span
                                        className={styles.buttonLoader}
                                    ></span>
                                </>
                            ) : (
                                <>
                                    <span>
                                        Sign In
                                    </span>

                                    <span>
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className={styles.registerPrompt}>

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                        >
                            Create Account
                        </button>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Login;