# Build all remaining SocialForge components
import os, json

files_to_create = {
    'app/signup/page.tsx': '''"use client";
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, email.split("@")[0]);
    } catch (err) {}
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-slate-900 flex items-center justify-center p-4">
      <form onSubmit={handleSignup} className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Create Account</h1>
        <div className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg" />
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg">
          {loading ? "Creating..." : "Sign Up"}
        </button>
        <p className="text-slate-400 mt-4 text-center">Already have an account? <Link href="/login" className="text-indigo-400">Sign in</Link></p>
      </form>
    </motion.div>
  );
}''',
    'app/analytics/page.tsx': '''"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{label: 'Total Posts', value: '0'}, {label: 'Total Engagement', value: '0'}, {label: 'Avg Likes', value: '0'}, {label: 'Growth', value: '0%'}].map((stat, i) => (
            <motion.div key={i} className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}''',
    'app/api/posts/route.ts': '''import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { title, content, image_url } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.from("posts").insert([{ user_id: user.id, title, content, image_url, status: "draft" }]).select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  return NextResponse.json(data);
}''',
    'app/layout.tsx': '''import type { Metadata } from "next";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialForge Creator",
  description: "Premium social media management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}''',
    'middleware.ts': '''import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*", "/create/:path*"],
};
'''
}

for path, content in files_to_create.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)
    print(f"✅ Created {path}")

print("\n🚀 All components generated successfully!")
