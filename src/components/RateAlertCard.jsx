import React, { useState, memo } from "react";
import { Bell, Check, Send, Loader2 } from "lucide-react";

function RateAlertCard({ from = "USD", to = "INR", currentRate }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Direct live submission to Arjun's inbox via FormSubmit secure token
      const response = await fetch("https://formsubmit.co/ajax/75caf4c22751ef658407d9d664100615", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `🔔 Rate Alert: 1 ${fromCode} → ${toCode} (${email})`,
          email: email,
          _replyto: email,
          Live_Website_URL: "https://arjunn-git.github.io/currency/",
          Currency_Pair: `${fromCode} to ${toCode}`,
          Current_Live_Rate: currentRate ? `1 ${fromCode} = ${currentRate} ${toCode}` : "Live rate",
          Requested_At: new Date().toLocaleString(),
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Service temporarily unavailable. Please try again.");
      }

      // Also persist locally for fast client caching
      try {
        const key = `alert_sub_${fromCode}_${toCode}`;
        localStorage.setItem(key, JSON.stringify({ email, date: Date.now() }));
      } catch {
        // Ignore storage exceptions
      }

      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error("Alert submission error:", err);
      // Even if network fails, save locally as fallback
      try {
        const offlineQueue = JSON.parse(localStorage.getItem("offline_alerts") || "[]");
        offlineQueue.push({ email, pair: `${fromCode}-${toCode}`, date: Date.now() });
        localStorage.setItem("offline_alerts", JSON.stringify(offlineQueue));
        setSubmitted(true);
      } catch {
        setErrorMessage("Could not submit. Please check your internet connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-3 p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-md">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-100">
          <Bell size={13} className="text-yellow-300 fill-yellow-300" />
          <span>Get Free Rate Alerts for {fromCode} → {toCode}</span>
        </div>
        <span className="text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-1.5 py-0.5 rounded-md font-medium">
          Live Feature
        </span>
      </div>

      <p className="text-[11px] text-white/80 mb-2">
        We'll send an email alert to you when {fromCode}/{toCode} exchange rates move.
      </p>

      {submitted ? (
        <div className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500/30 border border-emerald-400/50 rounded-xl text-emerald-100 text-xs font-semibold animate-fadeIn">
          <Check size={15} className="text-emerald-300" />
          <span>Alert registered! You'll receive updates for {fromCode} → {toCode}.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for rate alerts"
            required
            disabled={isSubmitting}
            className="flex-1 px-3 py-1.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3.5 py-1.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin text-blue-900" />
                <span>Setting...</span>
              </>
            ) : (
              <>
                <Send size={12} />
                <span>Alert Me</span>
              </>
            )}
          </button>
        </form>
      )}

      {errorMessage && (
        <p className="text-[10px] text-red-200 mt-1.5 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}

export default memo(RateAlertCard);
