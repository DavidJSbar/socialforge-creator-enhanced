"use client";
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
}