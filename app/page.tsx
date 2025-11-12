"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const features = [
    { icon: "✍️", title: "Write Once", desc: "Create content in one place" },
    { icon: "📤", title: "Publish Everywhere", desc: "Auto-post to all your social accounts" },
    { icon: "📊", title: "Real Analytics", desc: "Track engagement across platforms" },
    { icon: "⏰", title: "Schedule Posts", desc: "Plan content weeks in advance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Manage Your Social <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Presence</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            One dashboard. All your social media. Post to Twitter, Instagram, TikTok—and everywhere else—from one beautiful interface.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-all">
              Start Free
            </Link>
            <Link href="/login" className="border border-slate-600 text-white px-8 py-4 rounded-lg font-semibold hover:border-slate-500 transition-all">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 text-center py-20 border-t border-slate-700">
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">0</div>
            <p className="text-slate-400">Active Creators</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">0</div>
            <p className="text-slate-400">Posts Published</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-2">0</div>
            <p className="text-slate-400">Platforms Connected</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Footer */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-t border-slate-700 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to level up your social game?</h2>
        <Link href="/signup" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}