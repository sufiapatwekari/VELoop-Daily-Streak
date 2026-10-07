
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        console.log("PROTECTED ROUTE TOKEN:", token);

        if (token && token.trim() !== "") {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, []);

    if (authenticated === null) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0f0f17",
                    color: "white"
                }}
            >
                Checking authentication...
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;

