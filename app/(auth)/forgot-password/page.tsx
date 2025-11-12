UI_DESIGN_SPECIFICATION.mdcat > app/components/auth/SignIn.tsx << 'EOFSIGNIN'
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // Call your authentication service
      // await authenticateUser(email, password);
      console.log('Sign in attempt', { email, rememberMe });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <span className="text-xl font-bold text-white">SF</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">SocialForge</h1>
          <p className="text-slate-600 dark:text-slate-300">Creator Platform</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={isLoading || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">or continue with</span>
            </div>
          </div>

          {/* OAuth Button */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <text x="0" y="20" fontSize="20" fill="currentColor">G</text>
            </svg>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Google</span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Forgot Password?
          </button>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Don't have an account?{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
EOFSIGNIN
cat > app/components/dashboard/Dashboard.tsx << 'EOFDASHBOARD'
'use client';

import { useState } from 'react';
import { Menu, X, Home, PenTool, BarChart3, Sparkles, DollarSign, Settings, LogOut, Bell, Search } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '#' },
    { icon: PenTool, label: 'Content Creator', href: '#' },
    { icon: BarChart3, label: 'Analytics', href: '#' },
    { icon: Sparkles, label: 'Niche Intelligence', href: '#' },
    { icon: DollarSign, label: 'Monetization', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  const kpis = [
    { label: 'Total Posts', value: '48', change: '+12%', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Pending Approval', value: '5', change: '2 Today', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'This Month Revenue', value: '$3,240', change: '+28%', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${ sidebarOpen ? 'w-64' : 'w-0'} lg:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 overflow-hidden`}>
          <div className="p-6 space-y-8 h-screen overflow-y-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">SF</div>
              <span className="font-bold text-lg">SocialForge</span>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    idx === 0
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition mt-auto">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {kpis.map((kpi, idx) => (
              <div key={idx} className={`${kpi.bgColor} rounded-2xl p-6 border border-slate-100 dark:border-slate-700`}>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{kpi.label}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{kpi.change}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Posts Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Posts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Platforms</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">Post Title {i + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Instagram, TikTok</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          i === 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {i === 0 ? 'Pending' : 'Published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Today at 2:30 PM</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOFDASHBOARD
