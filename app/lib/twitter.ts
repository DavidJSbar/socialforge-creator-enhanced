// lib/twitter.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const TWITTER_OAUTH_SCOPES = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "follows.read",
  "follows.write",
].join(" ");

export async function getTwitterAuthUrl() {
  const state = Math.random().toString(36).substring(2, 15);
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;
  
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: TWITTER_OAUTH_SCOPES,
    state: state,
    code_challenge: state,
    code_challenge_method: "plain",
  });

  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

export async function saveTwitterAccount(
  userId: string,
  twitterHandle: string,
  accessToken: string,
  refreshToken: string
) {
  const { error } = await supabase.from("social_accounts").insert([
    {
      user_id: userId,
      platform: "twitter",
      account_id: twitterHandle,
      tokens: { access_token: accessToken, refresh_token: refreshToken },
      followers_count: 0,
      connected_at: new Date(),
    },
  ]);

  if (error) throw error;
  return true;
}
