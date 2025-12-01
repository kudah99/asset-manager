import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
import { Card, Badge } from "antd";
import { CreateDepartmentForm } from "@/components/create-department-form";
import { hasEnvVars } from "@/lib/utils";
import { LoadingSpinner } from "@/components/loading-spinner";

async function DepartmentsContent() {
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
              Departments
            </h1>
            <p style={{ color: "rgba(0, 0, 0, 0.45)" }}>
              Create and manage departments for organizational structure
            </p>
          </div>
          <Badge status="success" text="Admin Only" />
        </div>
      </div>

      <Card
        title={
          <span>
            Create Department <Badge count="Admin Only" style={{ backgroundColor: "#20b2aa" }} />
          </span>
        }
        style={{ borderColor: "#20b2aa" }}
      >
        <p style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: 16 }}>
          Create new departments to organize your organization's structure and assign assets to departments.
        </p>
        <CreateDepartmentForm />
      </Card>
    </AdminDashboardLayout>
  );
}

export default function DepartmentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DepartmentsContent />
    </Suspense>
  );
}

