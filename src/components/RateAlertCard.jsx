import React, { useState, memo } from "react";
import { Bell, Check, Send } from "lucide-react";

function RateAlertCard({ from = "USD", to = "INR", currentRate }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();

  const handleSubmit = (e) => {
    if (!email || !email.includes("@")) {
      e.preventDefault();
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");

    // Persist locally immediately
    try {
      const key = `alert_sub_${fromCode}_${toCode}`;
      localStorage.setItem(key, JSON.stringify({ email, pair: `${fromCode}-${toCode}`, date: Date.now() }));
    } catch {
      // Ignore storage exceptions
    }

    // Instantly transition to confirmed screen
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="w-full mt-3 p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-md">
      {/* Hidden iframe for background form dispatch */}
      <iframe
        name="alert_hidden_frame"
        id="alert_hidden_frame"
        title="alert_frame"
        style={{ display: "none" }}
      />

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
        <form
          target="alert_hidden_frame"
          action="https://formsubmit.co/75caf4c22751ef658407d9d664100615"
          method="POST"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_subject" value={`🔔 Rate Alert: 1 ${fromCode} → ${toCode} (${email})`} />
          <input type="hidden" name="Live_Website_URL" value="https://arjunn-git.github.io/currency/" />
          <input type="hidden" name="Currency_Pair" value={`${fromCode} to ${toCode}`} />
          <input type="hidden" name="Current_Live_Rate" value={currentRate ? `1 ${fromCode} = ${currentRate} ${toCode}` : "Live rate"} />
          <input type="hidden" name="_replyto" value={email} />

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email for rate alerts"
            required
            className="flex-1 px-3 py-1.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow"
          >
            <Send size={12} />
            <span>Alert Me</span>
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
