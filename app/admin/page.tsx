import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { CreateUserForm } from "@/components/create-user-form";

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
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.email}
          </p>
        </div>
        <Badge variant="default">Admin</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
            <CardDescription>All assets in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Manage system-wide configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg">
                <h3 className="font-semibold mb-2">General Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure system preferences and defaults
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-semibold mb-2">Security Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage security policies and access controls
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
            <CardDescription>View system analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg">
                <h3 className="font-semibold mb-2">User Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  View user activity and engagement metrics
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="font-semibold mb-2">System Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Generate and export system reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            User Management
            <Badge variant="default">Admin Only</Badge>
          </CardTitle>
          <CardDescription>
            Create and manage users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Asset Manager</Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Suspense fallback={<div>Loading...</div>}>
            <AdminDashboardContent />
          </Suspense>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}

