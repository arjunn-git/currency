import React, { useState, memo } from "react";
import { ChevronDown, HelpCircle, BookOpen, Globe } from "lucide-react";

function SeoContent() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How often are exchange rates updated?",
      a: "Our currency converter fetches real-time mid-market exchange rates directly from financial provider feeds. Data is refreshed regularly and cached locally for up to 30 minutes to ensure fast loading and responsive conversions."
    },
    {
      q: "What is the difference between mid-market rates and bank rates?",
      a: "The mid-market rate (also called the interbank rate) is the true midpoint between global supply and demand. Commercial banks and airport kiosks typically add a hidden markup of 2% to 5% above the mid-market rate. Our tool shows you the real mid-market rate so you can see the true value."
    },
    {
      q: "Is this currency converter free to use?",
      a: "Yes, 100% free! You can convert over 160 world currencies anytime with no registration, no subscription, and no hidden fees."
    },
    {
      q: "Can I convert currencies while offline?",
      a: "Yes. Our application securely stores the latest fetched exchange rates in your browser cache. If your internet connection drops, you can still view and calculate conversions using your last saved rates."
    }
  ];

  return (
    <section className="w-full max-w-lg mt-8 text-white space-y-6">
      {/* Informational SEO Guide */}
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-5 sm:p-6 shadow-xl border border-white/25">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 mb-3 text-white">
          <BookOpen size={18} className="text-blue-300" />
          About Live Currency Conversion
        </h2>
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-3">
          Whether you are an international traveler, a freelance professional receiving foreign payments, or someone sending money to family abroad, our real-time currency calculator gives you accurate mid-market foreign exchange rates across 160+ world currencies including USD, EUR, GBP, INR, CAD, AUD, and JPY.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-100/90 pt-2 border-t border-white/15">
          <div className="flex items-center gap-1.5">
            <Globe size={13} className="text-emerald-300" />
            <span>160+ Global Currencies</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-300">✓</span>
            <span>Real Mid-Market Data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-300">✓</span>
            <span>Zero Hidden Markup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-300">✓</span>
            <span>Instant One-Click Copy</span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section for Google Search Snippets */}
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-5 sm:p-6 shadow-xl border border-white/25">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 mb-4 text-white">
          <HelpCircle size={18} className="text-amber-300" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white/10 border border-white/15 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-3 text-left text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-300" : "text-white/60"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 text-xs text-white/80 leading-relaxed border-t border-white/10 pt-2 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(SeoContent);
