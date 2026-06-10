# 🚀 Networking Roadmap App - Setup Instructions

## Quick Start (2 Ways)

### Option 1: Using Create React App (Recommended)

```bash
# 1. Create a new React app
npx create-react-app networking-roadmapSet-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm start


# 2. Go into the folder
cd networking-roadmap

# 3. Install Lucide React icons
npm install lucide-react

# 4. Replace src/App.jsx with the provided NetworkingRoadmapApp.jsx file
# Copy the entire content of NetworkingRoadmapApp.jsx into src/App.jsx

# 5. Start the app
npm start
```

The app will open at `http://localhost:3000`

---

### Option 2: Using Vite (Faster)

```bash
# 1. Create project
npm create vite@latest networking-roadmap -- --template react

# 2. Install dependencies
cd networking-roadmap
npm install
npm install lucide-react

# 3. Replace src/App.jsx with NetworkingRoadmapApp.jsx content

# 4. Start dev server
npm run dev
```

---

## Features Overview

### 🔐 **Login System**
- **Admin Account:** 
  - Email: `admin@networking.com`
  - Password: `admin123`
  - Unlock: TOC Management feature

- **User Account:** 
  - Any email + password (6+ characters)
  - Access: Dashboard, Roadmap, Tasks

---

### 📊 **Dashboard**
- Welcome message personalized to your name
- Your progress bar (tasks completed %)
- Current phase, certification, and salary info
- Quick links to YouTube channels and free resources

---

### 🗺️ **Full Roadmap**
- All 7 phases displayed visually
- Timeline, salary, and topics for each phase
- Color-coded progression
- Click-friendly design

---

### ✅ **Task Management**
- Add tasks (study goals, certifications, etc.)
- Mark tasks as complete/incomplete
- Delete tasks
- Filter by: All, Pending, Completed
- Auto-saves to browser storage

**Example Tasks:**
- Watch NetworkChuck CCNA videos
- Complete Packet Tracer lab exercises
- Practice subnetting calculations
- Schedule CCNA exam

---

### 📝 **TOC Management (Admin Only)**
- **C**reate new phases
- **R**ead all phases
- **U**pdate phase details
- **D**elete phases (CRUD operations)

Admin can edit:
- Phase name (e.g., "Phase 1")
- Title (e.g., "CCNA & Networking Fundamentals")
- Number of topics
- Status (Active/Planned/Completed)

---

### 🔄 **Data Persistence**
- All data saved to browser's LocalStorage
- Data persists between page refreshes
- No backend/database needed
- Private to your browser

---

## Customization Options

### Add More Certifications
Edit the Dashboard StatCard component to add new certificates:

```jsx
<StatCard icon="🏆" label="Next Cert" value="DevNet Associate" color="green" />
```

### Change Colors
Update the gradient colors in Tailwind classes:
- `from-blue-500` → change color
- `to-purple-600` → change secondary color

### Add New Phases
Go to RoadmapPage component and add to phases array:

```javascript
{
  id: 7,
  title: 'PHASE 7: Advanced Specialization',
  time: 'Year 4+',
  salary: '₹50–100+ LPA',
  topics: ['Machine Learning Networking', 'AI Network Ops'],
  color: 'pink'
}
```

### Change Demo Credentials
In LoginPage component, modify:

```javascript
if (email === 'YOUR_EMAIL@domain.com' && password === 'YOUR_PASSWORD') {
  // Admin login logic
}
```

---

## Build for Production

```bash
# Create optimized build
npm run build

# This creates a 'build' folder with all optimized files
```

---

## Deployment Options

### 1. **Vercel (Free, Easiest)**
```bash
npm install -g vercel
vercel
# Follow prompts, auto-deploys from GitHub
```

### 2. **Netlify**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

### 3. **GitHub Pages**
```bash
npm install gh-pages --save-dev
# Update package.json:
# "homepage": "https://yourusername.github.io/networking-roadmap"
npm run build
npm run deploy
```

---

## File Structure

```
networking-roadmap/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          (Main app file - use NetworkingRoadmapApp.jsx)
│   ├── index.css        (Optional styling)
│   └── index.js
├── package.json
└── README.md
```

---

## Troubleshooting

### "lucide-react not found"
```bash
npm install lucide-react
```

### Port 3000 already in use
```bash
npm start -- --port 3001
# Or kill the process using port 3000
```

### LocalStorage not working
- Check if browser allows localStorage
- Try incognito/private mode
- Check browser console for errors (F12)

### Sidebar disappears on mobile
- The sidebar collapses on smaller screens
- Click the menu icon to toggle it
- Use responsive design (already built-in)

---

## Features Coming Soon (Optional Enhancements)

- 📱 Mobile app version
- 🌐 Backend API integration
- 👥 Multi-user support
- 📊 Progress charts
- 🎯 Goal setting
- 📧 Email reminders
- 🎥 Video embedding
- 💬 Discussion forum
- 📚 Resource library

---

## Support & Updates

**Need help?** Check:
1. Browser console (F12) for error messages
2. Ensure Node.js is installed (`node --version`)
3. Clear cache and reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## License

Free to use and modify for personal/educational purposes.

---

## Quick Command Reference

| Action | Command |
|--------|---------|
| Start dev server | `npm start` |
| Build for production | `npm run build` |
| Install dependencies | `npm install` |
| Install specific package | `npm install package-name` |
| Update all packages | `npm update` |
| Check outdated packages | `npm outdated` |

---

**Happy Learning! 🚀**

Start with the CCNA phase, stay consistent with 1-2 hours daily, and you'll reach ₹20+ LPA in 18-24 months!

For questions: Check the comments in NetworkingRoadmapApp.jsx or refer to React.js documentation at https://react.dev
