import { useState } from 'react';
import { MessageCircle, Share2 } from 'lucide-react';
import GeneratePostModal from './GeneratePostModal';
import type { RedditOpportunity } from '@/lib/services/reddit';

interface OpportunityCardProps {
  opportunity: RedditOpportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [showModal, setShowModal] = useState(false);

  const typeColors: Record<string, string> = {
    product: 'bg-blue-100 text-blue-800',
    content: 'bg-purple-100 text-purple-800',
    service: 'bg-green-100 text-green-800',
    trend: 'bg-orange-100 text-orange-800',
  };

  return (
    <>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">{opportunity.title}</h3>
            <p className="text-sm text-gray-500 mt-1">r/{opportunity.subreddit}</p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${typeColors[opportunity.opportunity_type] || 'bg-gray-100'}`}>
            {opportunity.opportunity_type}
          </span>
        </div>

        {opportunity.keywords && opportunity.keywords.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {opportunity.keywords.slice(0, 3).map((kw, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {kw}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {opportunity.num_comments || 0}
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            {opportunity.engagement_score?.toFixed(0) || 0}
          </div>
        </div>

        {opportunity.sentiment && (
          <div className="mb-3 text-sm">
            <span className="font-medium">Sentiment:</span>
            <span className={`ml-2 ${opportunity.sentiment === 'positive' ? 'text-green-600' : opportunity.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
              {opportunity.sentiment}
            </span>
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Generate Post Ideas
        </button>
      </div>

      <GeneratePostModal
        isOpen={showModal}
        opportunity={opportunity}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
    </>
  );
}