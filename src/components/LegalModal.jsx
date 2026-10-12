import React, { useState } from "react";
import { X, Shield, FileText, HelpCircle, Mail } from "lucide-react";

export default function LegalModal() {
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
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-medium">
            support@yourdomain.com
          </div>
          <p className="text-xs text-gray-500">
            We typically respond within 24–48 business hours.
          </p>
        </div>
      ),
    },
  };

  return (
    <>
      {/* Footer trigger links */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-[11px] text-white/70">
        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("disclaimer")}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Affiliate Disclaimer
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("terms")}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Terms of Use
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Contact
        </button>
      </div>

      {/* Modal dialog */}
      {activeTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                {React.createElement(tabs[activeTab].icon, { size: 18, className: "text-blue-600" })}
                {tabs[activeTab].title}
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
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
