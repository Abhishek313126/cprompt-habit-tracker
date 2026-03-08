# C Prompt Solutions Pvt Ltd — Finance Habit Tracker

Internal habit tracker for the Finance team. Built with Next.js 14 + Tailwind CSS.

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1: Setup
1. Download/extract this project folder
2. Open terminal in this folder
3. Run:
   ```
   npm install
   ```

### Step 2: Test Locally (optional)
```
npm run dev
```
Open: http://localhost:3000

### Step 3: Deploy to Vercel
Option A - Using Vercel CLI:
```
npm install -g vercel
vercel
```

Option B - Using GitHub:
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project
3. Import your repo
4. Click Deploy ✅

---

## 👤 Team UIDs (Finance Team)

| UID       | Role                        |
|-----------|----------------------------|
| CP-FA01   | F&A Executive (Billing)    |
| CP-FA02   | F&A Executive (AR/Collection)|
| CP-FA03   | F&A Executive (Finance)    |
| CP-FA04   | F&A Manager                |
| CP-FM01   | Finance Manager            |
| CP-PR01   | Purchase Executive (PR/AP) |
| CP-ADM1   | Admin / Director           |

> **Note**: UIDs can be changed in `/lib/habitData.js` → `TEAM_MEMBERS` array

---

## 📊 Features

- ✅ **Daily Check-in**: Mark each habit as Done / Partial / Pending / N/A
- 📅 **Reports**: Daily, Weekly, 15-Day, Monthly reports
- 📤 **Export/Download**: Download reports as TXT files
- 🔄 **Data Import**: Admin can collect & merge team data
- 👤 **UID Login**: Each team member has a unique ID
- ⚙️ **Admin Panel**: Director/Admin can see all team performance

---

## 📁 Project Structure

```
cprompt-habit-tracker/
├── app/
│   ├── page.js          ← Login page
│   ├── dashboard/       ← Daily check-in
│   ├── reports/         ← All reports
│   └── admin/           ← Admin overview
├── lib/
│   ├── habitData.js     ← All habits data (edit here to add/remove habits)
│   └── storage.js       ← LocalStorage utilities
└── ...config files
```

---

## ✏️ Customizing Habits

Edit `/lib/habitData.js`:
- **TEAM_MEMBERS**: Change UIDs, names, roles
- **HABITS**: Add/remove/edit habits for each role

---

## ⚠️ Data Storage Note

Currently uses **browser localStorage** — data is stored on each person's browser.

For shared team data:
1. Each member exports their data (Dashboard → Reports → Download)
2. Admin imports/merges all files in Admin Panel

**To upgrade to shared database**: 
Connect Supabase or Firebase to the storage functions in `/lib/storage.js`

---

© 2025 C Prompt Solutions Pvt Ltd — Internal Use Only
