import DashboardLayout from "../../components/layout/DashboardLayout";
import RecentLinks from "../../components/common/RecentLinks";
import CreateLinkModal from "../../components/common/CreateLinkModal";
import { useEffect, useState } from "react";
import { getMyLinks } from "../../services/urlService";


const Links = () => {
  const [openModal, setOpenModal] = useState(false);
  const [links, setLinks] = useState([]);
const [search, setSearch] = useState("");
  const fetchLinks = async () => {
    const data = await getMyLinks();
    setLinks(data);
  };
  

  useEffect(() => {
    fetchLinks();
  }, []);
  const filteredLinks = links.filter((link: any) =>
  (link.title || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <DashboardLayout
  title="All Links"
  subtitle="Manage and organize all your smart links."
  onCreateClick={() => setOpenModal(true)}
>
      <h1
        style={{
          color: "white",
          marginBottom: "25px",
        }}
      >
        All Links
      </h1>

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  }}
>
  <input
    type="text"
    placeholder="Search links..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: "320px",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1px solid #374151",
      background: "#1e293b",
      color: "white",
      outline: "none",
      fontSize: "14px",
    }}
  />
</div>
<RecentLinks
  links={filteredLinks}
  onDelete={fetchLinks}
/>
<CreateLinkModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onCreated={() => {
    setOpenModal(false);
    fetchLinks();
  }}
/>
    </DashboardLayout>
  );
};

export default Links;