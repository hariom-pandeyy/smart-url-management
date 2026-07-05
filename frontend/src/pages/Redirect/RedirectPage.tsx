import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://smart-url-management.onrender.com";

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Checking link...");

  useEffect(() => {
    const checkLink = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/url/info/${shortCode}`);

        if (res.data.passwordRequired) {
          setPasswordRequired(true);
          setMessage("");
          return;
        }

        window.location.href = `${API_URL}/api/url/${shortCode}`;
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Link unavailable");
      }
    };

    checkLink();
  }, [shortCode]);

  const verifyPassword = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/url/verify-password`, {
        shortCode,
        password,
      });

      window.location.href = res.data.original_url;
    } catch {
      setMessage("Incorrect password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#1e293b", padding: "32px", borderRadius: "18px", width: "380px" }}>
        {passwordRequired ? (
          <>
            <h1>Password Required</h1>
            <p style={{ color: "#94a3b8" }}>Enter password to continue.</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "14px", marginTop: "16px" }}
            />
            <button onClick={verifyPassword} style={{ width: "100%", marginTop: "16px", padding: "14px" }}>
              Unlock Link
            </button>
            <p>{message}</p>
          </>
        ) : (
          <h2>{message}</h2>
        )}
      </div>
    </div>
  );
};

export default RedirectPage;