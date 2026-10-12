import React, { useState } from "react";
import { Bell, Check, Send } from "lucide-react";

export default function RateAlertCard({ from, to }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    // Save lead in localStorage or connect to newsletter service (e.g. Mailchimp, ConvertKit, Beehiiv)
    try {
      const subscribers = JSON.parse(localStorage.getItem("rate_subscribers") || "[]");
      subscribers.push({ email, pair: `${from}-${to}`.toUpperCase(), date: new Date().toISOString() });
      localStorage.setItem("rate_subscribers", JSON.stringify(subscribers));
    } catch {
      // Ignore storage errors
    }

    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="w-full mt-3 p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-md">
      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-100 mb-1">
        <Bell size={13} className="text-yellow-300" />
        <span>Get Rate Alerts for {(from || "USD").toUpperCase()} → {(to || "INR").toUpperCase()}</span>
      </div>
      <p className="text-[11px] text-white/80 mb-2">
        We'll alert you via email when exchange rates move significantly.
      </p>

      {submitted ? (
        <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-500/30 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-semibold">
          <Check size={14} /> Subscribed successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-3 py-1.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow"
          >
            <Send size={12} />
            <span>Alert Me</span>
          </button>
        </form>
      )}
    </div>
  );
}
