import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Error: Missing required environment variables");
  console.error("Please ensure the following are set in your .env.local file:");
  console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nYou can find the service role key in your Supabase project settings:");
  console.error("  https://supabase.com/dashboard/project/_/settings/api");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npm run create-admin <email> <password>");
  console.error("Example: npm run create-admin admin@example.com StrongPass123");
  process.exit(1);
}

// Create Supabase admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdmin() {
  try {
    console.log(`Creating admin user with email: ${email}...`);

    // Create the user with admin role in metadata
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email so they can login immediately
      user_metadata: {
        role: "admin",
      },
    });

    if (error) {
      console.error("Error creating admin user:", error.message);
      process.exit(1);
    }

    if (data.user) {
      console.log("✅ Admin user created successfully!");
      console.log(`   Email: ${data.user.email}`);
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Role: admin`);
      console.log("\nYou can now login with these credentials.");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

createAdmin();

