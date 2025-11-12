"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContentCreator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({ title, content, image_url: null }),
      });
      const data = await res.json();
      
      if (publish && data[0]?.id) {
        await fetch("/api/posts/publish", {
          method: "POST",
          body: JSON.stringify({ postId: data[0].id }),
        });
      }
      
      setTitle("");
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Create Content</h1>
      {success && <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">Post created successfully!</div>}
      {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">{error}</div>}
      <form className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50">
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none text-lg"
          />
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={(e) => handleCreate(e, false)}
            disabled={loading}
            type="button"
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            onClick={(e) => handleCreate(e, true)}
            disabled={loading}
            type="button"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            {loading ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}