'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import OpportunityCard from './OpportunityCard';
import type { RedditOpportunity } from '@/lib/services/reddit';

export default function ContentOpportunities() {
  const [keyword, setKeyword] = useState('');
  const [subreddit, setSubreddit] = useState('');
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<RedditOpportunity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, subreddit }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setOpportunities(data.results.opportunities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search Reddit for content ideas"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          placeholder="Subreddit (optional)"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.post_id} opportunity={opp} />
        ))}
      </div>

      {!loading && opportunities.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          Search Reddit to discover content opportunities
        </div>
      )}
    </div>
  );
}