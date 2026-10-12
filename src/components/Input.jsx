import React, { useId, memo } from "react";
import CurrencyPicker from "./CurrencyPicker";

function Input({
  label,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectedCurrency = "usd",
  amountDisabled = false,
  currencyDisabled = false,
  disabled = false,
  className = "",
}) {
  const amountInputId = useId();
  const isSelectDisabled = disabled || currencyDisabled;

  return (
    <div
      className={`bg-slate-800/70 border border-slate-700/70 rounded-2xl p-3.5 sm:p-4 transition-all duration-150 hover:border-slate-600 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${
        disabled ? "opacity-75" : ""
      } ${className}`}
    >
      <div className="flex justify-between items-center mb-1.5">
        <label
          htmlFor={amountInputId}
          className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider"
        >
          {label}
        </label>
        {amountDisabled && (
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Converted Result
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Number Input */}
        <div className="flex-1 min-w-0">
          <input
            id={amountInputId}
            type={amountDisabled ? "text" : "number"}
            readOnly={amountDisabled}
            placeholder="0.00"
            disabled={disabled}
            value={amount !== undefined && amount !== null ? amount : ""}
            onChange={(e) => {
              if (onAmountChange) {
                onAmountChange(e.target.value);
              }
            }}
            min="0"
            step="any"
            className="w-full bg-transparent text-xl sm:text-2xl font-black text-white outline-none placeholder-slate-500 disabled:cursor-not-allowed tracking-tight"
          />
        </div>

        {/* Currency Picker Button */}
        <div className="w-[140px] sm:w-[160px] shrink-0">
          <CurrencyPicker
            selectedCurrency={selectedCurrency}
            onSelect={(curr) => onCurrencyChange && onCurrencyChange(curr)}
            currencyOptions={currencyOptions}
            disabled={isSelectDisabled}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Input);
