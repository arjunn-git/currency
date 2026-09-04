import React, { useMemo, useState } from "react";
import {
  ArrowUpDown,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import Input from "./components/Input";
import FlagIcon from "./components/FlagIcon";
import useCurrencyInfo from "./hooks/useCurrencyinfo";
import { POPULAR_PAIRS } from "./data/currencies";
import "./App.css";
import src from "./assets/images/bg.jpg";

function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [copied, setCopied] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const { data: currencyInfo, loading, error, lastUpdated, refetch } = useCurrencyInfo(from);

  // Available currency options from API rates or default fallback
  const currencyOptions = useMemo(() => {
    const keys = Object.keys(currencyInfo);
    return keys.length > 0 ? keys : [from, to];
  }, [currencyInfo, from, to]);

  // Real-time instantaneous conversion calculation
  const convertedAmount = useMemo(() => {
    if (!currencyInfo[to] || amount === "" || Number(amount) <= 0) return 0;
    return Number(amount) * currencyInfo[to];
  }, [amount, to, currencyInfo]);

  // Single unit exchange rate
  const unitRate = currencyInfo[to] || 0;
  const inverseUnitRate = unitRate > 0 ? 1 / unitRate : 0;

  const isConversionReady = Boolean(currencyInfo[to] && Number(amount) > 0);

  const handleAmountChange = (val) => {
    setAmount(val);
  };

  const swap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);
    setFrom(to);
    setTo(from);
  };

  const selectPopularPair = (pFrom, pTo) => {
    setFrom(pFrom.toLowerCase());
    setTo(pTo.toLowerCase());
  };

  const copyToClipboard = async () => {
    if (!isConversionReady) return;

    try {
      const formatted = `${formatNumber(convertedAmount)} ${to.toUpperCase()}`;
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Format currency numbers nicely with locale commas
  const formatNumber = (num) => {
    if (!num || isNaN(num)) return "0.00";
    if (num < 0.0001) return num.toFixed(6);
    if (num < 1) return num.toFixed(4);
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(num);
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat px-3 sm:px-4 py-8 relative selection:bg-blue-500 selection:text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url(${src})`,
      }}
    >
      {/* Main Container */}
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/25 rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/30 ring-1 ring-black/5 transition-all">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                Currency Converter
              </h1>
              <p className="text-xs text-blue-100 font-medium flex items-center gap-1">
                <TrendingUp size={12} /> Live exchange rates
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
              title="Refresh live exchange rates"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/90 border border-red-400 text-white rounded-xl text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm shadow-md">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Popular Pairs Chips */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-blue-100/90 mb-2 uppercase tracking-wider">
              Popular Pairs
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_PAIRS.map((pair) => {
                const isActive =
                  from.toUpperCase() === pair.from && to.toUpperCase() === pair.to;
                return (
                  <button
                    key={`${pair.from}-${pair.to}`}
                    type="button"
                    onClick={() => selectPopularPair(pair.from, pair.to)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white text-blue-900 shadow font-bold scale-105"
                        : "bg-white/20 hover:bg-white/30 text-white border border-white/20"
                    }`}
                  >
                    <FlagIcon currencyCode={pair.from} className="w-4 h-2.5" />
                    <span>{pair.from} → {pair.to}</span>
                    <FlagIcon currencyCode={pair.to} className="w-4 h-2.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Converter Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            {/* From Input */}
            <div className="w-full mb-2">
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

            {/* Swap Button Divider */}
            <div className="relative w-full h-2 my-4 flex justify-center items-center">
              <div className="w-full border-t border-white/20"></div>
              <button
                type="button"
                onClick={swap}
                disabled={loading}
                className={`absolute p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 ${
                  isSwapping ? "rotate-180" : ""
                }`}
                title="Swap currencies"
              >
                <ArrowUpDown size={18} />
              </button>
            </div>

            {/* To Input */}
            <div className="w-full mb-4">
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

            {/* Live Exchange Rate & Inverse Summary Card */}
            {unitRate > 0 && !loading && (
              <div className="mb-4 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white shadow-inner">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <FlagIcon currencyCode={from} className="w-5 h-3.5" />
                    <span>1 {from.toUpperCase()} =</span>
                  </span>
                  <span className="font-bold text-blue-100 flex items-center gap-1.5">
                    <span>{formatNumber(unitRate)} {to.toUpperCase()}</span>
                    <FlagIcon currencyCode={to} className="w-5 h-3.5" />
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-white/70">
                  <span>Inverse rate:</span>
                  <span>
                    1 {to.toUpperCase()} = {formatNumber(inverseUnitRate)} {from.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Copy Button */}
            {isConversionReady && (
              <button
                type="button"
                onClick={copyToClipboard}
                className="w-full py-2.5 px-4 mb-3 bg-white/90 hover:bg-white text-gray-800 rounded-xl font-semibold text-sm transition-all duration-150 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="text-gray-600" />
                    <span>Copy Converted Amount</span>
                  </>
                )}
              </button>
            )}

            {/* Footer Status Bar */}
            <div className="flex justify-between items-center text-[11px] text-blue-100 font-medium px-1">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {loading ? "Updating rates..." : `Updated: ${lastUpdated || "Live"}`}
              </span>
              <span>160+ Currencies Supported</span>
            </div>
          </form>
        </div>

        {/* Brand note / footer */}
        <p className="text-center text-white/70 text-xs mt-4 drop-shadow">
          Real-Time Currency Converter • Free & Instant
        </p>
      </div>
    </div>
  );
}

export default App;
