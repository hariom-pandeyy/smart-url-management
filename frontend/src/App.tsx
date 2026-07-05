import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Links from "./pages/Links/Links";
import AnalyticsOverview from "./pages/Analytics/AnalyticsOverview";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RedirectPage from "./pages/Redirect/RedirectPage";








function App() {
  return (
    <BrowserRouter>
    <Routes>
  <Route path="/" element={localStorage.getItem("token")?(
    <Navigate to="/dashboard" replace />
  ) : ( <Navigate to="/login" replace />)} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route element={<ProtectedRoute />}>
  <Route path="/:shortCode" element={<RedirectPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/links" element={<Links />} />
    <Route path="/analytics" element={<AnalyticsOverview />} />
    <Route path="/analytics/:id" element={<Analytics />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/:shortCode" element={<RedirectPage />} />
  </Route>
</Routes>
    </BrowserRouter>
  );
}

export default App;