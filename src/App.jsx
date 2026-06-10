import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Edit2, Trash2, CheckCircle2, Circle, LogOut, Menu, X, ArrowRight, Award, BookOpen, Clock, Target, TrendingUp } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE || '';

const DEFAULT_ROADMAP_PHASES = [
  { id: 0, title: 'PHASE 0: You Are Here', timeRange: 'Right now', salary: 'INR 2.5-4 LPA', topics: ['Desktop support', 'Basic networking', 'Troubleshooting'], color: '#2563EB', status: 'active', detail: 'Build troubleshooting confidence with desktop, OS, cabling, ticketing, and basic network checks.' },
  { id: 1, title: 'PHASE 1: CCNA & Networking Fundamentals', timeRange: 'Month 1-12', salary: 'INR 7-12 LPA', topics: ['OSI Model', 'TCP/IP', 'Subnetting', 'Routing', 'Switching', 'VLANs', 'ACLs'], color: '#0891B2', status: 'active', detail: 'Strong base for routing, switching, IP addressing, labs, and CCNA 200-301 preparation.' },
  { id: 2, title: 'PHASE 2: Server + AD + Linux', timeRange: 'Month 6-18', salary: 'INR 8-15 LPA', topics: ['Windows Server', 'Active Directory', 'DNS/DHCP', 'Linux Admin', 'Storage', 'Backup'], color: '#059669', status: 'planned', detail: 'Move from support to infra operations with server administration and identity management.' },
  { id: 3, title: 'PHASE 3: Automation + DevNet', timeRange: 'Month 12-24', salary: 'INR 12-20 LPA', topics: ['Python', 'REST APIs', 'Ansible', 'Git', 'JSON/YAML', 'DevNet'], color: '#7C3AED', status: 'planned', detail: 'Automate repeat work and connect networking with modern tooling and APIs.' },
  { id: 4, title: 'PHASE 4: CCNP + Advanced Routing', timeRange: 'Month 18-30', salary: 'INR 15-25 LPA', topics: ['OSPF Advanced', 'BGP', 'MPLS', 'QoS', 'HA Design', 'Troubleshooting'], color: '#4F46E5', status: 'planned', detail: 'Professional-level routing, switching, design, and deep enterprise troubleshooting.' },
  { id: 5, title: 'PHASE 5: Cloud Networking + Security', timeRange: 'Month 20+', salary: 'INR 20-35 LPA', topics: ['AWS VPC', 'Azure VNet', 'VPN', 'Firewalls', 'Zero Trust', 'SD-WAN'], color: '#D97706', status: 'planned', detail: 'Combine network engineering with cloud connectivity and practical cyber security.' },
  { id: 6, title: 'PHASE 6: Senior Network Architect', timeRange: 'Year 3+', salary: 'INR 35-80+ LPA', topics: ['Architecture', 'Leadership', 'Cost Planning', 'Security Design', 'Multi-cloud'], color: '#DC2626', status: 'planned', detail: 'Own architecture, standards, migration planning, and senior-level business impact.' }
];

const DEFAULT_USERS = [
  { id: 1, email: 'ak1001@gmail.com', loginId: 'AK1001', password: '100123', name: 'Master Admin', role: 'master-admin' },
  { id: 2, email: 'aksai1001@gmail.com', loginId: 'AK1002', password: '100123', name: 'Admin User', role: 'admin' }
];

const normalizePhase = (phase, index = 0) => ({
  id: phase.id ?? Date.now() + index,
  title: phase.title || `PHASE ${index}: New Phase`,
  timeRange: phase.timeRange || phase.time || 'Timeline pending',
  salary: phase.salary || 'Salary range pending',
  topics: Array.isArray(phase.topics)
    ? phase.topics
    : String(phase.topics || '').split(',').map((topic) => topic.trim()).filter(Boolean),
  color: phase.color || '#2563EB',
  status: phase.status || 'planned',
  detail: phase.detail || 'Admin can edit this phase information from roadmap management.'
});

const toPhasePayload = (phase) => ({
  title: phase.title,
  timeRange: phase.timeRange,
  salary: phase.salary,
  topics: Array.isArray(phase.topics) ? phase.topics.join(',') : phase.topics,
  color: phase.color,
  status: phase.status
});

const apiRequest = async (path, options = {}) => {
  if (!API_BASE) {
    throw new Error('Static mode: backend API is disabled');
  }

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Request failed');
  }
  return data;
};

const getSavedUsers = () => {
  const saved = localStorage.getItem('credentials');
  if (!saved) return DEFAULT_USERS;

  try {
    const users = JSON.parse(saved).map((user) => ({
      ...user,
      email: user.email?.trim().toLowerCase(),
    }));

    const merged = [...users];
    DEFAULT_USERS.forEach((defaultUser) => {
      if (!merged.some((user) => user.role === defaultUser.role)) {
        merged.push(defaultUser);
      }
    });

    return merged;
  } catch {
    return DEFAULT_USERS;
  }
};

const saveUsers = (users) => {
  localStorage.setItem('credentials', JSON.stringify(users));
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('currentPage') || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roadmapPhases, setRoadmapPhases] = useState(() => {
    const saved = localStorage.getItem('roadmapPhases');
    if (!saved) return DEFAULT_ROADMAP_PHASES;
    try {
      return JSON.parse(saved).map(normalizePhase);
    } catch {
      return DEFAULT_ROADMAP_PHASES;
    }
  });
  const [users, setUsers] = useState(() => getSavedUsers());
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('roadmapPhases', JSON.stringify(roadmapPhases));
  }, [roadmapPhases]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const [serverPhases, serverUsers] = await Promise.all([
          apiRequest('/phases'),
          apiRequest('/users')
        ]);
        if (Array.isArray(serverPhases) && serverPhases.length) {
          setRoadmapPhases(serverPhases.map(normalizePhase));
        }
        if (Array.isArray(serverUsers) && serverUsers.length) {
          setUsers(serverUsers);
          saveUsers(serverUsers);
        }
      } catch {
        // Keep the app usable when the Java backend is not running.
      }
    };

    if (isLoggedIn) {
      loadServerData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={(userData) => {
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(userData));
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'token_' + Date.now());
      }
      setCurrentPage(userData.role === 'admin' || userData.role === 'master-admin' ? 'admin' : 'dashboard');
    }} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900 md:flex">
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-950/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        user={user} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="h-screen min-w-0 flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300">
        <div className="sticky top-0 z-30 flex items-center justify-between bg-black p-5 shadow-sm border-b border-slate-200 md:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Networking Roadmap</p>
            <h1 className="font-bold text-lg">Dashboard</h1>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {currentPage === 'dashboard' && <Dashboard user={user} tasks={tasks} roadmapPhases={roadmapPhases} setCurrentPage={setCurrentPage} />}
        {currentPage === 'roadmap' && <RoadmapPage phases={roadmapPhases} user={user} setCurrentPage={setCurrentPage} />}
        {currentPage === 'tasks' && <TaskManagement user={user} tasks={tasks} setTasks={setTasks} />}
        {currentPage === 'admin' && (user?.role === 'admin' || user?.role === 'master-admin') && <AdminPanel user={user} setCurrentPage={setCurrentPage} />}
        {currentPage === 'toc' && user?.role === 'master-admin' && <RoadmapEditor phases={roadmapPhases} setPhases={setRoadmapPhases} />}
        {currentPage === 'credentials' && user?.role === 'master-admin' && <CredentialManagement credentials={users} setCredentials={setUsers} />}
        <AppFooter />
      </main>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginPayload = identifier.includes('@')
        ? { email: identifier.trim().toLowerCase(), password }
        : { loginId: identifier.trim().toUpperCase(), password };
      const loggedInUser = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginPayload)
      });
      localStorage.setItem('token', loggedInUser.token);
      onLogin(loggedInUser);
    } catch {
      const users = getSavedUsers();
      const matchedUser = users.find(
        (user) => (
          user.email?.toLowerCase() === identifier.trim().toLowerCase()
          || user.loginId?.toUpperCase() === identifier.trim().toUpperCase()
        ) && user.password === password
      );

      if (!identifier.trim() || !password) {
        setError('Please enter login ID/email and password.');
      } else if (matchedUser) {
        onLogin(matchedUser);
      } else {
        setError('Invalid login ID/email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 opacity-95" />
      <div className="absolute -top-16 left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute top-24 right-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-900/90 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="inline-flex rounded-full bg-violet-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
              Secure Login
            </p>
            <h1 className="mt-6 text-4xl font-bold text-white">Welcome Back</h1>
            <p className="mt-4 text-slate-400">
              Enter your credentials to access the admin dashboard. No login hints are shown publicly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-sm text-slate-300">Login ID or email</span>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Enter login ID or email"
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </label>

            <label className="block relative">
              <span className="text-sm text-slate-300">Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-[3.35rem] text-slate-400 transition hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            {error && (
              <div className="rounded-3xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full justify-center rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm text-slate-400">
            New users receive a generated login ID from the master admin. Use that ID or your email to sign in.
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ user, currentPage, setCurrentPage, onLogout, isOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'roadmap', label: '🗺️ Full Roadmap', icon: '🗺️' },
    { id: 'tasks', label: '✅ My Tasks', icon: '✅' },
    ...(user?.role === 'admin' || user?.role === 'master-admin' ? [{ id: 'admin', label: user?.role === 'master-admin' ? '👑 Master Control' : '🛠️ Admin Panel', icon: '🛠️' }] : []),
    ...(user?.role === 'master-admin' ? [{ id: 'toc', label: '📝 TOC Management', icon: '📝' }] : []),
    ...(user?.role === 'master-admin' ? [{ id: 'credentials', label: '🔒 Credentials', icon: '🔒' }] : []),
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[min(20rem,85vw)] flex-col overflow-hidden bg-gradient-to-b from-purple-700 to-blue-700 text-white shadow-lg transition-transform duration-300 md:sticky md:top-0 md:w-64 md:shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="relative p-4 border-b border-purple-600">
        <div className="text-2xl font-bold">{isOpen ? '🚀 NR' : '🚀'}</div>
        {isOpen && <p className="text-xs opacity-75 mt-1">Networking Roadmap</p>}
        {isOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
                document.querySelector('main')?.scrollIntoView();
              }
            }}
            className={`w-full min-w-0 text-left px-4 py-3 rounded-lg transition ${
              currentPage === item.id
                ? 'bg-white text-purple-700 font-semibold'
                : 'hover:bg-purple-600'
            }`}
          >
            <span className="block truncate text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-purple-600">
        {isOpen && (
          <div className="text-sm mb-3">
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-xs opacity-75">{user?.role === 'master-admin' ? '👑 Master Admin' : user?.role === 'admin' ? '👑 Admin' : '👤 User'}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <LogOut size={18} />
          {isOpen && 'Logout'}
        </button>
      </div>
    </div>
  );
};

const AdminPanel = ({ user, setCurrentPage }) => {
  const isMaster = user?.role === 'master-admin';
  const newsItems = [
    {
      title: 'Cloud-native networking trends',
      source: 'NetSphere',
      time: '5m ago',
      url: 'https://www.networkworld.com/article/3757057/cloud-native-networking-trends.html'
    },
    {
      title: 'AWS launches new network security toolkit',
      source: 'CloudPulse',
      time: '12m ago',
      url: 'https://aws.amazon.com/blogs/security/aws-network-security-toolkit/'
    },
    {
      title: 'Cisco updates CCNA roadmap for 2026',
      source: 'NetworkDaily',
      time: '25m ago',
      url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html'
    },
    {
      title: 'Kubernetes networking best practices',
      source: 'DevNet',
      time: '38m ago',
      url: 'https://developer.ibm.com/articles/kubernetes-networking-best-practices/'
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 text-white p-5 sm:p-8 shadow-2xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold break-words">{isMaster ? 'Master Admin Control' : 'Admin Panel'}</h1>
          <p className="mt-3 text-lg opacity-90">
            {isMaster
              ? 'Full master access for credential and roadmap management.'
              : 'Admin panel for task completion and networking updates.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isMaster ? (
            <>
              <div className="group bg-white rounded-3xl shadow-2xl p-6 border border-transparent hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl">📝</div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">TOC Management</h2>
                <p className="mt-2 text-slate-600">Create, update, and remove roadmap phases with ease.</p>
                <button
                  onClick={() => setCurrentPage('toc')}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold transition hover:scale-105"
                >
                  Open TOC
                </button>
              </div>

              <div className="group bg-white rounded-3xl shadow-2xl p-6 border border-transparent hover:border-fuchsia-200 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl">🔒</div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">Credential Control</h2>
                <p className="mt-2 text-slate-600">Add or remove admin and user credentials securely.</p>
                <button
                  onClick={() => setCurrentPage('credentials')}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold transition hover:scale-105"
                >
                  Manage Credentials
                </button>
              </div>
            </>
          ) : (
            <div className="group col-span-1 bg-white rounded-3xl shadow-2xl p-6 border border-transparent hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl">✅</div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">Admin Overview</h2>
              <p className="mt-2 text-slate-600">Mark tasks done, monitor progress, and keep the roadmap moving.</p>
              <button
                onClick={() => setCurrentPage('tasks')}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold transition hover:scale-105"
              >
                Go to Tasks
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 rounded-3xl bg-slate-950/95 p-5 sm:p-6 shadow-2xl shadow-slate-900/40 border border-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Live Networking & Cloud News</h2>
              <p className="mt-2 text-slate-400">Updated continuously with the latest networking and cloud industry headlines.</p>
            </div>
            <span className="inline-flex rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200">Live Feed</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {newsItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl bg-slate-900/90 border border-white/10 p-5 transition hover:border-blue-400 hover:bg-slate-800/95 hover:shadow-xl"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-100">{item.title}</h3>
                  <span className="shrink-0 text-xs text-slate-400 group-hover:text-slate-200">{item.time}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">Source: {item.source}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user, tasks, roadmapPhases, setCurrentPage }) => {
  const phases = (roadmapPhases && roadmapPhases.length ? roadmapPhases : DEFAULT_ROADMAP_PHASES).map(normalizePhase);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = Math.max(totalTasks - completedTasks, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const currentPhase = phases.find((phase) => phase.status === 'active') || phases[0];
  const nextPhases = phases.slice(1, 4);
  const upcomingMilestones = [
    { label: 'Core networking', value: 'OSI, TCP/IP, subnetting' },
    { label: 'Hands-on labs', value: 'Packet Tracer and routing' },
    { label: 'Certification focus', value: 'CCNA 200-301' }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-xl space-y-6">
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 px-5 py-3 sm:px-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">Networking Roadmap</p>
          </div>
          <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Welcome back, {user?.name || 'Learner'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Track tasks, review your current phase, and keep the L1 to Senior Architect journey moving with clear priorities.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Structured path', 'Career-ready skills', 'Progress tracking'].map((item) => (
                  <span key={item} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setCurrentPage('tasks')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <CheckCircle2 size={18} /> Manage Tasks
              </button>
              <button
                onClick={() => setCurrentPage('roadmap')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-white"
              >
                View Roadmap <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardMetric icon={<Target size={20} />} label="Current Phase" value={currentPhase.title.split(':')[0] || 'Active'} detail={currentPhase.title.includes(':') ? currentPhase.title.split(':').slice(1).join(':').trim() : currentPhase.title} accent="bg-blue-50 text-blue-700" />
          <DashboardMetric icon={<CheckCircle2 size={20} />} label="Completed Tasks" value={`${completedTasks}/${totalTasks}`} detail={`${pendingTasks} pending`} accent="bg-emerald-50 text-emerald-700" />
          <DashboardMetric icon={<TrendingUp size={20} />} label="Progress" value={`${progressPercent}%`} detail="Task completion rate" accent="bg-violet-50 text-violet-700" />
          <DashboardMetric icon={<Award size={20} />} label="Target Range" value={currentPhase.salary} detail="Current milestone" accent="bg-amber-50 text-amber-700" />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Learning Progress</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">Roadmap execution overview</h2>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                <Circle size={10} fill="currentColor" /> Active
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-bold text-slate-950">{progressPercent}%</p>
                  <p className="mt-1 text-sm text-slate-500">{completedTasks} of {totalTasks} tasks completed</p>
                </div>
                <p className="text-right text-sm font-medium text-slate-500">Next focus: CCNA fundamentals</p>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {upcomingMilestones.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Current Milestone</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{currentPhase.title}</h2>
            <div className="mt-5 space-y-4">
              <InfoRow icon={<Clock size={18} />} label="Timeline" value={currentPhase.timeRange} />
              <InfoRow icon={<Award size={18} />} label="Salary Range" value={currentPhase.salary} />
              <InfoRow icon={<BookOpen size={18} />} label="Skills" value={currentPhase.topics.slice(0, 3).join(', ')} />
            </div>
            <button
              onClick={() => setCurrentPage('roadmap')}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Open full roadmap <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Roadmap Preview</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">Next phases to prepare for</h2>
            </div>
            <button
              onClick={() => setCurrentPage('roadmap')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              See all phases <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {nextPhases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setCurrentPage('roadmap')}
                className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-cyan-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:from-white hover:to-emerald-50 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">Phase {phase.id}</span>
                  <ArrowRight size={18} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-950">{phase.title.replace(`PHASE ${phase.id}: `, '')}</h3>
                <p className="mt-2 text-sm text-slate-500">{phase.timeRange} / {phase.salary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {phase.topics.slice(0, 3).map((topic) => (
                    <span key={topic} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      {topic}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const DashboardMetric = ({ icon, label, value, detail, accent }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
    </div>
    <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-slate-950 break-words">{value}</p>
    <p className="mt-1 text-sm text-slate-500 break-words">{detail}</p>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-950 break-words">{value}</p>
    </div>
  </div>
);
const RoadmapPage = ({ phases: roadmapPhases, user, setCurrentPage }) => {
  const unusedDefaultPhases = [
    {
      id: 0,
      title: 'PHASE 0: You Are Here',
      time: 'Right now',
      salary: '₹2.5–4 LPA',
      topics: ['Desktop support', 'Basic networking', 'Troubleshooting'],
      detail: 'Starting point — get hands dirty with hardware & OS basics',
      color: '#FF6B35',
      emoji: '📍'
    },
    {
      id: 1,
      title: 'PHASE 1: CCNA & Networking',
      time: 'Month 1–12',
      salary: '₹7–12 LPA',
      topics: ['OSI Model', 'Routing', 'Switching', 'VLANs', 'ACLs'],
      detail: 'Foundation certification covering all networking fundamentals',
      color: '#3B82F6',
      emoji: '🔷'
    },
    {
      id: 2,
      title: 'PHASE 2: Server + AD + Linux',
      time: 'Month 6–18',
      salary: '₹8–15 LPA',
      topics: ['Windows Server', 'Active Directory', 'Linux Admin', 'Storage'],
      detail: 'Server administration across Windows & Linux environments',
      color: '#10B981',
      emoji: '🟢'
    },
    {
      id: 3,
      title: 'PHASE 3: Automation + DevNet',
      time: 'Month 12–24',
      salary: '₹12–20 LPA',
      topics: ['Python', 'APIs', 'Ansible', 'Git', 'DevNet Cert'],
      detail: 'Automate network tasks and CI/CD pipelines',
      color: '#EC4899',
      emoji: '🟣'
    },
    {
      id: 4,
      title: 'PHASE 4: CCNP + Advanced',
      time: 'Month 18–30',
      salary: '₹15–25 LPA',
      topics: ['OSPF Advanced', 'BGP', 'MPLS', 'Security'],
      detail: 'Professional-level routing, switching, and network design',
      color: '#8B5CF6',
      emoji: '🔵'
    },
    {
      id: 5,
      title: 'PHASE 5: Cloud + Cybersecurity',
      time: 'Month 20+',
      salary: '₹20–35 LPA',
      topics: ['AWS', 'Azure', 'Security+', 'SD-WAN'],
      detail: 'Multi-cloud networking and enterprise security posture',
      color: '#F59E0B',
      emoji: '🌟'
    },
    {
      id: 6,
      title: 'PHASE 6: Senior Architect',
      time: 'Year 3+',
      salary: '₹35–80+ LPA',
      topics: ['Network Architect', 'Cloud Architect', 'Security Architect'],
      detail: 'Design global infra, lead teams, define strategy',
      color: '#EF4444',
      emoji: '👑'
    }
  ];

  const phases = (roadmapPhases && roadmapPhases.length ? roadmapPhases : unusedDefaultPhases).map(normalizePhase);
  const canEdit = user?.role === 'master-admin';

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFF8F0] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Hero Banner */}
        <div className="bg-[#1E1B4B] border-[4px] border-[#F59E0B] rounded-[24px] p-5 sm:p-10 mb-10 shadow-[6px_6px_0px_0px_#F59E0B] sm:shadow-[8px_8px_0px_0px_#F59E0B] text-white text-center">
          <h1 className="text-3xl sm:text-5xl font-black uppercase leading-tight break-words">
            🗺️ COMPLETE <span className="bg-[#F59E0B] text-[#1E1B4B] px-3 py-1">ROADMAP</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-bold text-[#FCD34D]">Every phase. Every skill. Every salary jump.</p>
          <p className="mt-2 text-[#C7D2FE] font-semibold">L1 Helpdesk → ₹80 LPA Senior Architect</p>
          {canEdit && (
            <button
              onClick={() => setCurrentPage('toc')}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#1E1B4B] transition hover:bg-[#FCD34D]"
            >
              <Edit2 size={18} /> Edit Roadmap
            </button>
          )}
        </div>

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="inline-block max-w-full text-2xl sm:text-3xl font-black bg-[#F59E0B] text-[#1E1B4B] px-5 py-2 rounded-[16px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] uppercase break-words">
            ⚡ The Journey
          </h2>
        </div>

        {/* Phase Timeline */}
        <div className="space-y-0">
          {phases.map((phase, idx) => (
            <div key={phase.id} className="flex min-w-0 gap-0">
              {/* Timeline Track */}
              <div className="flex flex-col items-center w-16 sm:w-20 flex-shrink-0">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[4px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center font-black text-xl sm:text-2xl text-white relative"
                  style={{ backgroundColor: phase.color }}
                >
                  {phase.id}
                </div>
                {idx < phases.length - 1 && (
                  <div
                    className="w-[6px] flex-1 min-h-[50px] rounded-full my-1"
                    style={{ backgroundColor: phase.color, opacity: 0.5 }}
                  />
                )}
              </div>

              {/* Phase Card */}
              <div className="min-w-0 flex-1 mb-5 ml-2">
                <div
                  className="bg-white border-[4px] border-black rounded-[20px] p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200"
                  style={{ borderLeftWidth: '8px', borderLeftColor: phase.color }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xl">{phase.emoji}</span>
                        <h2 className="min-w-0 text-lg sm:text-xl font-black text-gray-900 uppercase break-words">{phase.title}</h2>
                      </div>
                      <p className="text-sm font-bold text-gray-500 mt-1 tracking-wide">Timeline: {phase.timeRange}</p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{phase.detail}</p>
                    </div>
                    <span
                      className="inline-flex max-w-full items-center rounded-[12px] px-4 py-2 text-sm font-black text-white border-[3px] border-black shadow-[3px_3px_0px_0px_#000] break-words"
                      style={{ backgroundColor: phase.color }}
                    >
                      💰 {phase.salary}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {phase.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="bg-[#FFF8F0] text-gray-800 px-3 py-1.5 rounded-[10px] text-sm font-bold border-[2px] border-black shadow-[2px_2px_0px_0px_#000]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quote */}
        <div className="mt-10 bg-white border-[4px] border-black rounded-[20px] p-6 shadow-[6px_6px_0px_0px_#000] text-center">
          <p className="text-xl sm:text-2xl font-black text-gray-800">
            "The only way to reach ₹80 LPA is to <span className="text-[#FF6B35]">start at Phase 0</span> and never stop." 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

const TaskManagement = ({ user, tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState(() => {
    const adminEmails = getSavedUsers().filter((u) => u.role === 'admin').map((u) => u.email.trim().toLowerCase());
    return adminEmails[0] || 'unassigned';
  });
  const [filter, setFilter] = useState('all');
  const isAdmin = user?.role === 'admin';
  const isMaster = user?.role === 'master-admin';
  const currentUserEmail = user?.email?.trim().toLowerCase();

  const normalizedTasks = tasks.map((t) => ({
    id: t.id,
    text: t.text,
    completed: !!t.completed,
    createdAt: t.createdAt || new Date().toLocaleDateString(),
    assignedTo: t.assignedTo ? t.assignedTo.trim().toLowerCase() : 'unassigned',
    createdBy: t.createdBy ? t.createdBy.trim().toLowerCase() : ''
  }));

  const addTask = () => {
    if (isMaster && newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
        assignedTo: assignedTo || 'unassigned',
        createdBy: currentUserEmail || 'master-admin'
      };
      const updated = [...normalizedTasks, task];
      setTasks(updated);
      localStorage.setItem('tasks', JSON.stringify(updated));
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    const updated = normalizedTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const deleteTask = (id) => {
    if (!isAdmin) {
      const updated = normalizedTasks.filter(t => t.id !== id);
      setTasks(updated);
      localStorage.setItem('tasks', JSON.stringify(updated));
    }
  };

  const visibleTasks = isMaster
    ? normalizedTasks
    : isAdmin
      ? normalizedTasks.filter((t) => t.assignedTo === currentUserEmail)
      : normalizedTasks;

  const filteredTasks = filter === 'completed' ? visibleTasks.filter(t => t.completed) :
    filter === 'pending' ? visibleTasks.filter(t => !t.completed) : visibleTasks;

  const taskSummaryTasks = isMaster ? normalizedTasks : visibleTasks;
  const totalTasks = taskSummaryTasks.length;
  const completedTasks = taskSummaryTasks.filter((t) => t.completed).length;
  const pendingTasks = taskSummaryTasks.filter((t) => !t.completed).length;
  const assignedCount = isMaster ? normalizedTasks.filter((t) => t.assignedTo !== 'unassigned').length : totalTasks;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 break-words">
          {isMaster ? '📝 Master Task Assignment' : '✅ Task Completion'}
        </h1>
        <p className="text-gray-600 mb-6">
          {isMaster
            ? 'Assign tasks to admin users by email. This panel shows team task status and completion updates.'
            : 'Complete tasks assigned to your email and keep the roadmap moving.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total tasks</p>
            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
          </div>
          {isMaster && (
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Assigned tasks</p>
              <p className="text-2xl font-bold text-blue-600">{assignedCount}</p>
            </div>
          )}
        </div>

        {isMaster && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="grid gap-4 sm:grid-cols-[1.7fr_1fr]">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Assign a new task (e.g., Review CCIE routing design)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col gap-3">
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getSavedUsers().filter((u) => u.role === 'admin').map((admin) => (
                    <option key={admin.email} value={admin.email}>
                      {admin.email}
                    </option>
                  ))}
                  <option value="unassigned">Unassigned</option>
                </select>
                <button
                  onClick={addTask}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Assign Task
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({filteredTasks.length})
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No tasks here! Create one to get started. 🚀</p>
            </div>
          ) : (
            <table className="min-w-[760px] w-full text-left divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Task</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Assigned To</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Created By</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className={task.completed ? 'bg-slate-50' : ''}>
                    <td className="px-4 py-4 text-sm text-gray-800">{task.text}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {task.assignedTo === 'unassigned' ? 'Unassigned' : task.assignedTo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {task.createdBy === currentUserEmail ? 'You' : task.createdBy || 'Master'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.createdAt}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right space-x-2">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {task.completed ? 'Mark pending' : 'Mark done'}
                      </button>
                      {!isAdmin && (
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const TOCManagement = () => {
  const [toc, setToc] = useState(() => {
    const saved = localStorage.getItem('toc');
    return saved ? JSON.parse(saved) : [
      { id: 1, phase: 'Phase 1', title: 'CCNA Fundamentals', topics: 5, status: 'active' },
      { id: 2, phase: 'Phase 2', title: 'Server Management', topics: 4, status: 'active' },
    ];
  });

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ phase: '', title: '', topics: 0, status: 'active' });

  const addTOC = () => {
    if (formData.title.trim()) {
      const newItem = {
        id: Date.now(),
        ...formData,
        topics: parseInt(formData.topics) || 0
      };
      const updated = [...toc, newItem];
      setToc(updated);
      localStorage.setItem('toc', JSON.stringify(updated));
      setFormData({ phase: '', title: '', topics: 0, status: 'active' });
    }
  };

  const updateTOC = (id) => {
    const updated = toc.map(item => item.id === id ? { ...item, ...formData } : item);
    setToc(updated);
    localStorage.setItem('toc', JSON.stringify(updated));
    setEditingId(null);
    setFormData({ phase: '', title: '', topics: 0, status: 'active' });
  };

  const deleteTOC = (id) => {
    const updated = toc.filter(item => item.id !== id);
    setToc(updated);
    localStorage.setItem('toc', JSON.stringify(updated));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({ phase: item.phase, title: item.title, topics: item.topics, status: item.status });
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-words">📝 TOC Management</h1>
        <p className="text-gray-600 mb-8">👑 Admin only - Manage roadmap phases and topics</p>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Edit Phase' : 'Add New Phase'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Phase (e.g., Phase 1)"
              value={formData.phase}
              onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Number of Topics"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            onClick={editingId ? () => updateTOC(editingId) : addTOC}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
          >
            {editingId ? 'Update Phase' : 'Add Phase'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ phase: '', title: '', topics: 0, status: 'active' });
              }}
              className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="space-y-4">
          {toc.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-800">{item.phase}</h3>
                  <p className="text-gray-600 break-words">{item.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {item.topics} topics
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' :
                      item.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => deleteTOC(item.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RoadmapEditor = ({ phases, setPhases }) => {
  const phaseList = (phases && phases.length ? phases : DEFAULT_ROADMAP_PHASES).map(normalizePhase);
  const emptyForm = { title: '', timeRange: '', salary: '', topics: '', color: '#2563EB', status: 'planned', detail: '' };
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const saveToServer = async (phase, method, path) => {
    try {
      return await apiRequest(path, {
        method,
        body: JSON.stringify(toPhasePayload(phase))
      });
    } catch {
      return phase;
    }
  };

  const addPhase = async () => {
    if (!formData.title.trim()) {
      setMessage('Please enter a phase title.');
      return;
    }

    const draft = normalizePhase({ ...formData, id: Date.now(), topics: formData.topics }, phaseList.length);
    const saved = normalizePhase(await saveToServer(draft, 'POST', '/phases'));
    setPhases([...phaseList, saved]);
    setMessage('Roadmap phase added. Dashboard updated automatically.');
    resetForm();
  };

  const updatePhase = async (id) => {
    const draft = normalizePhase({ ...formData, id, topics: formData.topics });
    const saved = normalizePhase(await saveToServer(draft, 'PUT', `/phases/${id}`));
    setPhases(phaseList.map((phase) => phase.id === id ? saved : phase));
    setMessage('Roadmap phase updated. Dashboard updated automatically.');
    resetForm();
  };

  const deletePhase = async (id) => {
    try {
      await apiRequest(`/phases/${id}`, { method: 'DELETE' });
    } catch {
      // Local fallback keeps the UI responsive if backend is offline.
    }
    setPhases(phaseList.filter((phase) => phase.id !== id));
    setMessage('Roadmap phase removed.');
  };

  const startEdit = (phase) => {
    const item = normalizePhase(phase);
    setEditingId(item.id);
    setFormData({
      title: item.title,
      timeRange: item.timeRange,
      salary: item.salary,
      topics: item.topics.join(', '),
      color: item.color,
      status: item.status,
      detail: item.detail
    });
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="mb-8 rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase text-cyan-200">Master Admin</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold">Roadmap Information Editor</h1>
          <p className="mt-2 text-slate-300">Edit important roadmap information once. Dashboard and full roadmap update automatically.</p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">{editingId ? 'Edit Phase' : 'Add New Phase'}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Timeline" value={formData.timeRange} onChange={(e) => setFormData({ ...formData, timeRange: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Salary range" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Topics comma separated" value={formData.topics} onChange={(e) => setFormData({ ...formData, topics: e.target.value })} />
            <select className="rounded-lg border border-slate-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
            </select>
            <input className="h-11 rounded-lg border border-slate-300 bg-white px-2" type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
            <textarea className="min-h-24 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" placeholder="Important details for this phase" value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button onClick={editingId ? () => updatePhase(editingId) : addPhase} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700">
              <CheckCircle2 size={18} /> {editingId ? 'Save Changes' : 'Add Phase'}
            </button>
            {editingId && (
              <button onClick={resetForm} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50">
                Cancel
              </button>
            )}
          </div>
          {message && <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p>}
        </div>

        <div className="grid gap-4">
          {phaseList.map((phase) => (
            <div key={phase.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 h-2 w-24 rounded-full" style={{ backgroundColor: phase.color }} />
                  <h3 className="text-lg font-bold text-slate-950 break-words">{phase.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{phase.timeRange} | {phase.salary} | {phase.status}</p>
                  <p className="mt-2 text-sm text-slate-500 break-words">{phase.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phase.topics.map((topic) => (
                      <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{topic}</span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => startEdit(phase)} className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200" aria-label="Edit roadmap phase">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => deletePhase(phase.id)} className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200" aria-label="Delete roadmap phase">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CredentialManagement = ({ credentials, setCredentials }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'user' });
  const [message, setMessage] = useState('');

  const addCredential = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      setMessage('Please provide email, name, and password.');
      return;
    }
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    const exists = credentials.some(
      (item) => item.email.toLowerCase() === formData.email.toLowerCase()
    );
    if (exists) {
      setMessage('This email is already registered.');
      return;
    }

    let createdUser;
    try {
      createdUser = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role
        })
      });
    } catch {
      createdUser = {
        id: Date.now(),
        email: formData.email.trim().toLowerCase(),
        loginId: `NR${Math.floor(1000 + Math.random() * 9000)}`,
        password: formData.password,
        name: formData.name,
        role: formData.role
      };
    }

    const updated = [...credentials, createdUser];
    setCredentials(updated);
    saveUsers(updated);
    setFormData({ email: '', password: '', name: '', role: 'user' });
    setMessage(`Credential added successfully. Login ID: ${createdUser.loginId || 'Generated in MySQL'}`);
  };

  const deleteCredential = async (id) => {
    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' });
    } catch {
      // Local fallback below.
    }
    const updated = credentials.filter((item) => item.id !== id);
    setCredentials(updated);
    saveUsers(updated);
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-screen-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-words">🔒 Credential Management</h1>
        <p className="text-gray-600 mb-8">Master Admin can add or remove login accounts here.</p>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Credential</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="master-admin">Master Admin</option>
            </select>
          </div>

          <button
            onClick={addCredential}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Add Credential
          </button>
          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        </div>

        <div className="space-y-4">
          {credentials.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 break-all">{item.email}</p>
                <p className="text-sm font-semibold text-blue-700">Login ID: {item.loginId || 'Not generated yet'}</p>
                <p className="text-sm text-gray-500">Role: {item.role}</p>
              </div>
              <button
                onClick={() => deleteCredential(item.id)}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppFooter = () => (
  <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-sm text-slate-500">
    <span className="font-semibold text-slate-700">Networking Roadmap Platform</span>
    <span className="mx-2 text-slate-300">|</span>
    Developed by <span className="font-semibold text-slate-800">AK Dandwate</span>
  </footer>
);

export default App;
