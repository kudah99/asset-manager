import { redirect } from "next/navigation";
import { Suspense } from "react";
import { hasEnvVars } from "@/lib/utils";

async function AuthCheck() {
  if (!hasEnvVars) {
    redirect("/auth/login");
    return null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    
    if (data?.claims) {
      // User is authenticated, redirect to dashboard
      redirect("/protected");
    } else {
      // User is not authenticated, redirect to login
      redirect("/auth/login");
    }
  } catch (error) {
    // If there's an error (e.g., missing env vars), redirect to login
    redirect("/auth/login");
  }
  
  return null;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck />
    </Suspense>
  );
}
