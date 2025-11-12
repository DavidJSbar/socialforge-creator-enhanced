import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { data: posts } = await supabase.from("posts").select("*").eq("user_id", user.id);
  const { data: analytics } = await supabase.from("analytics").select("*").eq("user_id", user.id);
  const { data: accounts } = await supabase.from("social_accounts").select("*").eq("user_id", user.id);
  
  const totalPosts = posts?.length || 0;
  const totalEngagement = analytics?.reduce((sum, a) => sum + (a.likes + a.comments), 0) || 0;
  const avgEngagement = totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0;
  
  return NextResponse.json({
    totalPosts,
    totalEngagement,
    avgEngagement,
    connectedAccounts: accounts?.length || 0,
    publishedPosts: posts?.filter(p => p.status === "published").length || 0,
  });
}
