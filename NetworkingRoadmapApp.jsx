import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Edit2, Trash2, CheckCircle2, Circle, LogOut, Menu, X } from 'lucide-react';

const defaultRoadmapPhases = [
  {
    id: 0,
    title: 'PHASE 0: You Are Here',
    time: 'Right now',
    salary: '₹2.5–4 LPA',
    topics: ['Desktop support', 'Basic networking', 'Troubleshooting'],
    color: 'purple',
    status: 'active'
  },
  {
    id: 1,
    title: 'PHASE 1: CCNA & Networking Fundamentals',
    time: 'Month 1–12',
    salary: '₹7–12 LPA',
    topics: ['OSI Model', 'Routing', 'Switching', 'VLANs', 'ACLs'],
    color: 'blue',
    status: 'active'
  },
  {
    id: 2,
    title: 'PHASE 2: Server Management + AD + Linux',
    time: 'Month 6–18',
    salary: '₹8–15 LPA',
    topics: ['Windows Server', 'Active Directory', 'Linux Admin', 'Storage'],
    color: 'green',
    status: 'planned'
  },
  {
    id: 3,
    title: 'PHASE 3: Network Automation + DevNet',
    time: 'Month 12–24',
    salary: '₹12–20 LPA',
    topics: ['Python', 'APIs', 'Ansible', 'Git', 'DevNet Cert'],
    color: 'pink',
    status: 'planned'
  },
  {
    id: 4,
    title: 'PHASE 4: CCNP + Advanced Networking',
    time: 'Month 18–30',
    salary: '₹15–25 LPA',
    topics: ['OSPF Advanced', 'BGP', 'MPLS', 'Security'],
    color: 'blue',
    status: 'planned'
  },
  {
    id: 5,
    title: 'PHASE 5: Cloud + Cybersecurity',
    time: 'Month 20+',
    salary: '₹20–35 LPA',
    topics: ['AWS', 'Azure', 'Security+', 'SD-WAN'],
    color: 'pink',
    status: 'planned'
  },
  {
    id: 6,
    title: 'PHASE 6: Senior Architect',
    time: 'Year 3+',
    salary: '₹35–80+ LPA',
    topics: ['Network Architect', 'Cloud Architect', 'Security Architect'],
    color: 'green',
    status: 'planned'
  }
];

const roadmapColorMap = {
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  pink: 'from-pink-500 to-pink-600'
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [roadmapPhases, setRoadmapPhases] = useState(() => {
    const saved = localStorage.getItem('roadmapPhases');
    return saved ? JSON.parse(saved) : defaultRoadmapPhases;
  });
  const [tasks, setTasksRaw] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const setTasks = (updated) => {
    setTasksRaw(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('roadmapPhases', JSON.stringify(roadmapPhases));
  }, [roadmapPhases]);

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
      localStorage.setItem('token', 'token_' + Date.now());
    }} />;
  }

  return (
    <div className="h-screen bg-gray-100 overflow-hidden md:flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        user={user} 
        currentPage={currentPage} 
        setCurrentPage={(page) => { setCurrentPage(page); setSidebarOpen(false); }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <main className="h-screen min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="sticky top-0 z-30 md:hidden flex items-center justify-between p-4 bg-white shadow">
          <h1 className="font-bold text-lg">Networking Roadmap</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {currentPage === 'dashboard' && <Dashboard user={user} roadmapPhases={roadmapPhases} tasks={tasks} setCurrentPage={setCurrentPage} />}
        {currentPage === 'roadmap' && <RoadmapPage phases={roadmapPhases} />}
        {currentPage === 'tasks' && <TaskManagement user={user} tasks={tasks} setTasks={setTasks} />}
        {currentPage === 'toc' && user?.role === 'admin' && <TOCManagement phases={roadmapPhases} setPhases={setRoadmapPhases} />}
      </main>
    </div>
  );
};

// LOGIN PAGE
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@networking.com' && password === 'admin123') {
        onLogin({
          email: email,
          name: 'Admin User',
          role: 'admin',
          id: 1
        });
      } else if (email && password.length >= 6) {
        onLogin({
          email: email,
          name: email.split('@')[0],
          role: 'user',
          id: Math.random()
        });
      } else {
        setError('Invalid credentials. Demo: admin@networking.com / admin123 OR any email with password 6+ chars');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚀 Networking Roadmap</h1>
          <p className="text-gray-600">L1 to Senior Network Engineer</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="font-semibold text-gray-700 mb-2">Demo Accounts:</p>
          <p className="text-gray-600">👤 Admin: admin@networking.com / admin123</p>
          <p className="text-gray-600">👤 User: any email / password (6+ chars)</p>
        </div>
      </div>
    </div>
  );
};

// SIDEBAR
const Sidebar = ({ user, currentPage, setCurrentPage, onLogout, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'roadmap', label: '🗺️ Full Roadmap', icon: '🗺️' },
    { id: 'tasks', label: '✅ My Tasks', icon: '✅' },
    ...(user?.role === 'admin' ? [{ id: 'toc', label: '📝 TOC Management', icon: '📝' }] : []),
  ];

  return (
    <div className={`w-[min(16rem,85vw)] md:w-64 bg-gradient-to-b from-purple-700 to-blue-700 text-white transition-transform duration-300 
      fixed md:sticky md:top-0 h-screen flex flex-col shadow-lg z-50 md:shrink-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="p-4 border-b border-purple-600">
        <div className="text-2xl font-bold">{isOpen ? '🚀 NR' : '🚀'}</div>
        {isOpen && <p className="text-xs opacity-75 mt-1">Networking Roadmap</p>}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              if (window.innerWidth < 768) document.querySelector('main')?.scrollIntoView();
            }}
            className={`w-full min-w-0 text-left px-4 py-3 rounded-lg transition ${
              currentPage === item.id
                ? 'bg-white text-purple-700 font-semibold'
                : 'hover:bg-purple-600'
            }`}
          >
            <span className="block truncate text-base md:text-lg">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-purple-600">
        {isOpen && (
          <div className="text-sm mb-3">
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-xs opacity-75">{user?.role === 'admin' ? '👑 Admin' : '👤 User'}</p>
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

// DASHBOARD
const Dashboard = ({ user, roadmapPhases, tasks, setCurrentPage }) => {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const activePhase = roadmapPhases.find(p => p.status === 'active') || roadmapPhases[0] || {};
  const previewPhases = roadmapPhases.slice(0, 3);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 break-words">Welcome, {user?.name}! 👋</h1>
          <p className="text-gray-600">Your journey from L1 to Senior Network Engineer starts here</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Progress</h2>
          <div className="flex items-center gap-8 flex-col md:flex-row">
            <div className="w-full md:flex-1">
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-gray-600 mt-2">{completed} of {total} tasks completed</p>
            </div>
            <div className="text-3xl font-bold text-purple-600">{Math.round(progress)}%</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon="🎓" label="Current Phase" value={activePhase.title || 'TBD'} color="blue" />
          <StatCard icon="🏆" label="Current Cert" value={activePhase.title?.includes('CCNA') ? 'CCNA 200-301' : 'Roadmap Learning'} color="purple" />
          <StatCard icon="💰" label="Target Salary" value={activePhase.salary || '₹7-12 LPA'} color="green" />
        </div>

        {/* Roadmap Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Roadmap Preview</h2>
            <button
              onClick={() => setCurrentPage('roadmap')}
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              View Full Roadmap
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previewPhases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setCurrentPage('roadmap')}
                className="text-left rounded-2xl border border-gray-200 p-5 transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className={`inline-flex rounded-full px-3 py-1 text-white text-xs font-semibold ${roadmapColorMap[phase.color || 'blue']}`}>
                  {phase.status?.toUpperCase() || 'ACTIVE'}
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-800">{phase.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{phase.time}</p>
                <p className="text-sm text-gray-600 mt-1">{phase.salary}</p>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">Any roadmap edits made by admin will appear here automatically.</p>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://www.youtube.com/@NetworkChuck" target="_blank" rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition">
              <p className="font-semibold">📺 NetworkChuck YouTube</p>
              <p className="text-sm opacity-90">Best for CCNA beginners</p>
            </a>
            <a href="https://www.netacad.com" target="_blank" rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition">
              <p className="font-semibold">🎓 Cisco NetAcad</p>
              <p className="text-sm opacity-90">Free CCNA course</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// STAT CARD COMPONENT
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} text-white rounded-lg shadow-lg p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm opacity-90">{label}</p>
      <p className="text-lg md:text-2xl font-bold break-words">{value}</p>
    </div>
  );
};

// ROADMAP PAGE
const RoadmapPage = ({ phases }) => {
  const displayedPhases = phases && phases.length ? phases : defaultRoadmapPhases;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🗺️ Complete Roadmap</h1>
        <p className="text-gray-600 mb-8">Your complete journey from L1 to Senior Network Engineer</p>

        <div className="space-y-6">
          {displayedPhases.map((phase, idx) => (
            <div key={phase.id} className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${roadmapColorMap[phase.color || 'blue']} text-white flex items-center justify-center font-bold text-lg`}>
                  {phase.id}
                </div>
                {idx < displayedPhases.length - 1 && <div className="w-1 h-12 bg-gray-300 my-2" />}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{phase.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">⏱️ {phase.time}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${roadmapColorMap[phase.color || 'blue']} text-white px-4 py-2 rounded-lg font-semibold`}>
                    {phase.salary}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {phase.topics.map((topic, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// TASK MANAGEMENT
const TaskManagement = ({ user, tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date().toLocaleDateString()
      };
      const updated = [...tasks, task];
      setTasks(updated);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
  };

  const filteredTasks = filter === 'completed' ? tasks.filter(t => t.completed) :
    filter === 'pending' ? tasks.filter(t => !t.completed) : tasks;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">✅ Task Management</h1>

        {/* Add Task */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task (e.g., Watch CCNA videos, Complete Packet Tracer lab)..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2"
            >
              <Plus size={20} /> Add
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All', count: tasks.length },
            { key: 'pending', label: 'Pending', count: tasks.filter(t => !t.completed).length },
            { key: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No tasks here! Create one to get started. 🚀</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-4 rounded-lg transition ${
                  task.completed
                    ? 'bg-gray-100'
                    : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-blue-500 hover:text-blue-600 transition"
                >
                  {task.completed ? (
                    <CheckCircle2 size={24} className="text-green-500" />
                  ) : (
                    <Circle size={24} />
                  )}
                </button>
                <div className="flex-1">
                  <p className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                    {task.text}
                  </p>
                  <p className="text-xs text-gray-400">{task.createdAt}</p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// TOC MANAGEMENT (Admin Only)
const TOCManagement = ({ phases, setPhases }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ phase: '', title: '', topics: 0, status: 'active', color: 'blue' });

  const addTOC = () => {
    if (formData.title.trim()) {
      const newItem = {
        id: Date.now(),
        ...formData,
        topics: String(formData.topics).split(",").map(item => item.trim()).filter(Boolean)
      };
      setPhases([...phases, newItem]);
      setFormData({ phase: '', title: '', topics: 0, status: 'active', color: 'blue' });
    }
  };

  const updateTOC = (id) => {
    const updated = phases.map(item => item.id === id ? { ...item, ...formData, topics: String(formData.topics).split(",").map(item => item.trim()).filter(Boolean) } : item);
    setPhases(updated);
    setEditingId(null);
    setFormData({ phase: '', title: '', topics: 0, status: 'active', color: 'blue' });
  };

  const deleteTOC = (id) => {
    const updated = phases.filter(item => item.id !== id);
    setPhases(updated);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({ phase: item.phase, title: item.title, topics: Array.isArray(item.topics) ? item.topics.join(', ') : item.topics, status: item.status, color: item.color || 'blue' });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 TOC Management</h1>
        <p className="text-gray-600 mb-8">👑 Admin only - Manage roadmap phases and topics</p>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
              type="text"
              placeholder="Topics (comma separated)"
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
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="purple">Purple</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="pink">Pink</option>
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
                setFormData({ phase: '', title: '', topics: 0, status: 'active', color: 'blue' });
              }}
              className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>

        {/* TOC List */}
        <div className="space-y-4">
          {phases.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.phase}</h3>
                  <p className="text-gray-600">{item.title}</p>
                  <div className="mt-2 flex gap-2">
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
                <div className="flex gap-2">
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

export default App;
