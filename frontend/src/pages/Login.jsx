import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

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

            <div className={styles.backgroundShape}></div>

            <div className={styles.loginLayout}>

                {/* LEFT BRAND PANEL */}

                <div className={styles.brandPanel}>

                    <button
                        type="button"
                        className={styles.brand}
                        onClick={() => navigate("/login")}
                    >
                        <div className={styles.brandIcon}>
                            V
                        </div>

                        <div>
                            <strong>VELoop</strong>
                            <small>DAILY STREAK</small>
                        </div>
                    </button>


                    <div className={styles.brandContent}>

                        <span className={styles.kicker}>
                            DAILY REWARDS
                        </span>

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
                                💎
                            </div>

                            <div>
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

                    </div>


                    <div className={styles.brandFooter}>
                        <span>VELoop Daily Streak</span>
                        <span>Reward • Repeat • Grow</span>
                    </div>

                </div>


                {/* RIGHT FORM PANEL */}

                <div className={styles.formPanel}>

                    {/* MOBILE BRAND */}

                    <div className={styles.mobileBrand}>

                        <div className={styles.brandIcon}>
                            V
                        </div>

                        <div>
                            <strong>VELoop</strong>
                            <small>DAILY STREAK</small>
                        </div>

                    </div>


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

                        <div className={styles.inputGroup}>

                            <label>
                                Email Address
                            </label>

                            <div className={styles.inputWrap}>

                                <span>✉</span>

                                <input
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


                        <div className={styles.inputGroup}>

                            <label>
                                Password
                            </label>

                            <div className={styles.inputWrap}>

                                <span>●</span>

                                <input
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


                        <button
                            type="submit"
                            className={styles.loginButton}
                            disabled={loading}
                        >

                            <span>
                                {loading
                                    ? "Signing in..."
                                    : "Sign In"
                                }
                            </span>

                            {!loading && (
                                <span>→</span>
                            )}

                            {loading && (
                                <span className={styles.buttonLoader}></span>
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

                </div>

            </div>

        </div>
    );
}

export default Login;