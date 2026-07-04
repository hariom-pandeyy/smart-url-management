import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Link as LinkIcon,
  BarChart3,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">🔗 SmartURL</h2>

      <nav>
        <NavLink to="/dashboard" className="nav-link">
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/links" className="nav-link">
  <LinkIcon size={18} /> Links
</NavLink>
        <NavLink to="/analytics" className="nav-link">
          <BarChart3 size={18} /> Analytics
        </NavLink>

        <NavLink to="/profile" className="nav-link">
          <User size={18} /> Profile
        </NavLink>

        <NavLink to="/settings" className="nav-link">
          <Settings size={18} /> Settings
        </NavLink>

        <button className="nav-link logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;