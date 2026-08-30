import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import GoogleCallbackPage from "./auth/GoogleCallbackPage";
import LoginPage from "./auth/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import SignupPage from "./auth/SignupPage";
import ComparisonPage from "./comparison/ComparisonPage";
import DashboardPage from "./dashboard/DashboardPage";
import LandingPage from "./LandingPage";
import PredictionPage from "./prediction/PredictionPage";
import ProfilePage from "./profile/ProfilePage";
import AppShell from "./shared/AppShell";
import SosPage from "./sos/SosPage";
import TripConsultationPage from "./trips/TripConsultationPage";

function NotFound() {
  return (
    <AppShell>
      <section className="max-w-2xl">
        <p className="text-sm text-ink-faint">404</p>
        <h1 className="font-display mt-3 text-5xl">This route is not on the itinerary.</h1>
        <p className="mt-5 text-ink-soft">Head back to the dashboard to continue exploring the SaveiTrip product shell.</p>
      </section>
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/trips/new" element={<ProtectedRoute><TripConsultationPage /></ProtectedRoute>} />
          <Route path="/comparison" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute><PredictionPage /></ProtectedRoute>} />
          <Route path="/sos" element={<ProtectedRoute><SosPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/services" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
