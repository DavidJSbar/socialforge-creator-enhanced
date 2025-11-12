'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import type { RedditOpportunity } from '@/lib/services/reddit';

interface GeneratePostModalProps {
  isOpen: boolean;
  opportunity: RedditOpportunity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GeneratePostModal({
  isOpen,
  opportunity,
  onClose,
  onSuccess,
}: GeneratePostModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<'casual' | 'professional' | 'humorous'>('casual');
  const [platforms, setPlatforms] = useState({
    twitter: true,
    linkedin: true,
    tiktok: true,
    instagram: true,
  });

  const handleGeneratePost = async () => {
    if (!opportunity) return;
    setLoading(true);
    setError(null);
    
    const selectedPlatforms = Object.keys(platforms)
      .filter(p => platforms[p as keyof typeof platforms])
      .map(p => p === 'tiktok' ? 'tiktok' : p);
    
    if (selectedPlatforms.length === 0) {
      setError('Select at least one platform');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          platforms: selectedPlatforms,
          tone,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Generate Post Ideas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-600 font-medium">Posts generated successfully!</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Opportunity</p>
              <p className="text-sm text-gray-600 line-clamp-2">{opportunity.title}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Tone</p>
              <div className="grid grid-cols-3 gap-2">
                {(['casual', 'professional', 'humorous'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-2 px-3 rounded text-sm font-medium transition ${
                      tone === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Platforms</p>
              <div className="space-y-2">
                {Object.entries(platforms).map(([platform, checked]) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setPlatforms(prev => ({ ...prev, [platform]: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePost}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}