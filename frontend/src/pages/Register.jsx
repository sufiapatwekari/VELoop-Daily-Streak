import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";

import vesCoin from "../../assests/VEs_Coin.png";
import flame from "../../assests/Flame.png";
import trust from "../../assests/Trust.png";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "https://veloop-daily-streak-1-bwlb.onrender.com/register",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            setSuccess("Account created successfully. Taking you to login...");

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/login", {
                    replace: true
                });
            }, 1500);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>

            {/* Background decoration */}
            <div className={styles.glowOne}></div>
            <div className={styles.glowTwo}></div>

            <div className={styles.registerLayout}>

                {/* =========================================
                    LEFT BRAND SECTION
                ========================================= */}
                <section className={styles.brandPanel}>

                    <button
                        className={styles.brand}
                        type="button"
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
                            START EARNING
                        </div>

                        <h1>
                            Build your streak.
                            <br />
                            <span>Earn your rewards.</span>
                        </h1>

                        <p>
                            Check in every day, maintain your streak,
                            and collect VES rewards along the way.
                        </p>


                        <div className={styles.rewardPreview}>

                            <div className={styles.previewIcon}>
                                <img
                                    src={vesCoin}
                                    alt="VES"
                                />
                            </div>

                            <div className={styles.previewText}>
                                <strong>Daily rewards</strong>
                                <span>New rewards every day</span>
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
                            © {new Date().getFullYear()} VELoop
                        </span>

                        <span>
                            Reward your consistency.
                        </span>
                    </div>

                </section>


                {/* =========================================
                    FORM SECTION
                ========================================= */}
                <section className={styles.formPanel}>

                    {/* Mobile logo */}
                    <button
                        className={styles.mobileBrand}
                        type="button"
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


                    <div className={styles.formHeader}>

                        <span className={styles.formKicker}>
                            CREATE ACCOUNT
                        </span>

                        <h2>Join VELoop</h2>

                        <p>
                            Create your account and start your daily
                            reward journey.
                        </p>

                    </div>


                    {/* ERROR */}
                    {error && (
                        <div className={styles.messageError}>
                            <span>!</span>
                            {error}
                        </div>
                    )}


                    {/* SUCCESS */}
                    {success && (
                        <div className={styles.messageSuccess}>
                            <span>✓</span>
                            {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* NAME */}
                        <div className={styles.inputGroup}>

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <div className={styles.inputWrap}>

                                <span className={styles.inputIcon}>
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="12"
                                            cy="8"
                                            r="3.5"
                                        />
                                        <path
                                            d="M5 20c.7-3.2 3.1-5 7-5s6.3 1.8 7 5"
                                        />
                                    </svg>
                                </span>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />

                            </div>

                        </div>


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
                                        <path
                                            d="m4 7 8 6 8-6"
                                        />
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


                        {/* PASSWORD ROW */}
                        <div className={styles.inputRow}>

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
                                        placeholder="Min. 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />

                                </div>

                            </div>


                            {/* CONFIRM PASSWORD */}
                            <div className={styles.inputGroup}>

                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>

                                <div className={styles.inputWrap}>

                                    <span className={styles.inputIcon}>
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="m5 12 4 4L19 6"
                                            />
                                        </svg>
                                    </span>

                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Repeat password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        autoComplete="new-password"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* REGISTER */}
                        <button
                            type="submit"
                            className={styles.registerButton}
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span
                                        className={styles.buttonLoader}
                                    ></span>

                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* LOGIN */}
                    <div className={styles.loginPrompt}>

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Register;