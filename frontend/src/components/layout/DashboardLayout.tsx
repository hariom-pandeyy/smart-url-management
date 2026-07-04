import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./DashboardLayout.css";

type Props = {
  children: React.ReactNode;
  onCreateClick: () => void;
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
};
const DashboardLayout = ({
  children,
  onCreateClick,
  title,
  subtitle,
   showCreateButton = true,
  
}: Props) => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <Navbar
  onCreateClick={onCreateClick}
  title={title}
  subtitle={subtitle}
  showCreateButton={showCreateButton}
/>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;