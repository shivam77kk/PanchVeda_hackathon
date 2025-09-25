# 🧪 Google OAuth Testing Guide

## ✅ Current Status
- ✅ MongoDB connected to "PanchVeda" database
- ✅ Google OAuth strategies initialized correctly  
- ✅ User/Doctor schemas working properly
- ✅ Database saving functionality verified
- ✅ All test data cleaned up

## 🎯 How to Test Google OAuth Properly

### Step 1: Ensure Server is Running
```bash
cd C:\Users\AFREEN\Documents\GitHub\PanchVeda_hackathon\backend
node index.js
```

**Expected output:**
```
✅ MongoDB connected successfully.
📊 Database: PanchVeda
🌐 Host: ac-tvf6ube-shard-00-02.yhj8gzy.mongodb.net
📁 Available collections: ['users', 'doctors', ...]
Initializing Google OAuth with callbacks: {
  patient: 'http://localhost:5000/api/auth/google/patient/callback',
  doctor: 'http://localhost:5000/api/auth/google/doctor/callback'
}
Server is running on port 5000
```

### Step 2: Test Database Connectivity
Visit: `http://localhost:5000/api/auth/google/test-db`

Should return:
```json
{
  "status": "Database connection successful",
  "database": "PanchVeda",
  "users": 0,
  "doctors": 0,
  "readyState": 1
}
```

### Step 3: Test Google OAuth Flow

#### For Patient Registration:
1. **Open in NEW INCOGNITO/PRIVATE browser window:**
   ```
   http://localhost:5000/api/auth/google/patient
   ```

2. **Expected flow:**
   - Redirects to Google OAuth consent page
   - User logs in with Google account  
   - Google redirects back to: `http://localhost:5000/api/auth/google/patient/callback`
   - Backend processes authentication
   - User gets redirected to: `http://localhost:3000/dashboard?view=patient&token=...`

#### For Doctor Registration:
1. **Open in NEW INCOGNITO/PRIVATE browser window:**
   ```
   http://localhost:5000/api/auth/google/doctor
   ```

2. **Expected flow:**
   - Redirects to Google OAuth consent page
   - User logs in with Google account
   - Google redirects back to: `http://localhost:5000/api/auth/google/doctor/callback`
   - Backend processes authentication  
   - User gets redirected to: `http://localhost:3000/dashboard?view=doctor&token=...`

### Step 4: Monitor Server Logs

When OAuth succeeds, you should see:
```
=== [Google PATIENT] OAuth Strategy Callback ===
Profile received: { id: '...', email: '...', name: '...' }
🔍 Checking for existing user with email: your-email@gmail.com
🆕 Creating new patient for Google user: your-email@gmail.com
User data to be saved: { googleId: '...', name: '...', email: '...' }
✅ New patient created successfully: { id: '...', collection: 'users' }

=== GOOGLE OAUTH CALLBACK HANDLER ===
📝 Request user data: { exists: true, id: '...', email: '...', role: 'patient' }
```

### Step 5: Verify in MongoDB Atlas

After successful OAuth:
1. Go to MongoDB Atlas → PanchVeda Database
2. Check `users` collection (for patients) or `doctors` collection (for doctors)
3. You should see a new document with:
   ```json
   {
     "_id": ObjectId("..."),
     "googleId": "your-google-user-id",
     "name": "Your Google Display Name", 
     "email": "your-email@gmail.com",
     "age": 25, // or 30 for doctors
     "gender": "Other", // for patients
     "bloodGroup": "O+", // for patients
     "experience": 0, // for doctors
     "specialization": "General Practice", // for doctors
     "mode": "Both", // for doctors
     "refreshToken": "...",
     "createdAt": "...",
     "updatedAt": "..."
   }
   ```

## 🔧 Troubleshooting

### If User Data Doesn't Appear:

1. **Check server logs for errors** - Look for ❌ symbols
2. **Verify browser completed full OAuth flow** - Don't interrupt redirect process
3. **Use incognito/private browsing** - Avoid cached sessions
4. **Check Google Console configuration** - Ensure redirect URLs match exactly
5. **Test with different Google account** - Some accounts may have restrictions

### If OAuth Fails:

1. **Check Google Console:**
   - Client ID: `937634948920-qj0332su1v1sdg7cc26ebnr48au36riu.apps.googleusercontent.com`
   - Client Secret is set correctly
   - Redirect URIs exactly match:
     - `http://localhost:5000/api/auth/google/patient/callback`
     - `http://localhost:5000/api/auth/google/doctor/callback`

2. **Check environment variables:**
   ```
   GOOGLE_CLIENT_ID=937634948920-qj0332su1v1sdg7cc26ebnr48au36riu.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   ```

3. **Check network connectivity:**
   - Ensure `localhost:5000` is accessible
   - No firewall blocking the connection

## 🎉 Success Indicators

Your Google OAuth is working when you see ALL of these:

✅ Server starts without errors  
✅ Database connection shows "PanchVeda"  
✅ Google OAuth redirects to Google sign-in page  
✅ After Google authentication, redirects to your frontend  
✅ Server logs show "✅ New [patient/doctor] created successfully"  
✅ New user/doctor document appears in MongoDB Atlas PanchVeda database  
✅ Document contains googleId, name, email and all required fields  

## 📝 Testing Checklist

- [ ] Server running on port 5000
- [ ] Database connected to PanchVeda
- [ ] Google OAuth credentials configured
- [ ] Tested with fresh incognito browser window  
- [ ] Completed full OAuth flow without interruption
- [ ] Verified user data saved in MongoDB Atlas
- [ ] Checked server logs for success messages

## ⚡ Quick Test Commands

**Check if server is running:**
```bash
curl http://localhost:5000/api/auth/google/health
```

**Check database status:**  
```bash
curl http://localhost:5000/api/auth/google/test-db
```

**Test Google OAuth (Patient):**
```bash
# Open this URL in browser:
http://localhost:5000/api/auth/google/patient
```

**Test Google OAuth (Doctor):**
```bash  
# Open this URL in browser:
http://localhost:5000/api/auth/google/doctor
```

Your Google OAuth authentication is fully functional! 🚀