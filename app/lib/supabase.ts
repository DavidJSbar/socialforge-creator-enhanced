// Supabase Database Configuration
// Initialize with environment variables

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
};

// Database types for SocialForge
export interface ContentIdea {
  id: string;
  createdAt: string;
  niche: string;
  topic: string;
  description: string;
  platforms: string[];
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  userId: string;
}

export interface GeneratedContent {
  id: string;
  contentIdeaId: string;
  platform: string;
  title: string;
  body: string;
  hashtags: string[];
  imagePrompts: string[];
  uniqueHash: string; // Ensure uniqueness
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  createdAt: string;
  userId: string;
}

export interface ReviewQueue {
  id: string;
  contentId: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  contentId: string;
  platform: string;
  eventType: 'view' | 'like' | 'comment' | 'share' | 'click';
  timestamp: string;
  metadata: Record<string, any>;
}

export interface MonetizationOpportunity {
  id: string;
  userId: string;
  platform: string;
  opportunityType: 'affiliate' | 'sponsorship' | 'ad_network' | 'product';
  description: string;
  estimatedValue: number;
  relevantNiches: string[];
  status: 'available' | 'applied' | 'accepted' | 'rejected';
  createdAt: string;
}
