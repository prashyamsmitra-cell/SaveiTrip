import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import GoogleCallbackPage from "./auth/GoogleCallbackPage";
import LoginPage from "./auth/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import SignupPage from "./auth/SignupPage";
import HelperSignupPage from "./auth/HelperSignupPage";
import HelperProfileSetupPage from "./auth/HelperProfileSetupPage";
import HelperAuthPage from "./auth/HelperAuthPage";
import HelperLoginPage from "./auth/HelperLoginPage";
import ComparisonPage from "./comparison/ComparisonPage";
import DashboardPage from "./dashboard/DashboardPage";
import HelperDashboardPage from "./dashboard/HelperDashboardPage";
import LandingPage from "./LandingPage";
import ProfilePage from "./profile/ProfilePage";
import SosPage from "./sos/SosPage";
import TravelAssistantPage from "./travelAnalysis/TravelAssistantPage";
import TravelHelperPage from "./travelHelper/TravelHelperPage";
import HelperProfilePage from "./travelHelper/HelperProfilePage";
import HelperAlertPage from "./travelHelper/HelperAlertPage";
import AuthChoicePage from "./auth/AuthChoicePage";
import AppShell from "./shared/AppShell";
import { Brand } from "./shared/ui";
import { Icon } from "./shared/Icon";

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6 text-center">
      <section className="max-w-2xl page-fade">
        <Brand className="mx-auto justify-center text-xl" />
        <p className="kicker mt-10">404</p>
        <h1 className="font-display mt-4 text-5xl leading-tight">
          This route is not on the itinerary.
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-7 text-ink-soft">
          The page you're looking for doesn't exist. Head back to explore SaveiTrip.
        </p>
        <a href="/" className="btn btn-primary mt-8">
          <Icon name="arrow-left" className="h-4 w-4" />
          Go home
        </a>
      </section>
    </div>
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
          <Route path="/choose-login" element={<AuthChoicePage mode="login" />} />
          <Route path="/choose-signup" element={<AuthChoicePage mode="signup" />} />
          <Route path="/helper/signup" element={<HelperSignupPage />} />
          <Route path="/helper/profile-setup" element={<ProtectedRoute><HelperProfileSetupPage /></ProtectedRoute>} />
          <Route path="/helper/login" element={<HelperLoginPage />} />
          <Route path="/helper/auth" element={<ProtectedRoute><HelperAuthPage /></ProtectedRoute>} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/helper/dashboard" element={<ProtectedRoute><HelperDashboardPage /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><AppShell fullHeight><TravelAssistantPage /></AppShell></ProtectedRoute>} />
          <Route path="/helpers" element={<ProtectedRoute><TravelHelperPage /></ProtectedRoute>} />
          <Route path="/helpers/:id" element={<ProtectedRoute><HelperProfilePage /></ProtectedRoute>} />
          <Route path="/helpers/alert" element={<ProtectedRoute><HelperAlertPage /></ProtectedRoute>} />
          <Route path="/comparison" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
          <Route path="/sos" element={<ProtectedRoute><SosPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/services" element={<Navigate to="/dashboard" replace />} />
          <Route path="/trips/new" element={<Navigate to="/assistant" replace />} />
          <Route path="/prediction" element={<Navigate to="/assistant" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
