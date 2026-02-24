# PlacePro Development Guide

Welcome to the PlacePro - Placement Drive Management System development workspace!

## Quick Start

### Prerequisites
- Node.js 14+ installed
- Firebase project created
- Environment variables configured

### Development Server

```bash
npm run dev
```

Runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output in `dist/` folder

## Project Overview

**PlacePro** is a full-stack Firebase + React application for managing placement drives.

### Key Features
- ✅ Firebase Authentication (Email & Password)
- ✅ Role-based dashboards (Admin & Student)
- ✅ Job management (CRUD operations)
- ✅ Job applications with resume upload
- ✅ Application tracking and status management
- ✅ Firestore database with security rules
- ✅ Firebase Storage for resume management

## File Structure

```
src/
├── firebase/firebase.js          # Firebase config
├── context/AuthContext.jsx       # Auth state management
├── services/
│   ├── authService.js            # Auth operations
│   ├── jobService.js             # Job management
│   └── applicationService.js     # Application handling
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── AdminDashboard.jsx
│   ├── StudentDashboard.jsx
│   ├── JobList.jsx
│   ├── CreateJob.jsx
│   └── EditJob.jsx
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ApplicationModal.jsx
├── App.jsx
└── index.css
```

## Firebase Setup

### 1. Create Firebase Project
- Go to https://console.firebase.google.com
- Create new project
- Enable Email/Password authentication
- Create Firestore database (production mode)
- Create storage bucket

### 2. Configure Environment Variables
Create `.env` file with:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy Security Rules
Paste content from `FIREBASE_RULES.txt` into Firebase Console:
- Firestore Rules
- Storage Rules

## Development Workflow

### Adding a New Page

1. Create file in `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Header.jsx`

### Adding a Service Function

1. Add function to appropriate service file (`authService.js`, `jobService.js`, or `applicationService.js`)
2. Import and use in components/pages
3. Add error handling

### Working with Firestore

All database operations use services in `src/services/`. Example:

```javascript
import { getAllJobs } from '../services/jobService';

const jobs = await getAllJobs();
```

## Common Tasks

### Debugging Firebase Errors

1. Check browser console for error messages
2. Verify `.env` variables are set
3. Check Firebase Security Rules allow the operation
4. Verify user role in Firestore database

### Adding New Firestore Collection

1. Define structure in README.md database schema
2. Update security rules in `FIREBASE_RULES.txt`
3. Create service functions for CRUD operations
4. Update UI components

### Testing Authentication

Test accounts to create:
- Admin: admin@test.com / AdminPass123
- Student: student@test.com / StudentPass123

## Deployment

### To Vercel
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### To Firebase Hosting
```bash
npm run build
firebase deploy
```

## API Reference

### Auth Service
- `signup(email, password, name, role, degree)`
- `login(email, password)`
- `logout()`
- `getUserProfile(uid)`

### Job Service
- `createJob(jobData, adminUid)`
- `getAllJobs()`
- `getJob(jobId)`
- `updateJob(jobId, updatedData)`
- `deleteJob(jobId)`
- `getJobsByAdmin(adminUid)`

### Application Service
- `submitApplication(jobId, userId, resumeUrl, userName)`
- `checkDuplicateApplication(jobId, userId)`
- `getApplicationsForJob(jobId)`
- `getApplicationsByStudent(userId)`
- `updateApplicationStatus(appId, status)`
- `deleteApplication(appId)`
- `uploadResume(file, userId)`

## Troubleshooting

### Build Issues
```bash
npm run build
# Check output for errors
```

### Dev Server Issues
```bash
npm run dev -- --force
# Or clear cache
rm -rf dist/ node_modules/
npm install
npm run dev
```

### Firebase Connection Issues
- Verify `.env` has all required variables
- Check Firebase project settings
- Verify security rules allow operations
- Check network tab in DevTools

## Security Checklist

- ✅ Environment variables not committed
- ✅ Firebase security rules deployed
- ✅ Authentication properly validated
- ✅ User input validated client-side
- ✅ Role-based access enforced
- ✅ Sensitive data not stored in state

## Performance Tips

- Use React DevTools to check render issues
- Monitor Firestore read/write count
- Lazy-load pages with React Router
- Optimize images and files
- Use React.memo for expensive components

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and test
npm run dev

# Build before committing
npm run build

# Commit
git add .
git commit -m "Add feature description"
git push
```

## Resources

- [React Docs](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Vite Docs](https://vitejs.dev)

## Support

For issues:
1. Check README.md troubleshooting
2. Review browser console
3. Check Firebase logs
4. Verify `.env` configuration

---

Happy coding! 🚀
