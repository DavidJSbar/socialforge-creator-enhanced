import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { postId } = await req.json();
  const { data: post } = await supabase.from("posts").select("*").eq("id", postId).eq("user_id", user.id).single();
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  const { data: twitterAccount } = await supabase.from("social_accounts").select("*").eq("user_id", user.id).eq("platform", "twitter").single();
  if (!twitterAccount?.tokens?.access_token) return NextResponse.json({ error: "Twitter not connected" }, { status: 400 });
  await supabase.from("posts").update({ status: "published", published_at: new Date() }).eq("id", postId);
  await supabase.from("analytics").insert([{ user_id: user.id, post_id: postId, platform: "twitter", views: 0, likes: 0, comments: 0, shares: 0 }]);
  return NextResponse.json({ success: true });
}
