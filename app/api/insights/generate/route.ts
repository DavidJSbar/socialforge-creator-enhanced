import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { generatePostVariations, selectBestPost } from '@/lib/services/postGeneration';
import type { RedditOpportunity } from '@/lib/services/reddit';
import { InsightsRepository } from '@/lib/repositories/InsightsRepository';

export async function POST(req: NextRequest) {
  try {
    const { opportunityId, platforms = ['twitter', 'linkedin', 'tiktok', 'instagram'], tone = 'casual' } = await req.json();
    
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch the opportunity from the database
    const { data: opportunity, error } = await supabase
      .from('reddit_opportunities')
      .select('*')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();
    
    if (error || !opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }
    
    // Generate post variations for the opportunity
    const response = generatePostVariations({
      opportunity: opportunity as RedditOpportunity,
      platforms: platforms as any,
      tone: tone as any,
    });
    
    // Select the best performing post
    const bestPost = selectBestPost(response.generatedPosts);
    
    // Store generated posts in the database for future reference
    const { error: insertError } = await supabase
      .from('generated_posts')
      .insert({
        user_id: user.id,
        opportunity_id: opportunityId,
        platform: bestPost.platform,
        content: bestPost.content,
        hashtags: bestPost.hashtags,
        cta: bestPost.cta,
        image_prompt: bestPost.imagePrompt,
        video_idea: bestPost.videoIdea,
        estimated_engagement: bestPost.estimatedEngagement,
      });
    
    if (insertError) {
      console.error('Error storing generated post:', insertError);
    }
    
    return NextResponse.json({
      success: true,
      opportunity: opportunity,
      generatedPosts: response.generatedPosts,
      bestPost: bestPost,
      contentIdeas: response.ideas,
      timestamp: response.timestamp,
    });
  } catch (error) {
    console.error('Post generation error:', error);
    return NextResponse.json({ error: 'Post generation failed' }, { status: 500 });
  }
}