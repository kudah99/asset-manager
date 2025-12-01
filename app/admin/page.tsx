import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
import { Card, Statistic, Row, Col, Badge, Tabs } from "antd";
import { CreateUserForm } from "@/components/create-user-form";
import { CreateCategoryForm } from "@/components/create-category-form";
import { CreateDepartmentForm } from "@/components/create-department-form";
import { ManageAssets } from "@/components/manage-assets";
import { hasEnvVars } from "@/lib/utils";

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

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="System Settings">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>General Settings</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  Configure system preferences and defaults
                </p>
              </div>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Security Settings</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  Manage security policies and access controls
                </p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Analytics & Reports">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>User Analytics</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  View user activity and engagement metrics
                </p>
              </div>
              <div style={{ padding: 12, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>System Reports</h3>
                <p style={{ color: "rgba(0, 0, 0, 0.45)", margin: 0 }}>
                  Generate and export system reports
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "User Management",
            children: (
              <Card
                title={
                  <span>
                    Create New User <Badge count="Admin Only" style={{ backgroundColor: "#20b2aa" }} />
                  </span>
                }
                style={{ borderColor: "#20b2aa" }}
              >
                <p style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: 16 }}>
                  Create and manage users in the system
                </p>
                <CreateUserForm />
              </Card>
            ),
          },
          {
            key: "2",
            label: "Asset Categories",
            children: (
              <Card
                title={
                  <span>
                    Create Asset Category <Badge count="Admin Only" style={{ backgroundColor: "#20b2aa" }} />
                  </span>
                }
                style={{ borderColor: "#20b2aa" }}
              >
                <p style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: 16 }}>
                  Create new asset categories to organize your assets
                </p>
                <CreateCategoryForm />
              </Card>
            ),
          },
          {
            key: "3",
            label: "Departments",
            children: (
              <Card
                title={
                  <span>
                    Create Department <Badge count="Admin Only" style={{ backgroundColor: "#20b2aa" }} />
                  </span>
                }
                style={{ borderColor: "#20b2aa" }}
              >
                <p style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: 16 }}>
                  Create new departments for organizational structure
                </p>
                <CreateDepartmentForm />
              </Card>
            ),
          },
          {
            key: "4",
            label: "Manage Assets",
            children: (
              <Card
                title={
                  <span>
                    Delete Assets <Badge count="Admin Only" style={{ backgroundColor: "#20b2aa" }} />
                  </span>
                }
                style={{ borderColor: "#20b2aa" }}
              >
                <p style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: 16 }}>
                  View and delete existing assets from the system
                </p>
                <ManageAssets />
              </Card>
            ),
          },
        ]}
      />
    </AdminDashboardLayout>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

