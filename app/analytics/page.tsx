"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Analytics</h1>
        {loading ? (<div className="text-slate-400">Loading...</div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Posts", value: stats?.totalPosts || 0 },
            { label: "Published", value: stats?.publishedPosts || 0 },
            { label: "Total Engagement", value: stats?.totalEngagement || 0 },
            { label: "Avg Per Post", value: stats?.avgEngagement || 0 },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-xl border border-slate-700/50">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-4xl font-bold text-indigo-400 mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>)}
      </div>
    </motion.div>
  );
}