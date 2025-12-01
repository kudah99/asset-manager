# Asset Manager

Asset management system built with Next.js, Supabase, and Ant Design theming.

## Tech Stack

- **Next.js** - React framework
- **Supabase** - Backend and database
- **Ant Design** - UI components with theming

## Setup

### 1. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_HOST=your_postgres_host
POSTGRES_USER=postgres
POSTGRES_DATABASE=postgres
POSTGRES_PASSWORD=your_postgres_password
```

Get these values from your [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api).

### 2. Database Setup

Run the database setup script:

```bash
npm run setup-database
```

This creates all required tables and policies.

### 3. Create Admin Account

Create an admin user via command line:

```bash
npm run create-admin <email> <password>
```

Example:
```bash
npm run create-admin admin@example.com StrongPass123
```

**Default Admin Credentials:**
- Email: `admin@assetmanager.co.zw`
- Password: `admin.123`

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)
