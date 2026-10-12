import React, { useState, memo } from "react";
import { X, Shield, FileText, HelpCircle, Mail } from "lucide-react";

function LegalModal() {
  const [activeTab, setActiveTab] = useState(null);

  const tabs = {
    privacy: {
      title: "Privacy Policy",
      icon: Shield,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p>
            Your privacy is important to us. This Currency Converter application operates purely in your browser and does not collect or sell your personal data.
          </p>
          <h4 className="font-bold text-gray-800">1. Information Collection</h4>
          <p>
            We do not require user accounts. Standard anonymous device metrics or localStorage may be used to cache currency rates to reduce network usage.
          </p>
          <h4 className="font-bold text-gray-800">2. Cookies & Third-Party Services</h4>
          <p>
            Third-party services such as Google AdSense and analytics partners may use cookies to serve relevant advertisements and analyze site traffic. You may opt out of personalized ads via Google Ad Settings.
          </p>
        </div>
      ),
    },
    disclaimer: {
      title: "Affiliate & Financial Disclaimer",
      icon: FileText,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p>
            <strong>Informational Purposes Only:</strong> The exchange rates provided are mid-market rates for informational and comparison purposes. They do not constitute financial advice. Actual transaction rates offered by commercial banks or money-transfer providers may include spreads and fees.
          </p>
          <p>
            <strong>Affiliate Disclosure:</strong> Some links on this site are affiliate links. If you click through and initiate a transfer or sign up, we may receive a commission at no additional cost to you. This supports our free tool.
          </p>
        </div>
      ),
    },
    terms: {
      title: "Terms of Service",
      icon: HelpCircle,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p>
            By using this currency conversion tool, you agree to these terms.
          </p>
          <p>
            We provide exchange rate data "as is" without warranty of continuous uptime or absolute precision. In no event shall the creators be liable for financial decisions or transactions made based on the data provided.
          </p>
        </div>
      ),
    },
    contact: {
      title: "Contact Us",
      icon: Mail,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p>
            Have feedback, feature requests, or partnership inquiries? Reach out to us anytime!
          </p>
          <a
            href="mailto:arjuntaneja204@gmail.com"
            className="block p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-900 font-medium transition-colors"
          >
            arjuntaneja204@gmail.com
          </a>
          <p className="text-xs text-gray-500">
            We typically respond within 24–48 business hours.
          </p>
        </div>
      ),
    },
  };

  // Close on Escape key
  React.useEffect(() => {
    if (!activeTab) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveTab(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  return (
    <>
      {/* Footer trigger links */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-[11px] text-white/70">
        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          aria-haspopup="dialog"
          aria-expanded={activeTab === "privacy"}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("disclaimer")}
          aria-haspopup="dialog"
          aria-expanded={activeTab === "disclaimer"}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Affiliate Disclaimer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("terms")}
          aria-haspopup="dialog"
          aria-expanded={activeTab === "terms"}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Terms of Use
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          aria-haspopup="dialog"
          aria-expanded={activeTab === "contact"}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Contact
        </button>
      </div>

      {/* Modal dialog */}
      {activeTab && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveTab(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-dialog-title"
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <h2 id="legal-dialog-title" className="text-base font-bold text-gray-900 flex items-center gap-2">
                {React.createElement(tabs[activeTab].icon, { size: 18, "aria-hidden": "true", className: "text-blue-600" })}
                {tabs[activeTab].title}
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab(null)}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1">
              {tabs[activeTab].content}
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab(null)}
                className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(LegalModal);
