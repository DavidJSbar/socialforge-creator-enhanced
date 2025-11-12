'use client';

import { useState } from 'react';
import ContentOpportunities from '@/app/components/insights/ContentOpportunities';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'posts' | 'analytics'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-4 mt-4 border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`pb-2 px-2 font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Content Insights
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-2 px-2 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 px-2 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-gray-600 text-sm font-medium">Total Posts</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-gray-600 text-sm font-medium">Engagement</h3>
              <p className="text-3xl font-bold mt-2">0%</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-gray-600 text-sm font-medium">Followers</h3>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          </div>
        )}
        {activeTab === 'insights' && <ContentOpportunities />}
        {activeTab === 'posts' && <div className="text-gray-500">Posts coming soon</div>}
        {activeTab === 'analytics' && <div className="text-gray-500">Analytics coming soon</div>}
      </div>
    </div>
  );
}