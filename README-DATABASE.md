# Database Setup Guide

This guide will help you set up the required database tables in your Supabase project.

## Quick Setup (Automated - Recommended)

**Prerequisites**: Make sure you have `POSTGRES_URL` set in your `.env.local` file.

1. **Run the setup script**:
   ```bash
   npm run setup-database
   ```

   This will automatically:
   - Connect to your database using `POSTGRES_URL`
   - Execute all SQL statements from `database/schema.sql`
   - Create all tables, indexes, and RLS policies
   - Show you progress and any errors

2. **Verify Tables Created**
   - Go to **Table Editor** in Supabase Dashboard
   - You should see three tables:
     - `asset_categories`
     - `departments`
     - `assets`

## Manual Setup (Alternative)

If you prefer to set up manually or don't have `POSTGRES_URL` configured:

1. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard
   - Navigate to: **SQL Editor** (in the left sidebar)
   - Click **New Query**

2. **Run the Schema SQL**
   - Copy the entire contents of `database/schema.sql`
   - Paste it into the SQL Editor
   - Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

3. **Verify Tables Created**
   - Go to **Table Editor** in Supabase Dashboard
   - You should see three tables:
     - `asset_categories`
     - `departments`
     - `assets`

## Required Tables

The application requires the following tables:

### 1. `asset_categories`
Stores asset categories created by admins.

### 2. `departments`
Stores departments created by admins.

### 3. `assets`
Stores assets created by users.

## Row Level Security (RLS)

All tables have Row Level Security enabled with the following policies:

- **Admins**: Can manage (create, read, update, delete) all records
- **Users**: Can read all records and insert their own assets

## Troubleshooting

If you see errors like:
- "Could not find the table 'public.assets'"
- "relation does not exist"

**Solution**: Run the SQL schema file in your Supabase SQL Editor.

## Manual Table Creation (Alternative)

If you prefer to create tables manually, use these SQL commands:

```sql
-- Assets Table
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  date_purchased DATE NOT NULL,
  cost NUMERIC(12, 2) NOT NULL,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Categories Table
CREATE TABLE asset_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments Table
CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Then enable RLS and create policies as shown in `database/schema.sql`.

## Migration for Existing Tables

If you already have the `assets` table created, run `database/migration-add-fields.sql` to add the new `date_purchased` and `cost` columns.

