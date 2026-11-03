import React, { useState, memo, useCallback } from "react";
import {
  Heart,
  Smartphone,
  CreditCard,
  X,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Globe,
} from "lucide-react";

function SupportModal({ isOpen, onClose }) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState("upi"); // 'upi' (default) | 'other' | 'share'
  const [upiAmount, setUpiAmount] = useState("100");
  const [paypalAmount, setPaypalAmount] = useState("5");

  // Payment configuration (easily customizable by Arjun)
  const upiId = "arjuntaneja204@okaxis";
  const paypalUrl = "https://paypal.me/arjuntaneja204";

  const copyUpi = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // fallback
    }
  }, [upiId]);

  const shareWebsite = useCallback(async () => {
    const shareData = {
      title: "Live Currency Converter",
      text: "Check out this free, real-time mid-market currency converter with zero bank markups!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.85)] ring-1 ring-white/10 max-h-[90vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-scaleUp text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Background Glows clipped strictly within card boundaries */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl" />
        </div>

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-500/10 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
              <Heart size={18} className="fill-blue-400 text-blue-400" />
            </div>
            <div>
              <h2 id="support-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-xs">
                Support This Project
              </h2>
              <p className="text-[11px] text-blue-100/80 font-medium">
                Keep it 100% free, fast & independent
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close support dialog"
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Friendly Message Banner */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 backdrop-blur-md">
          <p className="text-xs text-blue-100/90 leading-relaxed font-normal">
            Built with care by Arjun. If this converter helped you save on bank markups or calculate foreign exchange rates, consider contributing to support server hosting & domain costs!
          </p>
        </div>

        {/* Segmented Tabs (UPI default, Other Methods, Share Free) */}
        <div className="relative z-10 flex p-1 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("upi")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "upi"
                ? "bg-gradient-to-r from-blue-500/35 to-indigo-500/25 text-white shadow-md border border-blue-400/40 font-bold"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Smartphone size={13} className={activeTab === "upi" ? "text-blue-300" : ""} />
            <span>UPI (India)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("other")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "other"
                ? "bg-gradient-to-r from-indigo-500/35 to-purple-500/25 text-white shadow-md border border-indigo-400/40 font-bold"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <CreditCard size={13} className={activeTab === "other" ? "text-indigo-300" : ""} />
            <span>Other Methods</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("share")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "share"
                ? "bg-gradient-to-r from-emerald-500/35 to-teal-500/25 text-white shadow-md border border-emerald-400/40 font-bold"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Share2 size={13} className={activeTab === "share" ? "text-emerald-300" : ""} />
            <span>Share Free</span>
          </button>
        </div>

        {/* ================= TAB 1: UPI (India - Primary) ================= */}
        {activeTab === "upi" && (
          <div className="relative z-10 space-y-3.5">
            {/* Quick Amount Chips */}
            <div>
              <div className="text-[11px] font-semibold text-blue-100/70 mb-1.5 px-0.5">
                Choose Contribution Amount:
              </div>
              <div className="flex items-center gap-2">
                {[
                  { amount: "50", label: "₹50", desc: "Tea & Cheer" },
                  { amount: "100", label: "₹100", desc: "Server Boost" },
                  { amount: "500", label: "₹500", desc: "Domain Sponsor" },
                ].map((chip) => {
                  const isSelected = upiAmount === chip.amount;
                  return (
                    <button
                      key={chip.amount}
                      type="button"
                      onClick={() => setUpiAmount(chip.amount)}
                      className={`flex-1 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600/30 border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white font-bold"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-black">{chip.label}</div>
                      <div className="text-[10px] text-white/60">{chip.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UPI Container */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                  Instant Direct UPI
                </span>
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Zero Fees • Instant
                </span>
              </div>

              {/* Supported Apps */}
              <div className="flex items-center justify-between text-[11px] text-blue-100/80 px-1">
                <span>Google Pay • PhonePe • Paytm • BHIM</span>
                <ShieldCheck size={14} className="text-emerald-400" />
              </div>

              {/* UPI ID Field with Copy Button */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/15 p-2.5 rounded-xl">
                <span className="text-xs font-mono font-bold text-white flex-1 truncate select-all">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
                >
                  {copiedUpi ? (
                    <>
                      <Check size={13} className="text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Open in UPI App */}
              <a
                href={`upi://pay?pa=${upiId}&pn=Arjun&cu=INR&am=${upiAmount}`}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Smartphone size={14} />
                <span>Pay ₹{upiAmount} via UPI App (Mobile)</span>
              </a>
            </div>
          </div>
        )}

        {/* ================= TAB 2: Other Payment Methods (PayPal & Cards) ================= */}
        {activeTab === "other" && (
          <div className="relative z-10 space-y-3.5">
            {/* Quick Amount Chips */}
            <div>
              <div className="text-[11px] font-semibold text-blue-100/70 mb-1.5 px-0.5">
                Select Amount (USD):
              </div>
              <div className="flex items-center gap-2">
                {[
                  { amount: "5", label: "$5", desc: "Friendly Tip" },
                  { amount: "10", label: "$10", desc: "Supporter" },
                  { amount: "25", label: "$25", desc: "Patron" },
                ].map((chip) => {
                  const isSelected = paypalAmount === chip.amount;
                  return (
                    <button
                      key={chip.amount}
                      type="button"
                      onClick={() => setPaypalAmount(chip.amount)}
                      className={`flex-1 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600/30 border-indigo-400/60 shadow-[0_0_15px_rgba(99,102,241,0.3)] text-white font-bold"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-black">{chip.label}</div>
                      <div className="text-[10px] text-white/60">{chip.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PayPal Glass Card */}
            <a
              href={`${paypalUrl}/${paypalAmount}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-purple-600/10 hover:from-blue-600/30 hover:via-indigo-600/25 hover:to-purple-600/20 text-white border border-blue-400/35 backdrop-blur-xl shadow-[0_4px_25px_rgba(59,130,246,0.15)] flex items-center justify-between group transition-all duration-200 hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-sm shrink-0">
                  <Globe size={20} className="text-blue-300" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>PayPal & International Cards</span>
                  </div>
                  <div className="text-[11px] text-blue-100/70">
                    Visa, Mastercard, Amex, PayPal Balance
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-500 text-white font-bold text-xs shadow-md group-hover:bg-blue-400 transition-colors">
                <span>Send ${paypalAmount}</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-white/70 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>International transfers are encrypted and processed securely via PayPal.</span>
            </div>
          </div>
        )}

        {/* ================= TAB 3: Share Free ================= */}
        {activeTab === "share" && (
          <div className="relative z-10 space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Sparkles size={15} />
                <span>Zero Cost Ways to Support:</span>
              </div>
              <ul className="text-xs text-blue-100/80 space-y-2 pl-4 list-disc leading-relaxed">
                <li>Share this website with friends traveling or working internationally.</li>
                <li>Bookmark this converter for your future currency transfers.</li>
                <li>Share your ideas and feature requests using our Feedback button.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={shareWebsite}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check size={15} className="text-emerald-200" />
                  <span>Website Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 size={15} />
                  <span>Share Website Link with Friends</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/10 text-center text-[10px] text-white/50">
          All contributions go towards custom domain renewal & live API maintenance. Thank you!
        </div>
      </div>
    </div>
  );
}

export default memo(SupportModal);
