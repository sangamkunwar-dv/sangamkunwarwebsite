# MongoDB Setup Guide for Your Portfolio Admin Panel

## STEP 1: Create MongoDB Atlas Account (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account with email
4. Create a FREE cluster:
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select region closest to you
   - Click "Create Cluster"
5. Wait 2-3 minutes for cluster creation

## STEP 2: Get MongoDB Connection String (3 minutes)

1. In MongoDB Atlas, click "Connect"
2. Click "Drivers"
3. Select "Node.js" and copy connection string
4. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority`

## STEP 3: Create Database & Collections

Replace YOUR_PASSWORD in connection string and run in MongoDB Shell or use Compass:

```javascript
// Create collections
db.createCollection("projects")
db.createCollection("hero_settings")
db.createCollection("skills")

// Create indexes
db.projects.createIndex({ "created_at": -1 })
db.hero_settings.createIndex({ "updated_at": -1 })
db.skills.createIndex({ "updated_at": -1 })
```

## STEP 4: Add Environment Variables to Netlify

Go to: Netlify → Site Settings → Build & Deploy → Environment

Add:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=https://sangamtest1.netlify.app
```

## STEP 5: Install MongoDB Package

Your package.json already has packages needed. No new installation required.

---

# API ROUTES for MongoDB

Replace your current API routes with MongoDB versions:

## 1. GET /api/projects - Fetch all projects

```typescript
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

export async function GET() {
  try {
    if (!MONGODB_URI) {
      return NextResponse.json([], { status: 200 });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('portfolio');
    
    const projects = await db
      .collection('projects')
      .find()
      .sort({ created_at: -1 })
      .toArray();
    
    await client.close();
    return NextResponse.json(projects);
  } catch (err) {
    console.error('[v0] Error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
```

## 2. POST /api/projects - Create project

```typescript
export async function POST(request) {
  try {
    const body = await request.json();
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('portfolio');
    
    const result = await db.collection('projects').insertOne({
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    });
    
    const project = await db.collection('projects').findOne({ _id: result.insertedId });
    await client.close();
    
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('[v0] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

## 3. PUT /api/projects/[id] - Update project

```typescript
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('portfolio');
    
    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updated_at: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      await client.close();
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });
    await client.close();
    
    return NextResponse.json(project);
  } catch (err) {
    console.error('[v0] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

## 4. DELETE /api/projects/[id] - Delete project

```typescript
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('portfolio');
    
    const result = await db.collection('projects').deleteOne({
      _id: new ObjectId(id)
    });
    
    await client.close();
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[v0] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

---

# SAME FOR hero-settings and skills

Create similar API routes:
- `/api/hero-settings` (GET, PUT)
- `/api/skills` (GET, POST, PUT, DELETE)

---

# WEBSITE COMPONENTS (No Changes Needed!)

Your existing website components already fetch from these API routes:
- `/components/projects.tsx` - Already fetches from `/api/projects`
- `/components/hero.tsx` - Already fetches from `/api/hero-settings`
- `/components/skills.tsx` - Already fetches from `/api/skills`

No changes needed - just switch the API routes to MongoDB!

---

# ADMIN COMPONENTS (No Changes Needed!)

Your admin components already call these API routes:
- `/components/admin/projects-manager.tsx` - Saves to `/api/projects`
- `/components/admin/hero-settings.tsx` - Saves to `/api/hero-settings`
- `/components/admin/skills-manager.tsx` - Saves to `/api/skills`

No changes needed - just switch the API routes to MongoDB!

---

# SUMMARY

1. Create MongoDB Atlas account (FREE tier)
2. Create collections: projects, hero_settings, skills
3. Get connection string
4. Add MONGODB_URI to Netlify environment variables
5. Replace API routes with MongoDB versions
6. Redeploy
7. Done! ✅

Your website and admin panel will work exactly the same - just with MongoDB instead of Supabase!
