import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getLinkAnalytics } from "../../services/analyticsService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
Line,
CartesianGrid,
} from "recharts";

const COLORS = ["#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

const Analytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!id) return;
      const data = await getLinkAnalytics(id);
      setAnalytics(data);
    };

    fetchAnalytics();
  }, [id]);

  if (!analytics) {
    return (
      <DashboardLayout onCreateClick={() => {}}>
        <h2 style={{ color: "white" }}>Loading analytics...</h2>
      </DashboardLayout>
    );
  }

  const browserData = analytics.browsers.map((item: any) => ({
    name: item.browser || "Unknown",
    value: Number(item.count),
  }));

  const deviceData = analytics.devices.map((item: any) => ({
    name: item.device_type || "Desktop",
    value: Number(item.count),
  }));
  const timelineData = analytics.timeline.map((item: any) => ({
  date: new Date(item.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  }),
  clicks: Number(item.clicks),
}));

  return (
    <DashboardLayout onCreateClick={() => {}}>
      <h1 style={{ color: "white", marginBottom: "8px" }}>
        Link Analytics
      </h1>

      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
        Track clicks, browsers, and devices for this short link.
      </p>

      <div className="analytics-stats-grid">
        <div className="stats-card">
          <p>Total Clicks</p>
          <h2>{analytics.total_clicks}</h2>
        </div>

        <div className="stats-card">
          <p>Browsers</p>
          <h2>{analytics.browsers.length}</h2>
        </div>

        <div className="stats-card">
          <p>Devices</p>
          <h2>{analytics.devices.length}</h2>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2>Browser Distribution</h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={browserData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {browserData.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            
          </ResponsiveContainer>
          <div style={{ marginTop: "20px" }}>
  {browserData.map((item: any, index: number) => (
    <div
      key={item.name}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: COLORS[index % COLORS.length],
          }}
        />

        <span>{item.name}</span>
      </div>

      <strong>{item.value} Clicks</strong>
    </div>
  ))}
</div>
        </div>

        <div className="analytics-card">
          <h2>Device Distribution</h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {deviceData.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "20px" }}>
  {deviceData.map((item: any, index: number) => (
    <div
      key={item.name}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: COLORS[index % COLORS.length],
          }}
        />

        <span>{item.name}</span>
      </div>

      <strong>{item.value} Clicks</strong>
    </div>
  ))}
</div>
        </div>
      </div>
<div className="analytics-card" style={{ marginTop: "24px" }}>
  <h2>Clicks Over Time</h2>

  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={timelineData}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
      <XAxis dataKey="date" stroke="#94a3b8" />
      <YAxis stroke="#94a3b8" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="clicks"
        stroke="#8b5cf6"
        strokeWidth={3}
        dot={{ r: 5 }}
        activeDot={{ r: 7 }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
    </DashboardLayout>
  );
};

export default Analytics;