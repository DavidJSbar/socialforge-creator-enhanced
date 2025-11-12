'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SocialForge Creator</h1>
              <p className="text-gray-600 mt-1">AI-Powered Multi-Platform Content Creation</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>🔒 TOS-Compliant • 🎯 Unique Content Only • 👤 Human Approval Required</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container">
          <div className="flex gap-8">
            {['dashboard', 'niche', 'create', 'queue', 'analytics', 'monetize'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'niche' && <NicheTab />}
        {activeTab === 'create' && <CreateTab />}
        {activeTab === 'queue' && <QueueTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'monetize' && <MonetizeTab />}
      </main>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="card">
        <p className="text-gray-600 text-sm">Content Ideas This Month</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
      </div>
      <div className="card">
        <p className="text-gray-600 text-sm">Approved for Publishing</p>
        <p className="text-3xl font-bold text-green-600 mt-2">18</p>
      </div>
      <div className="card">
        <p className="text-gray-600 text-sm">In Review Queue</p>
        <p className="text-3xl font-bold text-yellow-600 mt-2">6</p>
      </div>
      <div className="card">
        <p className="text-gray-600 text-sm">Estimated Monthly Income</p>
        <p className="text-3xl font-bold text-purple-600 mt-2">$1,240</p>
      </div>
      <div className="card md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Top Niches This Week</h3>
        <ul className="space-y-2">
          <li className="flex justify-between"><span>AI & Machine Learning</span><span className="font-bold">15 ideas</span></li>
          <li className="flex justify-between"><span>Sustainable Living</span><span className="font-bold">12 ideas</span></li>
          <li className="flex justify-between"><span>Digital Marketing</span><span className="font-bold">10 ideas</span></li>
        </ul>
      </div>
      <div className="card md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="btn-primary w-full">Explore Niche Ideas</button>
          <button className="btn-secondary w-full">Create New Content</button>
          <button className="btn-secondary w-full">Review Pending Items</button>
        </div>
      </div>
    </div>
  );
}

function NicheTab() {
  return <div className="card"><p className="text-gray-600">Niche Intelligence Engine - Coming Soon</p></div>;
}

function CreateTab() {
  return <div className="card"><p className="text-gray-600">Content Lab - Create Unique Content - Coming Soon</p></div>;
}

function QueueTab() {
  return <div className="card"><p className="text-gray-600">Review Queue - Human Approval Required - Coming Soon</p></div>;
}

function AnalyticsTab() {
  return <div className="card"><p className="text-gray-600">Analytics Dashboard - Coming Soon</p></div>;
}

function MonetizeTab() {
  return <div className="card"><p className="text-gray-600">Monetization Tracker - Coming Soon</p></div>;
}
