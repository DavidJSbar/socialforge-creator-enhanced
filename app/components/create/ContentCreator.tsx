"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface FormErrors {
  title?: string;
  content?: string;
}

/**
 * Content Creator Component
 * Allows users to create and publish posts with proper validation and error handling
 */
export default function ContentCreator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (title && (title.length < 1 || title.length > 280)) {
      errors.title = "Title must be between 1 and 280 characters";
    }

    if (!content || content.length < 1) {
      errors.content = "Content is required";
    } else if (content.length > 10000) {
      errors.content = "Content must not exceed 10,000 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle post creation and publishing
   */
  const handleCreate = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setFormErrors({});

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: title || null, 
          content, 
          image_url: null 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      const data = await res.json();
      
      if (publish && data[0]?.id) {
        const publishRes = await fetch("/api/posts/publish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId: data[0].id }),
        });

        if (!publishRes.ok) {
          const publishError = await publishRes.json();
          throw new Error(publishError.error || "Failed to publish post");
        }
      }
      
      // Reset form on success
      setTitle("");
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto p-8"
    >
      <h1 className="text-4xl font-bold text-white mb-8">Create Content</h1>
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">
          Post created successfully!
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50">
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <input
              type="text"
              placeholder="Post Title (optional)"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formErrors.title) {
                  setFormErrors({ ...formErrors, title: undefined });
                }
              }}
              disabled={loading}
              className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                formErrors.title ? 'border-red-500' : 'border-slate-600'
              } focus:border-indigo-500 focus:outline-none text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {formErrors.title && (
              <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Content Textarea */}
          <div>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (formErrors.content) {
                  setFormErrors({ ...formErrors, content: undefined });
                }
              }}
              disabled={loading}
              required
              rows={8}
              className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                formErrors.content ? 'border-red-500' : 'border-slate-600'
              } focus:border-indigo-500 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {formErrors.content && (
              <p className="text-red-400 text-sm mt-1">{formErrors.content}</p>
            )}
            <p className="text-slate-400 text-sm mt-1">
              {content.length} / 10,000 characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={(e) => handleCreate(e, false)}
            disabled={loading}
            type="button"
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            onClick={(e) => handleCreate(e, true)}
            disabled={loading}
            type="button"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}