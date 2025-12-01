import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
import { Card, Statistic, Row, Col, Badge } from "antd";
import { hasEnvVars } from "@/lib/utils";
import { LoadingSpinner } from "@/components/loading-spinner";

async function AdminDashboardContent() {
  if (!hasEnvVars) {
    redirect("/auth/login");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;
  const userRole = (user.user_metadata?.role as string) || "user";
  const isAdmin = userRole === "admin";

  // Redirect non-admins to user dashboard
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <AdminDashboardLayout userEmail={user.email as string}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "rgba(0, 0, 0, 0.45)" }}>
              Welcome back, {user.email}
            </p>
          </div>
          <Badge status="success" text="Admin" />
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Assets"
              value={1234}
              valueStyle={{ color: "#20b2aa" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={42}
              valueStyle={{ color: "#20b2aa" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Recent Activity"
              value={89}
              suffix="last 24h"
              valueStyle={{ color: "#20b2aa" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>User Management</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  Create and manage user accounts
                </p>
              </div>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Asset Categories</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  Organize assets by categories
                </p>
              </div>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Departments</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  Manage organizational departments
                </p>
              </div>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Manage Assets</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  View and delete assets from the system
                </p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="System Overview" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Database Status</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  All systems operational
                </p>
              </div>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Security</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  Row Level Security (RLS) enabled
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </AdminDashboardLayout>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

