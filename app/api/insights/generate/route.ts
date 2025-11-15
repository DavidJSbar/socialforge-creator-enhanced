import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/app/lib/supabase-server';
import { generatePostVariations, selectBestPost } from '@/app/lib/services/postGeneration';
import type { RedditOpportunity } from '@/app/services/reddit';
import { InsightsRepository } from '@/app/lib/repositories/InsightsRepository';
import { AuthError, NotFoundError, DatabaseError, handleAPIError, ValidationError } from '@/app/lib/errors';
import { validateRequired, validatePlatforms } from '@/app/lib/validation';
import { Platform } from '@/app/lib/constants';

/**
 * Generate content variations from a Reddit opportunity
 * @route POST /api/insights/generate
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { 
      opportunityId, 
      platforms = ['twitter', 'linkedin', 'tiktok', 'instagram'], 
      tone = 'casual' 
    } = body;

    // Validate required fields
    validateRequired(body, ['opportunityId']);

    // Validate platforms
    if (!validatePlatforms(platforms)) {
      throw new ValidationError('Invalid platforms provided');
    }

    // Authenticate user
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new AuthError('User not authenticated');
    }
    
    // Fetch the opportunity from the database
    const { data: opportunity, error } = await supabase
      .from('reddit_opportunities')
      .select('*')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      throw new DatabaseError(`Database error: ${error.message}`);
    }

    if (!opportunity) {
      throw new NotFoundError('Opportunity not found');
    }
    
    // Generate post variations for the opportunity
    const response = generatePostVariations({
      opportunity: opportunity as RedditOpportunity,
      platforms: platforms as Platform[],
      tone: tone as 'casual' | 'professional' | 'educational',
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
      // Non-critical error, continue with response
    }
    
    return NextResponse.json({
      success: true,
      opportunity,
      generatedPosts: response.generatedPosts,
      bestPost,
      contentIdeas: response.ideas,
      timestamp: response.timestamp,
    }, { status: 200 });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}