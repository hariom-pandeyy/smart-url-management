import "./RecentLinks.css";
import { deleteLink } from "../../services/urlService";
import { useNavigate } from "react-router-dom";
import { Copy, QrCode, BarChart3, Trash2 } from "lucide-react";

type LinkItem = {
  id: number;
  original_url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  preview_image: string | null;
  short_code: string;
  click_count: number;
  is_active: boolean;
  qr_code: string | null;
  created_at: string;
   expires_at: string | null;
};
type Props = {
  links: LinkItem[];
  onDelete: () => void;
};

const formatTimeAgo = (date: string) => {
  if (!date) return "Unknown";

  const now = new Date();
  const created = new Date(date);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return "Just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};
const getExpiryStatus = (expiresAt: string | null) => {
  if (!expiresAt) {
    return {
      text: "Never",
      className: "expiry-never",
    };
  }

  const expiry = new Date(expiresAt);
  const now = new Date();

  if (expiry < now) {
    return {
      text: "Expired",
      className: "expiry-expired",
    };
  }

  return {
    text: expiry.toLocaleString(),
    className: "expiry-active",
  };
};

const RecentLinks = ({ links, onDelete }: Props) => {
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Delete this link?");
    if (!confirmDelete) return;

    await deleteLink(id);
    onDelete();
  };

  return (
    <div className="recent-links">
      <div className="table-header">
        <h2>Recent Links</h2>

        <button
          className="view-all-btn"
          onClick={() => navigate("/links")}
        >
          View All →
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Short URL</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Created</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td>
                <div className="link-title-cell">
                  {link.favicon ? (
                    <img src={link.favicon} alt="favicon" />
                  ) : (
                    <div className="fallback-favicon">
                      {link.title?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                  )}

                  <div>
                    <strong>
                      {link.title
                        ? link.title.split("·")[0].trim()
                        : "Untitled Link"}
                    </strong>
                      <div className="description-wrapper">
  <p>{link.description || link.original_url || link.short_code}</p>

  <div className="description-popup">
    {link.description || "No description available"}
  </div>
</div>
                      
                  </div>
                </div>
              </td>

              <td>
                <span className="short-code">
                  smarturl.dev/{link.short_code}
                </span>
              </td>

              <td>
                <span className="click-badge">
                  {link.click_count}
                </span>
              </td>

              <td>
  {link.expires_at &&
  new Date(link.expires_at) < new Date() ? (
    <span className="expired">Expired</span>
  ) : (
    <span className={link.is_active ? "active" : "inactive"}>
      {link.is_active ? "Active" : "Inactive"}
    </span>
  )}
</td>
              <td className="created-time">
                {formatTimeAgo(link.created_at)}
              </td>
<td>
  {(() => {
    const expiry = getExpiryStatus(link.expires_at);

    return (
      <span className={expiry.className}>
        {expiry.text}
      </span>
    );
  })()}
</td>

              <td>
                <div className="actions">
                  <button
                    className="icon-btn"
                    title="Copy Link"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://smart-url-management.onrender.com/api/url/${link.short_code}`
                      );
                      alert("Copied!");
                    }}
                  >
                    <Copy size={18} />
                  </button>

                  {link.qr_code && (
                    <button
                      className="icon-btn"
                      title="View QR"
                      onClick={() =>
                        window.open(
                          `https://smart-url-management.onrender.com${link.qr_code}`,
                          "_blank"
                        )
                      }
                    >
                      <QrCode size={18} />
                    </button>
                  )}

                  <button
                    className="icon-btn"
                    title="Analytics"
                    onClick={() => navigate(`/analytics/${link.id}`)}
                  >
                    <BarChart3 size={18} />
                  </button>

                  <button
                    className="icon-btn delete"
                    title="Delete"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentLinks;