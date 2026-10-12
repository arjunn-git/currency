import React, { useMemo, useState, useCallback } from "react";
import {
  ArrowUpDown,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Zap,
  Bell,
  MessageSquarePlus,
  HelpCircle,
  X,
} from "lucide-react";
import Input from "./components/Input";
import useCurrencyInfo from "./hooks/useCurrencyinfo";
import { POPULAR_PAIRS } from "./data/currencies";
import TransferAffiliate from "./components/TransferAffiliate";
import RateAlertCard from "./components/RateAlertCard";
import AdBanner from "./components/AdBanner";
import LegalModal from "./components/LegalModal";
import SeoContent from "./components/SeoContent";
import UserFeedback from "./components/UserFeedback";
import bgImage from "./assets/images/bg.jpg";
import "./App.css";

function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [copied, setCopied] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'compare' | 'alert' | 'feedback' | 'faq' | null

  const { data: currencyInfo, loading, error, lastUpdated, refetch } = useCurrencyInfo(from);

  // Available currency options from API rates or default fallback
  const currencyOptions = useMemo(() => {
    const keys = Object.keys(currencyInfo);
    return keys.length > 0 ? keys : [from, to];
  }, [currencyInfo, from, to]);

  // Real-time instantaneous conversion calculation
  const convertedAmount = useMemo(() => {
    const num = parseFloat(amount);
    if (!currencyInfo[to] || isNaN(num) || num <= 0) return 0;
    return num * currencyInfo[to];
  }, [amount, to, currencyInfo]);

  // Single unit exchange rate
  const unitRate = currencyInfo[to] || 0;
  const isConversionReady = Boolean(currencyInfo[to] && parseFloat(amount) > 0);

  const handleAmountChange = useCallback((val) => {
    setAmount(val);
  }, []);

  const swap = useCallback(() => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 250);
    setFrom((prevFrom) => {
      setTo(prevFrom);
      return to;
    });
  }, [to]);

  const selectPopularPair = useCallback((pFrom, pTo) => {
    setFrom(pFrom.toLowerCase());
    setTo(pTo.toLowerCase());
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!isConversionReady) return;

    try {
      const formatted = `${formatNumber(convertedAmount)} ${to.toUpperCase()}`;
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }, [isConversionReady, convertedAmount, to]);

  // Format currency numbers nicely with locale commas
  const formatNumber = useCallback((num) => {
    if (!num || isNaN(num)) return "0.00";
    if (num < 0.0001) return num.toFixed(6);
    if (num < 1) return num.toFixed(4);
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(num);
  }, []);

  return (
    <div
      className="w-full min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between items-center px-3 sm:px-4 py-5 sm:py-8 relative overflow-x-hidden selection:bg-blue-600 selection:text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 16, 30, 0.52), rgba(10, 16, 30, 0.68)), url(${bgImage})`,
      }}
    >
      {/* High-performance CSS ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[350px] h-[350px] bg-indigo-600/15 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 my-auto">
        
        {/* Sleek App Header */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-sm">
              Currency Converter
            </h1>
            <p className="text-xs text-blue-100/70 font-medium mt-0.5">Real-time mid-market rates</p>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            title="Refresh exchange rates"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-3 p-3 bg-red-950/80 border border-red-800/60 text-red-200 rounded-xl text-xs flex items-center gap-2 backdrop-blur-md">
            <span>{error}</span>
          </div>
        )}

        {/* The Main Frosted Glassmorphism Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          
          {/* Quick Popular Pairs Chips (Scrollbar completely hidden) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 border-b border-white/10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {POPULAR_PAIRS.map((pair) => {
              const isActive =
                from.toUpperCase() === pair.from && to.toUpperCase() === pair.to;
              return (
                <button
                  key={`${pair.from}-${pair.to}`}
                  type="button"
                  onClick={() => selectPopularPair(pair.from, pair.to)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? "bg-blue-600/90 text-white shadow-md shadow-blue-500/30 font-bold border border-blue-400/50"
                      : "bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 backdrop-blur-md"
                  }`}
                >
                  <span>{pair.from}</span>
                  <span className="text-white/60">→</span>
                  <span>{pair.to}</span>
                </button>
              );
            })}
          </div>

          {/* Converter Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            {/* From Input */}
            <div className="mb-1.5">
              <Input
                label="You Send"
                amount={amount}
                currencyOptions={currencyOptions}
                onCurrencyChange={setFrom}
                selectedCurrency={from}
                onAmountChange={handleAmountChange}
                disabled={loading}
              />
            </div>

            {/* Centered Swap Button */}
            <div className="relative w-full h-4 my-2 flex justify-center items-center">
              <div className="w-full border-t border-white/10" />
              <button
                type="button"
                onClick={swap}
                disabled={loading}
                title="Swap currencies"
                className={`absolute p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xl shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 ${
                  isSwapping ? "rotate-180" : ""
                }`}
              >
                <ArrowUpDown size={15} />
              </button>
            </div>

            {/* To Input */}
            <div className="mb-3.5">
              <Input
                label="You Receive"
                amount={formatNumber(convertedAmount)}
                currencyOptions={currencyOptions}
                onCurrencyChange={setTo}
                amountDisabled={true}
                selectedCurrency={to}
                disabled={loading}
              />
            </div>

            {/* Instant Rate Summary & Copy Pill Bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-xs shadow-inner">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-100/70">
                  Mid-Market Rate
                </span>
                <span className="font-bold text-white text-xs sm:text-sm truncate drop-shadow-xs">
                  1 {from.toUpperCase()} = {formatNumber(unitRate)} {to.toUpperCase()}
                </span>
              </div>

              {isConversionReady && (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0 border border-blue-400/40"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Status note */}
            <div className="flex justify-between items-center text-[10px] text-blue-100/70 mt-2 px-1">
              <span>{loading ? "Updating..." : lastUpdated ? `Updated: ${lastUpdated}` : "Real-time rates"}</span>
              <span>160+ Currencies Supported</span>
            </div>
          </form>
        </div>

        {/* Clean Secondary Utilities Bar (Frosted Glass Pills) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveModal("compare")}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Zap size={13} className="text-amber-300 fill-amber-300" />
            <span>Compare Fees</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("alert")}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Bell size={13} className="text-yellow-300" />
            <span>Rate Alert</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("feedback")}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <MessageSquarePlus size={13} className="text-blue-300" />
            <span>Feedback</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal("faq")}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <HelpCircle size={13} className="text-emerald-300" />
            <span>FAQ & Info</span>
          </button>
        </div>

        {/* Ad Banner placeholder */}
        <AdBanner slot="1234567890" />

        {/* Footer & Compliance */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Real-Time Currency Converter • Free & Instant
          </p>
          <LegalModal />
        </div>
      </div>

      {/* ================= MODALS SYSTEM (Uncluttered) ================= */}
      {/* 1. Compare Fees Modal */}
      {activeModal === "compare" && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                Bank Fees vs. Mid-Market Transfers
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <TransferAffiliate
              from={from}
              to={to}
              amount={amount}
              convertedAmount={convertedAmount}
            />
          </div>
        </div>
      )}

      {/* 2. Rate Alert Modal */}
      {activeModal === "alert" && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell size={16} className="text-yellow-400" />
                Set Exchange Rate Alert
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <RateAlertCard
              from={from}
              to={to}
              currentRate={formatNumber(unitRate)}
            />
          </div>
        </div>
      )}

      {/* 3. Feedback Modal */}
      <UserFeedback
        isOpen={activeModal === "feedback"}
        onClose={() => setActiveModal(null)}
        hideTrigger={true}
      />

      {/* 4. FAQ & SEO Guide Modal */}
      {activeModal === "faq" && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle size={16} className="text-emerald-400" />
                Currency Guide & FAQs
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <SeoContent />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
