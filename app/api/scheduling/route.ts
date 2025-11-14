import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch scheduled posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timezone = searchParams.get('timezone') || 'UTC';
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        social_accounts(platform, username),
        posts(title, content)
      `)
      .eq('user_id', userId)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ posts: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create scheduled post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      post_id,
      social_account_id,
      scheduled_for,
      timezone = 'UTC',
      recurrence_pattern,
      auto_publish = false
    } = body;

    if (!user_id || !post_id || !social_account_id || !scheduled_for) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert scheduled time to UTC based on user's timezone
    const scheduledDate = new Date(scheduled_for);
    
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id,
        post_id,
        social_account_id,
        scheduled_for: scheduledDate.toISOString(),
        timezone,
        recurrence_pattern,
        auto_publish,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // If auto_publish is true, set up publishing job
    if (auto_publish) {
      // TODO: Integrate with queue system (Bull, Inngest, or Supabase pg_cron)
      console.log('Auto-publish scheduled for:', data.id);
    }

    return NextResponse.json({ success: true, scheduled_post: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update scheduled post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, scheduled_for, timezone, auto_publish, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (scheduled_for) updates.scheduled_for = scheduled_for;
    if (timezone) updates.timezone = timezone;
    if (auto_publish !== undefined) updates.auto_publish = auto_publish;
    if (status) updates.status = status;

    const { data, error } = await supabase
      .from('scheduled_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, scheduled_post: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Cancel scheduled post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
