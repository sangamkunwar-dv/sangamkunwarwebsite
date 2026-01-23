# MongoDB Setup - Complete Instructions

## Status
✅ Code is ready - ALL 8 API routes converted to MongoDB
✅ Environment variable MONGODB_URI has been requested
⏳ You need to: Create MongoDB database and add connection string

---

## What You Need to Do (4 Steps)

### Step 1: Create Free MongoDB Account
**Go to:** https://www.mongodb.com/cloud/atlas

1. Click **"Sign Up"**
2. Enter email, password, and create account
3. Click **"Create"** button to proceed

### Step 2: Create MongoDB Cluster
1. Select **M0 (FREE tier)** - completely free
2. Choose region closest to you
3. Click **"Create Cluster"**
4. Wait 3-5 minutes for cluster to start

### Step 3: Get Your Connection String
1. Click **"Connect"** button
2. Click **"Drivers"**
3. Copy the MongoDB Connection String (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myFirstDatabase
   ```
4. Replace `username` with your MongoDB username
5. Replace `password` with your MongoDB password
6. Replace `myFirstDatabase` with `portfolio`

Final string should look like:
```
mongodb+srv://sangam:MyPassword123@cluster0.abcd1234.mongodb.net/portfolio?retryWrites=true&w=majority
```

### Step 4: The MONGODB_URI Variable is Already Set
✅ The environment variable `MONGODB_URI` has been added to your project
- You just need to provide your connection string when prompted

---

## What Happens Next

After you provide the MongoDB connection string:

1. **Your Admin Panel Can:**
   - ✅ Save projects to MongoDB
   - ✅ Delete projects from MongoDB  
   - ✅ Edit hero settings in MongoDB
   - ✅ Manage skills in MongoDB

2. **Your Website Will:**
   - ✅ Load all data from MongoDB
   - ✅ Show projects, skills, hero section
   - ✅ Auto-update when admin makes changes

3. **Database Operations:**
   - All data persists in MongoDB
   - No more "Failed to save" errors
   - Real-time sync between admin and website

---

## MongoDB Collections (Created Automatically)

Your app will create 3 collections in the `portfolio` database:

1. **projects** - For your portfolio projects
   - Fields: title, description, image, link, tags, created_at, updated_at

2. **hero_settings** - For hero section
   - Fields: title, subtitle, image, buttons, created_at, updated_at

3. **skills** - For your skills
   - Fields: name, level, icon, category, created_at, updated_at

---

## Testing After Setup

Once you provide the connection string:

1. Go to your website admin panel
2. Try adding a project
3. Click "Save"
4. Go to website homepage
5. Refresh the page
6. You should see your project! ✅

---

## Troubleshooting

**If you get "Connection refused" error:**
- Check your username and password are correct
- Make sure you copied the full connection string
- Try getting a new connection string from MongoDB Atlas

**If data doesn't appear:**
- Wait 1-2 seconds for MongoDB to process
- Refresh the page
- Check MongoDB Atlas dashboard to see if data was saved

---

## Files Updated (All API Routes)

✅ `/app/api/projects/route.ts` - MongoDB
✅ `/app/api/projects/[id]/route.ts` - MongoDB  
✅ `/app/api/hero-settings/route.ts` - MongoDB
✅ `/app/api/skills/route.ts` - MongoDB
✅ `/app/api/skills/[id]/route.ts` - MongoDB

All routes now:
- Connect to MongoDB database
- Save data to MongoDB  
- Fetch data from MongoDB
- Delete data from MongoDB
- Have proper error handling with logging

---

## Next Steps

1. **Get your MongoDB connection string** (4 steps above)
2. **Add it to environment variables** (already requested)
3. **Redeploy your website**
4. **Test saving a project**

That's it! Your admin panel will work perfectly with MongoDB! 🚀
