import axios from "axios";

const API = axios.create({
    baseURL: "https://veloop-daily-streak-1-bwlb.onrender.com",
    headers: {
        "Content-Type": "application/json"
    }
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Get current streak status
export const getStreakStatus = async () => {
    const response = await API.get("/streak/status");
    return response.data;
};

// Claim daily reward
export const claimStreak = async () => {
    const response = await API.post("/streak/claim");
    return response.data;
};

// Get wallet
export const getWallet = async () => {
    const response = await API.get("/wallet");
    return response.data;
};

// Get transactions
export const getTransactions = async () => {
    const response = await API.get("/transactions");
    return response.data;
};

// Get streak history
export const getStreakHistory = async () => {
    const response = await API.get("/streak/history");
    return response.data;
};

export default API;