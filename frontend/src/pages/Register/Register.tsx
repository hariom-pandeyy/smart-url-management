import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const API_URL = "https://smart-url-management.onrender.com";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">
     <form className="register-card" onSubmit={handleRegister}>
        <h1>Create Account</h1>
        <p>Register to start managing smart links</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
<p className="register-login-link" onClick={() => navigate("/login")}>
  Already have an account? Login
</p>
      </form>
    </div>
  );
};

export default Register;