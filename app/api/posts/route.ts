import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { AuthError, handleAPIError, ValidationError, DatabaseError } from "@/app/lib/errors";
import { validateRequired, validatePostContent } from "@/app/lib/validation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Create a new post
 * @route POST /api/posts
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { title, content, image_url } = body;

    // Validate required fields
    validateRequired(body, ['content']);

    // Validate content
    validatePostContent(title, content);

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthError("User not authenticated");
    }

    // Insert post
    const { data, error } = await supabase
      .from("posts")
      .insert([{
        user_id: user.id,
        title: title || null,
        content,
        image_url: image_url || null,
        status: "draft",
      }])
      .select();

    if (error) {
      throw new DatabaseError(`Failed to create post: ${error.message}`);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * Get all posts for the authenticated user
 * @route GET /api/posts
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new AuthError("User not authenticated");
    }

    // Fetch posts
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new DatabaseError(`Failed to fetch posts: ${error.message}`);
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}