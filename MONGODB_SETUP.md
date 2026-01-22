# Complete MongoDB Setup Guide for Your Portfolio

## Step 1: Create MongoDB Atlas Account (FREE)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **Sign Up**
3. Create account with email/password
4. Verify email
5. Create organization (portfolio)

---

## Step 2: Create Cluster (FREE Tier)

1. After login, click **Create a Deployment**
2. Choose **M0 (FREE)** tier
3. Select region closest to you
4. Click **Create**
5. Wait 3-5 minutes for cluster to be ready

---

## Step 3: Get Connection String

1. Click **Connect** button
2. Choose **Drivers** (NOT Mongo Shell)
3. Select **Node.js** and **4.0 or later**
4. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 4: Create Database & Collections

In MongoDB Atlas:

1. Click **Database**
2. Click **Browse Collections**
3. Click **Create Database**
4. Database Name: `portfolio`
5. Create Collections:
   - `projects`
   - `hero_settings`
   - `skills`

---

## Step 5: Create Initial Data (Optional but Recommended)

### In MongoDB Atlas Atlas, go to Collections and add this sample data:

### **Projects Collection - Sample Document:**
```json
{
  "title": "Portfolio Website",
  "description": "Modern portfolio showcasing projects and collaborations",
  "tech_stack": ["Next.js", "React", "Tailwind CSS"],
  "image_url": "https://via.placeholder.com/400x250",
  "github_link": "https://github.com",
  "live_link": "https://example.com",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### **Hero Settings Collection - Sample Document:**
```json
{
  "title": "I'm Sangam Kunwar",
  "subtitle": "Full-Stack Developer & Designer",
  "description": "I'm passionate about building beautiful, functional web applications",
  "photo_url": "https://via.placeholder.com/400x300",
  "logo_url": "https://via.placeholder.com/100x100",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### **Skills Collection - Sample Document:**
```json
{
  "category": "Frontend",
  "items": ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## Step 6: Add Environment Variable to Netlify

1. Go to Netlify → Your site → **Site settings**
2. Click **Build & deploy** → **Environment**
3. Click **Edit variables**
4. Add new variable:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
   
   Replace:
   - `username` = Your MongoDB Atlas username
   - `password` = Your MongoDB Atlas password
   - `cluster` = Your cluster name (from connection string)

5. Click **Save**

---

## Step 7: Update Connection String Security

### Add Your IP Address to Whitelist:

1. In MongoDB Atlas, go to **Security** → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   OR
4. Enter your IP address manually for production

---

## Step 8: Create MongoDB Atlas User (If Not Done)

1. In MongoDB Atlas, go to **Database Access**
2. Click **Add a Database User**
3. Enter:
   - Username: `portfolio` (or your choice)
   - Password: (generate secure password)
4. Click **Add User**
5. Use these credentials in connection string

---

## Step 9: Redeploy Your Site

1. Go to Netlify → Your site
2. Click **Deployments**
3. Click **Trigger deploy** → **Deploy site**
4. Wait for deployment to complete

---

## Step 10: Test Your Admin Panel

1. Go to your site → Admin panel
2. Try adding a project:
   - Title: "Test Project"
   - Description: "Test Description"
   - Tech Stack: ["MongoDB", "Next.js"]
   - Click **Save**

3. Check MongoDB Atlas:
   - Go to **Database** → **Collections** → **projects**
   - You should see your project there!

4. Go to website → Refresh
5. You should see your project displayed!

---

## Troubleshooting

### "MONGODB_URI not found"
- Make sure you added env var to Netlify **and** redeployed

### "Connection refused"
- Check IP whitelist in MongoDB Atlas → Security → Network Access

### "Authentication failed"
- Verify username/password in connection string matches MongoDB user

### "Database portfolio doesn't exist"
- Create it in MongoDB Atlas first (Step 4)

### "Collection not found"
- Create collections manually or let app create them on first save

---

## Connection String Format

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://portfolio:MySecurePass123@portfolio-cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

---

## What Your App Now Does

✅ Admin panel saves to MongoDB  
✅ Website reads from MongoDB  
✅ Real-time sync between admin & website  
✅ Delete operations remove from MongoDB  
✅ All data persists permanently  

---

## Need Help?

- MongoDB Docs: https://docs.mongodb.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Check Netlify logs: Netlify → Deployments → View logs
