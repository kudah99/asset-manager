import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch (error) {
    // If cookies() fails, we can't create a proper client
    // This should not happen in normal circumstances
    throw new Error("Failed to access cookies");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
            // In API routes, cookie setting might fail silently
            if (process.env.NODE_ENV === "development") {
              console.warn("Cookie setting failed (this is normal in some contexts):", error);
            }
          }
        },
      },
    },
  );
}
