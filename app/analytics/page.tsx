"use client";
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
}