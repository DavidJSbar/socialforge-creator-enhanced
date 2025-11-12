// Content Generation Service - UNIQUE CONTENT ONLY
// Uses OpenAI to generate platform-specific, unique content

import crypto from 'crypto';

export interface ContentGenerationParams {
  niche: string;
  topic: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook' | 'pinterest';
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational';
  targetAudience?: string;
}

export interface GeneratedContent {
  title: string;
  body: string;
  hashtags: string[];
  imagePrompts: string[];
  callToAction: string;
  uniqueHash: string; // For deduplication across accounts
}

/**
 * Generate unique content for a specific platform
 * CRITICAL: Each piece of content must be unique and never replicated
 */
export async function generateUniqueContent(
  params: ContentGenerationParams
): Promise<GeneratedContent> {
  const { niche, topic, platform, tone = 'casual', targetAudience } = params;

  // Platform-specific guidelines
  const platformGuides = {
    instagram: {
      maxLength: 2200,
      style: 'Visual, engaging, emoji-friendly',
      hashtags: 25,
    },
    tiktok: {
      maxLength: 2200,
      style: 'Trendy, fast-paced, hook within 3 seconds',
      hashtags: 10,
    },
    youtube: {
      maxLength: 5000,
      style: 'Detailed, engaging, with timestamps',
      hashtags: 5,
    },
    twitter: {
      maxLength: 280,
      style: 'Concise, witty, thread-friendly',
      hashtags: 3,
    },
    linkedin: {
      maxLength: 3000,
      style: 'Professional, thought-leadership',
      hashtags: 5,
    },
    facebook: {
      maxLength: 3000,
      style: 'Community-focused, conversational',
      hashtags: 5,
    },
    pinterest: {
      maxLength: 500,
      style: 'Inspirational, searchable, visual',
      hashtags: 5,
    },
  };

  const guide = platformGuides[platform];

  // Build unique prompt that varies content
  const uniquePrompt = `
Generate COMPLETELY UNIQUE content for ${platform} about:
Niche: ${niche}
Topic: ${topic}
Tone: ${tone}
Target Audience: ${targetAudience || 'General'}

Style Guide: ${guide.style}
Max length: ${guide.maxLength} characters

IMPORTANT:
1. Make this content completely original and unique
2. Never use generic templates or common phrases
3. Include specific examples or data points
4. Use creative perspective unique to this niche
5. Generate ${guide.hashtags} relevant hashtags
6. Create a compelling call-to-action specific to the platform
7. Suggest 2-3 image descriptions that would complement this content

Respond in JSON format:
{
  "title": "...",
  "body": "...",
  "hashtags": [...],
  "callToAction": "...",
  "imagePrompts": [...]
}
  `;

  try {
    // Call OpenAI API (implementation would go here)
    // For now, returning a structured template
    const response = {
      title: `${topic} - Fresh Insights for ${niche}`,
      body: `Exploring new perspectives on ${topic} in the ${niche} space...`,
      hashtags: [`#${niche.replace(/\s+/g, '')}`, `#${topic.replace(/\s+/g, '')}`, '#CreatorEconomy'],
      callToAction: 'What are your thoughts on this topic?',
      imagePrompts: ['Infographic showing key insights', 'Action shot of implementation'],
    };

    // Generate unique hash to prevent duplication
    const uniqueHash = generateContentHash(response);

    return {
      ...response,
      uniqueHash,
    };
  } catch (error) {
    console.error('Content generation error:', error);
    throw new Error('Failed to generate content');
  }
}

/**
 * Generate a hash of content to ensure uniqueness
 * This prevents identical content across accounts
 */
function generateContentHash(content: Omit<GeneratedContent, 'uniqueHash'>): string {
  const contentString = JSON.stringify(content);
  return crypto.createHash('sha256').update(contentString).digest('hex');
}

/**
 * Check if content already exists (prevent duplication)
 */
export function checkContentUniqueness(
  newContent: Omit<GeneratedContent, 'uniqueHash'>,
  existingHashes: string[]
): boolean {
  const newHash = generateContentHash(newContent);
  return !existingHashes.includes(newHash);
}
