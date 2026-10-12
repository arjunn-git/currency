import React, { memo } from "react";
import { ExternalLink, ShieldCheck, Zap } from "lucide-react";

function TransferAffiliate({ from, to, amount, convertedAmount }) {
  const fromCode = (from || "USD").toUpperCase();
  const toCode = (to || "INR").toUpperCase();
  const parsedAmount = parseFloat(amount) || 1;

  // Potential savings calculation (banks typically take 2-4% in hidden markup)
  const estimatedBankMarkupPercent = 3.2;
  const estimatedSavings = (parsedAmount * (estimatedBankMarkupPercent / 100)).toFixed(2);

  // Affiliate link config (replace with actual Wise/Remitly partner link when approved)
  const affiliateUrl = `https://wise.com/?sourceCurrency=${fromCode}&targetCurrency=${toCode}`;

  return (
    <div className="w-full mt-4 p-4 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 text-white shadow-lg transition-all hover:bg-white/25">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
          <Zap size={14} className="fill-amber-300" />
          <span>Save on International Transfers</span>
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
          Partner
        </span>
      </div>

      <p className="text-xs text-white/90 leading-relaxed mb-3">
        Sending <strong className="text-white">{parsedAmount} {fromCode}</strong> abroad? Traditional banks charge up to <strong className="text-amber-200">3-5%</strong> in hidden markup. Save an estimated <strong className="text-emerald-300">~{estimatedSavings} {fromCode}</strong> using low-fee mid-market transfers.
      </p>

      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95 group"
      >
        <span>Compare Transfer & Save</span>
        <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </a>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-[10px] text-white/70">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-emerald-300" />
          Regulated & Encrypted
        </span>
        <span>*Free comparison link</span>
      </div>
    </div>
  );
}

export default memo(TransferAffiliate);
