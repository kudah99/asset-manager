import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getClaims();

    // Check if user is authenticated
    if (!authData?.claims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, category, department, date_purchased, cost, description, status } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Asset name is required" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (!date_purchased) {
      return NextResponse.json({ error: "Date purchased is required" }, { status: 400 });
    }
    if (cost === undefined || cost === null) {
      return NextResponse.json({ error: "Cost is required" }, { status: 400 });
    }
    if (!department) {
      return NextResponse.json({ error: "Department is required" }, { status: 400 });
    }

    // Insert into assets table
    const { data, error } = await supabase
      .from("assets")
      .insert([
        {
          name,
          category,
          department,
          date_purchased: date_purchased || null,
          cost: cost ? parseFloat(cost.toString()) : null,
          description: description || null,
          status: status || "active",
        },
      ])
      .select()
      .single();

    if (error) {
      // If table doesn't exist, return a helpful error
      if (error.code === "42P01") {
        return NextResponse.json(
          {
            error:
              "Assets table not found. Please create the 'assets' table in your Supabase database.",
            hint:
              "CREATE TABLE assets (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT NOT NULL, category TEXT, date_purchased DATE, cost NUMERIC(12, 2), department TEXT, status TEXT DEFAULT 'active', description TEXT, created_at TIMESTAMP DEFAULT NOW());",
          },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, asset: data });
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getClaims();

    // Check if user is authenticated
    if (!authData?.claims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's assets
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist, return helpful error
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "Assets table not found. Please run the database schema setup.",
            hint: "See database/schema.sql or README-DATABASE.md for setup instructions.",
            assets: [],
          },
          { status: 200 } // Return 200 with empty array so UI doesn't break
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ assets: data || [] });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

