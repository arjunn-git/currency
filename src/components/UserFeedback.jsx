import React, { useState, memo } from "react";
import { MessageSquarePlus, Star, X, Send, Check, Loader2, User, Mail } from "lucide-react";

function UserFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("Feature Suggestion");
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim() || !name.trim() || !email.trim()) {
      setError("Please fill out your name, email, and feedback message.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const liveUrl = "https://arjunn-git.github.io/currency/";

    try {
      const response = await fetch("https://formsubmit.co/ajax/75caf4c22751ef658407d9d664100615", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `💬 Feedback (${rating} Stars) from ${name} [${category}]`,
          name: name,
          email: email,
          _replyto: email,
          Live_Website_URL: liveUrl,
          Rating: `${rating} / 5 Stars`,
          Category: category,
          User_Feedback: feedback,
          Submitted_At: new Date().toLocaleString(),
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send. Please try again.");
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setFeedback("");
        setName("");
        setEmail("");
        setRating(5);
      }, 3500);
    } catch (err) {
      console.error("Feedback error:", err);
      setError("Unable to submit right now. You can email us directly at arjuntaneja204@gmail.com!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Feedback Trigger Button */}
      <div className="flex justify-center mt-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md border border-white/25 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageSquarePlus size={14} className="text-amber-300" />
          <span>Suggest a Feature / Give Feedback</span>
        </button>
      </div>

      {/* Feedback Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquarePlus size={20} className="text-blue-600" />
                  Your Feedback Matters
                </h3>
                <p className="text-xs text-gray-500">
                  Help us make this the #1 currency tool on the web!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Check size={28} />
                </div>
                <h4 className="text-base font-bold text-gray-900">Thank You, {name}!</h4>
                <p className="text-xs text-gray-600 max-w-xs">
                  Your feedback and suggestions were sent directly to Arjun's inbox. We really appreciate your input!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    How would you rate your experience?
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          size={22}
                          className={`${
                            (hoverRating || rating) >= star
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 ml-2 font-medium">
                      {rating === 5 ? "⭐⭐⭐⭐⭐ Outstanding" : `${rating} / 5`}
                    </span>
                  </div>
                </div>

                {/* Name & Email Inputs (Required so Arjun gets real identity) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User size={14} className="absolute left-2.5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={14} className="absolute left-2.5 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Feedback Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Feature Suggestion">💡 Feature Suggestion (e.g. historical charts)</option>
                    <option value="UI & Speed Improvement">⚡ UI Speed or Design Improvement</option>
                    <option value="Exchange Rate Question">💱 Exchange Rate Question / Missing Currency</option>
                    <option value="Bug Report">🐛 Bug Report</option>
                    <option value="General Feedback">💬 General Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Suggestions <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what features or changes you'd love to see on https://arjunn-git.github.io/currency/..."
                    required
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-gray-800 placeholder-gray-400 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default memo(UserFeedback);
