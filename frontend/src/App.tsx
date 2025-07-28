import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import BasicTables from "./pages/Tables/BasicTables";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import OAuthCallback from "./pages/AuthPages/OAuthCallback";
import ProtectedRoute from "./routes/ProtectedRoute";
import RewardTables from "./pages/Tables/RewardTable";

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route index path="/" element={<SignUp />} />
            {/* <Route path="/signup" element={<SignUp />} /> */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              
              <Route index path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />

              {/* Others Page */}
             <Route path="/profile" element={<UserProfiles />} />

              {/* Tables */}
              <Route path="/user-table" element={<ProtectedRoute><BasicTables /></ProtectedRoute>} />
              <Route path="/reward-table" element={<ProtectedRoute><RewardTables /></ProtectedRoute>} />
            </Route>

            {/* Auth Layout */}

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
