"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContentCreator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({ title, content, image_url: null }),
      });
      if (response.ok) {
        setTitle("");
        setContent("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {}
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Create Content</h1>
      {success && <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">Post created successfully!</div>}
      <form onSubmit={handleCreate} className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50">
        <div className="space-y-6">
          <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600" />
          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 resize-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-lg">
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </motion.div>
  );
}