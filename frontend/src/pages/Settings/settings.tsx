import DashboardLayout from "../../components/layout/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout
  title="Settings"
  subtitle="Manage application preferences."
  onCreateClick={() => {}}
  showCreateButton={false}
>
      <h1 style={{ color: "white", marginBottom: "20px" }}>
        Settings
      </h1>

      <div
        style={{
          background: "#1E293B",
          borderRadius: "18px",
          padding: "24px",
          color: "white",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <h2>Settings Page</h2>

        <p style={{ color: "#94A3B8", marginTop: "10px" }}>
          Application settings will be available here.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Settings;