import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Links from "./pages/Links/Links";
import AnalyticsOverview from "./pages/Analytics/AnalyticsOverview";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";


function Register() {
  return <h1>Register Page</h1>;
}




function App() {
  return (
    <BrowserRouter>
    <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  //<Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/links" element={<Links />} />
    <Route path="/analytics" element={<AnalyticsOverview />} />
    <Route path="/analytics/:id" element={<Analytics />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>
    </BrowserRouter>
  );
}

export default App;