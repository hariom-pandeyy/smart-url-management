import { useState } from "react";
import { createShortUrl } from "../../services/urlService";
import "./CreateLinkModal.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const CreateLinkModal = ({ open, onClose, onCreated }: Props) => {
    const [originalUrl, setOriginalUrl] = useState("");
const [customAlias, setCustomAlias] = useState("");
const [password, setPassword] = useState("");
const [expiresAt, setExpiresAt] = useState("");
const [maxClicks, setMaxClicks] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      original_url: originalUrl,
      custom_alias: customAlias || undefined,
      password: password || undefined,
      expires_at: expiresAt || undefined,
      max_clicks: maxClicks ? Number(maxClicks) : null,
    };

    const data = await createShortUrl(payload);

    console.log("Created link:", data.data);
console.log("Short code:", data.data.short_code);
console.log("QR:", data.data.qr_code);
    alert("Short link created successfully!");

    setOriginalUrl("");
    setCustomAlias("");
    setPassword("");
    setMaxClicks("");
    setExpiresAt("");

    onClose();
    onCreated();
  } catch (error) {
    alert("Failed to create link");
  }
};
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Create Smart Link</h2>

          <button onClick={onClose}>✕</button>
        </div>

      <form onSubmit={handleSubmit}>

          <input
        type="text"
        placeholder="Original URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
   />

<input
  type="text"
  placeholder="Custom Alias (Optional)"
  value={customAlias}
  onChange={(e) => setCustomAlias(e.target.value)}
/>

         <input
  type="password"
  placeholder="Password (Optional)"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

<input
  type="number"
  min="1"
  placeholder="Max Clicks (Optional)"
  value={maxClicks}
  onChange={(e) => setMaxClicks(e.target.value)}
/>
<input
  type="datetime-local"
  value={expiresAt}
  onChange={(e) => setExpiresAt(e.target.value)}
/>
          <button type="submit">
            Create Link
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateLinkModal;