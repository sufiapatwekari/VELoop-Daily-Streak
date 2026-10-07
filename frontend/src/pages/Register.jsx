import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Register.module.css";

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

            <div className={styles.backgroundShape}></div>

            <div className={styles.registerLayout}>

                <div className={styles.brandPanel}>

                    <button
                        className={styles.brand}
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        <span className={styles.brandIcon}>V</span>

                        <span>
                            <strong>VELoop</strong>
                            <small>Daily Rewards</small>
                        </span>
                    </button>

                    <div className={styles.brandContent}>

                        <span className={styles.kicker}>
                            💎 START EARNING
                        </span>

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
                                💎
                            </div>

                            <div>
                                <strong>Daily rewards</strong>
                                <span>New rewards every day</span>
                            </div>

                            <span className={styles.previewArrow}>→</span>

                        </div>

                    </div>

                    <div className={styles.brandFooter}>
                        <span>© {new Date().getFullYear()} VELoop</span>
                        <span>Reward your consistency.</span>
                    </div>

                </div>


                <div className={styles.formPanel}>

                    <div className={styles.mobileBrand}>
                        <span className={styles.brandIcon}>V</span>
                        <strong>VELoop</strong>
                    </div>

                    <div className={styles.formHeader}>

                        <span className={styles.formKicker}>
                            CREATE ACCOUNT
                        </span>

                        <h2>Join VELoop</h2>

                        <p>
                            Create your account and start your daily reward journey.
                        </p>

                    </div>


                    {error && (
                        <div className={styles.messageError}>
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.messageSuccess}>
                            <span>✓</span>
                            {success}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className={styles.inputGroup}>

                            <label>Full Name</label>

                            <div className={styles.inputWrap}>
                                <span>👤</span>

                                <input
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


                        <div className={styles.inputGroup}>

                            <label>Email Address</label>

                            <div className={styles.inputWrap}>
                                <span>✉️</span>

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


                        <div className={styles.inputRow}>

                            <div className={styles.inputGroup}>

                                <label>Password</label>

                                <div className={styles.inputWrap}>
                                    <span>🔐</span>

                                    <input
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


                            <div className={styles.inputGroup}>

                                <label>Confirm Password</label>

                                <div className={styles.inputWrap}>
                                    <span>✓</span>

                                    <input
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


                        <button
                            type="submit"
                            className={styles.registerButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className={styles.buttonLoader}></span>
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


                    <div className={styles.loginPrompt}>
                        <span>Already have an account?</span>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;