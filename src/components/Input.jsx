import React, { useId } from "react";
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
      className={`bg-white/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-white/40 transition-all duration-200 hover:shadow-xl ${
        disabled ? "opacity-70" : ""
      } ${className}`}
    >
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={amountInputId}
          className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider"
        >
          {label}
        </label>
        {amountDisabled && (
          <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
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
            className="w-full bg-transparent text-xl sm:text-2xl font-bold text-gray-900 outline-none placeholder-gray-400 disabled:cursor-not-allowed tracking-tight"
          />
        </div>

        {/* Currency Picker Button */}
        <div className="w-[145px] sm:w-[170px] shrink-0">
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

export default Input;
