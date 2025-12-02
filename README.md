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

# Email Configuration (Gmail SMTP) - Optional but recommended
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these values from your [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api).

**Email Configuration (Gmail SMTP) - Step by Step:**

1. **Enable 2-Step Verification** (Required):
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "2-Step Verification"
   - Follow the prompts to enable it (if not already enabled)

2. **Generate App Password**:
   - Go directly to: [App Passwords](https://myaccount.google.com/apppasswords)
   - Or navigate: Google Account > Security > 2-Step Verification > App passwords
   - Select "Mail" from the dropdown
   - Select your device (or "Other" and type "Asset Manager")
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
   - **Important**: Remove all spaces when adding to `.env.local` (should be: `abcdefghijklmnop`)

3. **Add to `.env.local`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=abcdefghijklmnop  # 16-character App Password (NO SPACES)
   SMTP_FROM=your-email@gmail.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Important Notes**:
   - ❌ **DO NOT** use your regular Gmail password
   - ✅ **MUST** use the 16-character App Password
   - ✅ **MUST** have 2-Step Verification enabled first
   - ✅ Remove all spaces from the App Password
   - ✅ Restart your dev server after changing `.env.local`

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