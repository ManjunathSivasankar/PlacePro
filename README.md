# PlacePro - Placement Drive Management System

A complete full-stack web application for managing placement drives built with React, Vite, and Firebase.

## Project Overview

PlacePro is a production-ready placement management system that enables:

- **Admins/Recruiters**: Create, update, and manage placement drives, view applicant profiles
- **Students**: Browse job opportunities, apply with resume uploads, and track application status

## Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (100% Cloud-based)
  - Firebase Authentication (Email & Password)
  - Cloud Firestore (NoSQL Database)
  - Firebase Storage (Resume uploads)
- **Styling**: CSS3 with responsive design
- **Routing**: React Router v6

## Project Structure

```
placepro/
├── src/
│   ├── firebase/
│   │   └── firebase.js              # Firebase configuration
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context & state
│   ├── services/
│   │   ├── authService.js           # Auth operations
│   │   ├── jobService.js            # Job CRUD operations
│   │   └── applicationService.js    # Application management
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── JobList.jsx
│   │   ├── CreateJob.jsx
│   │   └── EditJob.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ApplicationModal.jsx
│   ├── App.jsx                      # Main app component with routing
│   ├── App.css
│   ├── index.css                    # Global styles
│   └── main.jsx
├── .env                             # Environment variables (not committed)
├── .env.example                     # Template for environment variables
├── vite.config.js
├── package.json
└── index.html
```

## Setup Instructions

### Prerequisites

- Node.js 14+ and npm/yarn
- Firebase account
- Modern web browser

### Step 1: Firebase Setup

1. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project"
   - Enter project name and enable Google Analytics

2. Enable Firebase Services:
   - **Authentication**: Go to Authentication > Sign-in method > Enable Email/Password
   - **Firestore Database**: Create database in production mode
   - **Storage**: Create storage bucket

3. Get Your Credentials:
   - Go to Project Settings > General tab
   - Copy your Firebase SDK config (API Key, Auth Domain, Project ID, etc.)

4. Deploy Security Rules:
   - Go to Firestore > Rules
   - Copy content from `FIREBASE_RULES.txt` file
   - Go to Storage > Rules
   - Update with storage rules from `FIREBASE_RULES.txt`

### Step 2: Local Setup

1. **Clone/Download the project**:
   ```bash
   cd placepro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Rename `.env.example` to `.env`
   - Fill in your Firebase credentials:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:5173`

### Step 3: Build for Production

```bash
npm run build
```

Output files go to the `dist/` folder. Deploy to Firebase Hosting, Vercel, Netlify, etc.

## Features

### Authentication System

✅ **Email & Password Registration**
- Strong password validation (8+ chars, uppercase, lowercase, number)
- Email format validation
- Automatic role assignment during signup

✅ **Login & Authorization**
- Email/password login
- Role-based redirection (admin → /admin, student → /student)
- Protected routes

✅ **Session Management**
- Persistent login using Firebase auth
- Automatic logout option
- Auth state tracked via Context API

### Admin Features

✅ **Job Management**
- Create placement drives with details
- Edit existing jobs
- Delete jobs
- View all posted jobs
- View applicants per job

✅ **Application Tracking**
- See all applications per job
- View applicant resumes
- Update application status (Applied → Selected/Rejected)
- Export applicant lists

### Student Features

✅ **Job Browsing**
- View all available jobs
- Filter jobs by location, eligibility
- See job details and deadlines

✅ **Job Applications**
- Apply to jobs with resume upload
- Automatic duplicate application prevention
- Resume validation (PDF only, max 5MB)
- Application status tracking

✅ **Dashboard**
- View application stats (Total, Selected, Rejected, Pending)
- Track all applications
- Withdraw applications
- View application history

## Database Schema

### Firestore Collections

**users**
```javascript
{
  uid: string,
  name: string,
  email: string,
  role: "admin" | "student",
  degree: string (for students),
  skills: array (for students),
  createdAt: timestamp
}
```

**jobs**
```javascript
{
  id: string (auto),
  title: string,
  description: string,
  eligibility: string,
  location: string,
  lastDate: timestamp,
  postedBy: string (admin uid),
  createdAt: timestamp
}
```

**applications**
```javascript
{
  id: string (auto),
  jobId: string,
  userId: string (student uid),
  userName: string,
  status: "applied" | "selected" | "rejected",
  resumeUrl: string,
  appliedDate: timestamp,
  updatedAt: timestamp (optional)
}
```

## Security Features

🔐 **Firebase Security Rules**
- Users can only access their own profile
- Only admins can create/modify jobs
- Students can only create applications
- Resume upload restricted to authenticated users
- Role-based access control at database level

🔐 **Input Validation**
- Email format validation
- Password strength requirements
- File type & size validation for resumes
- Duplicate application prevention

🔐 **Error Handling**
- Try-catch blocks in all Firebase operations
- User-friendly error messages
- Proper error logging

## API/Service Methods

### Authentication Service

```javascript
signup(email, password, name, role, degree)    // Create new account
login(email, password)                          // Login user
logout()                                        // Logout
getUserProfile(uid)                             // Get user data
```

### Job Service

```javascript
createJob(jobData, adminUid)                    // Create job (admin)
getAllJobs()                                    // Get all jobs
getJob(jobId)                                   // Get single job
updateJob(jobId, updatedData)                   // Update job (admin)
deleteJob(jobId)                                // Delete job (admin)
getJobsByAdmin(adminUid)                        // Get jobs posted by admin
```

### Application Service

```javascript
submitApplication(jobId, userId, resumeUrl)    // Apply for job
checkDuplicateApplication(jobId, userId)       // Prevent duplicate applies
getApplicationsForJob(jobId)                    // Get applications per job
getApplicationsByStudent(userId)                // Get student's applications
updateApplicationStatus(appId, status)         // Update application status
deleteApplication(appId)                       // Withdraw application
uploadResume(file, userId)                      // Upload resume to storage
```

## Environment Variables

All sensitive Firebase credentials are stored in `.env` file (never committed):

```
VITE_FIREBASE_API_KEY          # API Key from Firebase
VITE_FIREBASE_AUTH_DOMAIN      # Auth domain
VITE_FIREBASE_PROJECT_ID       # Project ID
VITE_FIREBASE_STORAGE_BUCKET   # Storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID  # Messaging sender ID
VITE_FIREBASE_APP_ID           # Firebase app ID
```

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of pages
- CSS modules for component isolation
- Firestore query optimization with indexes
- Resume compression before upload

## Troubleshooting

### Issue: "Firebase config error"
**Solution**: Check .env file has all required variables. Restart dev server after updating .env

### Issue: "Permission denied" errors
**Solution**: Check Firebase Security Rules are correctly deployed. Verify user role in Firestore

### Issue: Resume upload fails
**Solution**: Check file is PDF, under 5MB, and Firebase Storage rules allow uploads

### Issue: Duplicate application error
**Solution**: This is working as designed - users can only apply once per job

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

3. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Alternative Platforms

- **Vercel**: Connect GitHub repo, auto-deploys on push
- **Netlify**: Drag & drop `dist/` folder or connect GitHub
- **AWS Amplify**: Use `amplify` CLI for deployment

## Contributing

Follow these guidelines when contributing:
1. Use meaningful commit messages
2. Test all features before pushing
3. Keep code clean and well-commented
4. Update documentation for new features

## License

MIT License - Feel free to use for personal or commercial projects

## Support

For issues or questions:
1. Check troubleshooting section
2. Review Firebase documentation
3. Check browser console for error details
4. Verify environment variables are set correctly

---

**Happy Coding! 🚀**

Built with ❤️ using React, Firebase, and Vite
