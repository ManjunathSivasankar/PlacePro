# PlacePro Setup Guide - Step by Step

This guide will help you get PlacePro running on your local machine and deploy it to production.

## Stage 1: Firebase Project Setup (15 minutes)

### Step 1.1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter "PlacePro" as the project name
4. Uncheck "Enable Google Analytics" (optional for development)
5. Click "Create project"
6. Wait for project creation (2-3 minutes)

### Step 1.2: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click "Get started"
3. Click on "Email/Password" provider
4. Enable it and click "Save"

### Step 1.3: Create Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click "Create database"
3. Select **Production mode** (not test mode)
4. Select location closest to you
5. Click "Enable"
6. Wait for database creation

### Step 1.4: Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click "Get started"
3. Leave security rules as default for now
4. Click "Done"

### Step 1.5: Get Firebase Credentials

1. Click on **Project Settings** (gear icon, top right)
2. Copy the entire Firebase configuration:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

3. Keep this information open in another tab - you'll need it soon

## Stage 2: Deploy Firebase Security Rules (10 minutes)

### Step 2.1: Update Firestore Rules

1. Go to **Firestore Database** > **Rules** tab
2. Replace the entire content with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users Collection
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow create: if request.auth.uid == uid && request.resource.data.role in ['student', 'admin'];
      allow update: if request.auth.uid == uid;
      allow delete: if false;
    }

    // Jobs Collection
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update: if request.auth != null && resource.data.postedBy == request.auth.uid;
      allow delete: if request.auth != null && resource.data.postedBy == request.auth.uid;
    }

    // Applications Collection
    match /applications/{appId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.postedBy == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.status == 'applied' &&
        request.resource.data.jobId != null &&
        request.resource.data.resumeUrl != null;
      
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        request.resource.data.userId == resource.data.userId &&
        request.resource.data.jobId == resource.data.jobId;
      
      allow delete: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
  }
}
```

3. Click "Publish"

### Step 2.2: Update Storage Rules

1. Go to **Storage** > **Rules** tab
2. Replace with this code:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId || 
        request.auth != null && exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      allow write: if request.auth.uid == userId &&
        request.resource.contentType == 'application/pdf' &&
        request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

3. Click "Publish"

## Stage 3: Local Project Setup (5 minutes)

### Step 3.1: Create Environment File

1. In the project root (placePro folder), create a file named `.env`
2. Add your Firebase credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

3. **IMPORTANT**: Do NOT commit this file to Git. It's already in `.gitignore`

### Step 3.2: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

Wait for all packages to install (2-3 minutes)

## Stage 4: Run Development Server (2 minutes)

### Step 4.1: Start the Dev Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 4.2: Open in Browser

1. Click the link or go to http://localhost:5173
2. You should see the PlacePro login page
3. Congratulations! The project is running locally 🎉

## Stage 5: Test the Application (10 minutes)

### Step 5.1: Create Admin Account

1. Click "Sign Up"
2. Fill in details:
   - **Name**: Admin User
   - **Email**: admin@test.com
   - **Password**: AdminPass123 (must have uppercase, lowercase, number)
   - **Confirm Password**: AdminPass123
   - **Role**: Admin/Recruiter
3. Click "Sign Up"
4. You should be redirected to Admin Dashboard

### Step 5.2: Test Admin Features

1. Click "+ Create New Job"
2. Fill in job details:
   - **Job Title**: Software Engineer
   - **Description**: Develop web applications
   - **Eligibility**: 7+ CGPA
   - **Location**: Bangalore
   - **Last Date**: Pick a future date
3. Click "Create Job"
4. You should see the job in your dashboard

### Step 5.3: Create Student Account

1. Logout (click Logout in header)
2. Click "Sign Up"
3. Fill in details:
   - **Name**: Student User
   - **Email**: student@test.com
   - **Password**: StudentPass123
   - **Confirm Password**: StudentPass123
   - **Role**: Student
   - **Degree**: B.Tech CSE
4. Click "Sign Up"
5. You should be in Student Dashboard

### Step 5.4: Test Student Features

1. Click "Browse Jobs"
2. You should see the job you created as admin
3. Click "Apply Now"
4. Upload a PDF resume (create a dummy PDF if needed)
5. Click "Submit Application"
6. You should get a success message

### Step 5.5: Verify Application in Admin

1. Logout
2. Login with admin account
3. Go to Admin Dashboard
4. Click "View Applications" on the job
5. You should see the student's application with resume link

## Stage 6: Build for Production (5 minutes)

### Step 6.1: Create Production Build

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### Step 6.2: Test Production Build

```bash
npm run preview
```

Visit http://localhost:4173 to test the production build.

## Stage 7: Deploy to Production (Choose One)

### Option A: Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```
   - Select project: PlacePro
   - Public directory: dist
   - Configure as single-page app: yes

4. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

Your app is now live at: `https://your-project.web.app`

### Option B: Vercel (Easy)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables (from .env file)
6. Click "Deploy"

### Option C: Netlify (Easy)

1. Push your code to GitHub
2. Go to https://netlify.com
3. Click "New site from Git"
4. Select your GitHub repo
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add environment variables
8. Click "Deploy"

## Troubleshooting

### Problem: "Firebase config not found"
- **Solution**: Check .env file exists and has all variables
- Restart dev server after updating .env

### Problem: Login page shows but can't signup/login
- **Solution**: 
  1. Check.env variables match Firebase project
  2. Go to Firebase Console > Authentication > Check Email/Password is enabled

### Problem: Resume upload fails
- **Solution**:
  1. Ensure file is PDF format
  2. File size less than 5MB
  3. Check Storage rules are deployed correctly

### Problem: "Permission denied" errors
- **Solution**:
  1. Go to Firestore > Rules
  2. Verify rules are correctly published
  3. Check user role is set correctly in Firestore

### Problem: Can't see jobs in student view
- **Solution**:
  1. Logout and login as student
  2. Click "Browse Jobs"
  3. If still empty, check admin posted jobs first

## Database Structure Reference

After signup, documents are automatically created:

**Firestore Collections:**
- **users/**: Each signup creates a user document with role, name, email
- **jobs/**: Created when admin posts a job
- **applications/**: Created when student applies with resume

Check data in Firebase Console > Firestore > Data

## Security Notes

✅ Never commit .env file
✅ Never share Firebase credentials
✅ Always use HTTPS in production
✅ Review Security Rules regularly
✅ Enable 2FA on Firebase account
✅ Use production mode for Firestore

## Next Steps

1. **Customize**: Update colors, fonts, branding in index.css
2. **Add Features**: Email notifications, profile updates, etc.
3. **Monitor**: Use Firebase Console to monitor usage
4. **Scale**: Add Firestore indexes as needed for performance

## Support Resources

- Firebase Docs: https://firebase.google.com/docs
- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Vite Docs: https://vitejs.dev

---

**Congratulations! You now have a fully functional placement management system running! 🚀**

For more details, see README.md in the project root.
