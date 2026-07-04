import DashboardLayout from "../../components/layout/DashboardLayout";

const AnalyticsOverview = () => {
  return (
    <DashboardLayout
  title="Analytics"
  subtitle="Track clicks and visitor insights."
  onCreateClick={() => {}}
  showCreateButton={false}
>
      <h1 style={{ color: "white" }}>Analytics</h1>
      <p style={{ color: "#94a3b8" }}>
        Select any link from the Links page to view detailed analytics.
      </p>
    </DashboardLayout>
  );
};

export default AnalyticsOverview;