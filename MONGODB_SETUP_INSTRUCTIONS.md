# MongoDB Setup - Step by Step Guide for sangamtest1.netlify.app

## STEP 1: Create MongoDB Atlas Account (Free)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** → Create account with email
3. Create your first cluster:
   - Click **"Build a Database"**
   - Choose **FREE M0 tier**
   - Select region closest to you (e.g., us-east-1)
   - Click **"Create Cluster"**
4. Wait 2-3 minutes for cluster to be ready

## STEP 2: Create Database & Collections

Once cluster is ready:

1. Click **"Database"** → **"Collections"**
2. Click **"Create Database"**:
   - Database name: **portfolio**
   - Collection name: **projects**
   - Click **"Create"**

3. Create 2 more collections:
   - Click **"+ Create Collection"**
   - Name: **hero_settings** → Create
   - Name: **skills** → Create

Now you have 3 collections created!

## STEP 3: Get MongoDB Connection String

1. Click **"Connect"** button on cluster
2. Choose **"Drivers"**
3. Select **Node.js** version
4. Copy the connection string
5. It looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

## STEP 4: Add MongoDB URI to Netlify

1. Go to: https://app.netlify.com
2. Click your **"sangamtest1"** site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **"Add variable"**
5. Add this variable:
   ```
   MONGODB_URI = [paste your connection string from Step 3]
   ```
6. Click **"Save"**

## STEP 5: Redeploy Your Site

1. Go back to your Netlify site
2. Click **"Deploys"**
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Wait for deployment to complete

---

## YOUR SYSTEM IS NOW CONNECTED!

### Admin Panel Features:
✅ Add/Edit/Delete Projects  
✅ Update Hero Settings  
✅ Manage Skills  
✅ Real-time sync with website  

### Website Features:
✅ Display saved projects  
✅ Show hero settings  
✅ List all skills  
✅ Real-time updates from admin  

---

## How It Works:

1. **Admin Panel** (http://sangamtest1.netlify.app/admin)
   - Save project → Sent to `/api/projects`
   - API route connects to MongoDB
   - Data stored in `projects` collection

2. **Website** (http://sangamtest1.netlify.app)
   - Page loads → Fetches from `/api/projects`
   - API returns data from MongoDB
   - Website displays projects

---

## If Something Goes Wrong:

**Check MongoDB Connection:**
1. Go to MongoDB Atlas
2. Cluster → **Connect** → **Drivers**
3. Copy connection string again
4. Make sure it has: `password`, `host`, `database`

**Check Netlify Environment Variable:**
1. Netlify → Site settings → Build & deploy → Environment
2. Verify `MONGODB_URI` is set correctly
3. Click "Trigger deploy" to redeploy

**Check API Logs:**
1. Netlify → Deploys → Click latest deploy
2. Click **"Logs"** tab
3. Look for errors about MongoDB connection

---

## Sample Data Setup

Optional: Add sample data to test:

```javascript
// Copy this to MongoDB Shell or Compass

db.projects.insertOne({
  "title": "Sample Project",
  "description": "My awesome project",
  "tech_stack": ["React", "Node.js", "MongoDB"],
  "image_url": "https://example.com/image.jpg",
  "github_link": "https://github.com/user/project",
  "live_link": "https://project.com",
  "created_at": new Date(),
  "updated_at": new Date()
})

db.hero_settings.insertOne({
  "title": "Hi, I'm Sangam",
  "subtitle": "Full Stack Developer",
  "description": "I build amazing web applications",
  "photo_url": "https://example.com/photo.jpg",
  "logo_url": "https://example.com/logo.jpg",
  "created_at": new Date(),
  "updated_at": new Date()
})

db.skills.insertOne({
  "category": "Frontend",
  "items": ["React", "TypeScript", "Tailwind CSS"],
  "created_at": new Date(),
  "updated_at": new Date()
})
```

---

**Congratulations! Your portfolio is now powered by MongoDB!** 🚀

Admin panel → Save data → Instantly displayed on website
