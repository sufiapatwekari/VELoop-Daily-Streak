import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import StreakHistory from "./pages/StreakHistory";
import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Default */}

               <Route path="/" element={<Home />} />

                {/* Public Route */}

                <Route
                    path="/login"
                    element={<Login />}
                />
                        
              <Route
                   path="/register"
                   element={<Register />}
               />

               <Route
                  path="/privacy-policy"
                  element={
              <ProtectedRoute>
               <PrivacyPolicy />
              </ProtectedRoute>
             }
           />

               <Route
                path="/terms"
                element={
              <ProtectedRoute>
                  <Terms />
              </ProtectedRoute>
               }
            />

                {/* Protected Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/wallet"
                    element={
                        <ProtectedRoute>
                            <Wallet />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/streak-history"
                    element={
                        <ProtectedRoute>
                            <StreakHistory />
                        </ProtectedRoute>
                    }
                />


            </Routes>

        </BrowserRouter>
    );
}

export default App;