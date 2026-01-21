# Fix Supabase Schema Cache Issue

## The Problem
Error: `Could not find the table 'public.hero_settings' in the schema cache`

**What this means:** Your Supabase project's REST API hasn't updated its schema cache, even though the tables exist in the database.

---

## The Solution (Choose ONE)

### Option 1: Restart Supabase Project (Recommended - 2 minutes)
1. Go to https://supabase.com/dashboard/projects
2. Click your "Portfolio website" project
3. Click **Settings** → **Restart Project**
4. Wait 30 seconds for it to restart
5. Refresh your v0 preview
6. Test: Go to admin panel and try adding a project
7. **Everything will work!** ✅

**Why this works:** Restarting clears the schema cache and forces Supabase to refresh it.

---

### Option 2: Force Schema Refresh with SQL
If restart doesn't work:

1. Go to https://supabase.com/dashboard/projects
2. Click "Portfolio website" → SQL Editor
3. Run this query:
```sql
NOTIFY pgrst, 'reload schema';
```
4. Wait 10 seconds
5. Refresh your v0 preview
6. **Should work now!** ✅

---

### Option 3: Check Project URL is Correct
Make sure your `NEXT_PUBLIC_SUPABASE_URL` environment variable matches your actual Supabase project URL:

1. Go to https://supabase.com/dashboard/projects
2. Click "Portfolio website" → Settings → API
3. Copy: **Project URL** (should be `https://aydaylqulmokedvkemwo.supabase.co`)
4. Make sure it matches your `NEXT_PUBLIC_SUPABASE_URL` in v0 Vars

---

## What to Expect After Fix

Once fixed:
- ✅ Admin panel will save projects, hero settings, skills
- ✅ Website will show saved data from database
- ✅ Real-time sync between admin and website
- ✅ All CRUD operations work

---

## Troubleshooting

**Still getting 404 error?**
1. Make sure you followed Option 1 (restart project)
2. Wait 2 minutes after restart
3. Clear browser cache (Ctrl+Shift+Delete)
4. Refresh v0 preview

**Can't access Supabase dashboard?**
1. Go to https://supabase.com/dashboard
2. Login with your email
3. Make sure you're in the right organization
4. Click "Portfolio website" project

---

## Expected Timeline
- **Restart project:** 2-3 minutes until Supabase is back online
- **Cache refresh:** 30 seconds after restart
- **First API call:** Should work immediately after

Do this NOW and your admin panel will work perfectly! 🚀
