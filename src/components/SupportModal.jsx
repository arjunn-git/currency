import React, { useState, memo, useCallback } from "react";
import {
  Heart,
  Coffee,
  X,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Sparkles,
  QrCode,
  Smartphone,
} from "lucide-react";

function SupportModal({ isOpen, onClose }) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState("tip"); // 'tip' | 'upi' | 'share'

  // Default configuration (can be updated by Arjun anytime)
  const upiId = "arjuntaneja204@okaxis"; // Replace with your primary UPI ID
  const bmacUrl = "https://buymeacoffee.com/arjun"; // Replace with your BuyMeACoffee username
  const paypalUrl = "https://paypal.me/arjuntaneja204"; // Replace with your PayPal.me link

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
      text: "Check out this free, real-time mid-market currency converter with no bank markups!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user dismissed share dialog
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
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleUp text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Heart size={16} className="fill-rose-400 animate-pulse" />
            </div>
            <div>
              <h2 id="support-modal-title" className="text-sm sm:text-base font-bold text-white leading-tight">
                Support This Project
              </h2>
              <p className="text-[11px] text-slate-400">
                Help keep it 100% free, fast & ad-light
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close support dialog"
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Short friendly pitch */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3.5 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
          Built with care by Arjun. If this tool saved you money on bank exchange markups or helped with your calculations, consider tipping to cover server & domain expenses!
        </p>

        {/* Tab switcher */}
        <div className="flex p-1 bg-slate-950/60 rounded-xl mb-3.5 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("tip")}
            className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "tip"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Coffee size={13} />
            <span>Coffee / Card</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upi")}
            className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "upi"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone size={13} />
            <span>UPI (India)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("share")}
            className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "share"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Share2 size={13} />
            <span>Free Ways</span>
          </button>
        </div>

        {/* TAB 1: International Tip / Coffee */}
        {activeTab === "tip" && (
          <div className="space-y-2.5">
            {/* Buy Me A Coffee Button */}
            <a
              href={bmacUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg transition-transform active:scale-95 group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Coffee size={18} className="fill-slate-950" />
                <div className="text-left">
                  <div className="font-extrabold text-white drop-shadow-xs">Buy Me a Coffee</div>
                  <div className="text-[10px] text-amber-100 font-medium">Card, Apple Pay, Google Pay</div>
                </div>
              </div>
              <ExternalLink size={15} className="text-white group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* PayPal Option */}
            <a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-md transition-transform active:scale-95 group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Heart size={18} className="text-blue-200 fill-blue-200" />
                <div className="text-left">
                  <div className="font-extrabold text-white">Send via PayPal</div>
                  <div className="text-[10px] text-blue-200 font-medium">International tip & donations</div>
                </div>
              </div>
              <ExternalLink size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        )}

        {/* TAB 2: UPI for Indian Users (GPay, PhonePe, Paytm) */}
        {activeTab === "upi" && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/70 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                  Direct Zero-Fee UPI
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  GPay • PhonePe • Paytm
                </span>
              </div>

              {/* UPI ID Copy Field */}
              <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-xs font-mono font-bold text-white flex-1 truncate">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {copiedUpi ? (
                    <>
                      <Check size={12} className="text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mobile Direct Pay Link */}
              <div className="mt-2.5 text-center">
                <a
                  href={`upi://pay?pa=${upiId}&pn=Arjun&cu=INR`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
                >
                  <Smartphone size={12} />
                  <span>Tap to open in UPI App (Mobile only)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Free Ways to Support */}
        {activeTab === "share" && (
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Sparkles size={14} />
                <span>Zero Cost Ways to Help Arjun:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc">
                <li>Share this website with friends, travelers, or freelance colleagues.</li>
                <li>Bookmark this tool for whenever you make cross-border payments.</li>
                <li>Give feedback or feature suggestions in our feedback box!</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={shareWebsite}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="text-emerald-200" />
                  <span>Website Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share Website with Friends</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Every contribution goes directly towards custom domain renewal & data API hosting. Thank you!
        </div>
      </div>
    </div>
  );
}

export default memo(SupportModal);
