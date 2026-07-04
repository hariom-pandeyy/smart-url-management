import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/common/StatsCard";
import RecentLinks from "../../components/common/RecentLinks";
import CreateLinkModal from "../../components/common/CreateLinkModal";
import { getMyLinks } from "../../services/urlService";


const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [links, setLinks] = useState([]);

  const totalLinks = links.length;

const totalClicks = links.reduce(
  (sum: number, link: any) => sum + link.click_count,
  0
);

const activeLinks = links.filter(
  (link: any) => link.is_active
).length;

const qrGenerated = links.filter(
  (link: any) => link.qr_code
).length;
const fetchLinks = async () => {
  const data = await getMyLinks();
  setLinks(data);
};
  useEffect(() => {
  fetchLinks();
}, []);
 

  return (
    <DashboardLayout onCreateClick={() => setOpenModal(true)}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        <StatsCard title="Total Links" value={totalLinks} />
<StatsCard title="Total Clicks" value={totalClicks} />
<StatsCard title="Active Links" value={activeLinks} />
<StatsCard title="QR Generated" value={qrGenerated} />
      </div>

     <RecentLinks
  links={links.slice(0, 5)}
  onDelete={fetchLinks}
/>
      <CreateLinkModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onCreated={fetchLinks}
/>
    </DashboardLayout>
  );
};

export default Dashboard;