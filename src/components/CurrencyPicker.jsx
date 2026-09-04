import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, Check } from "lucide-react";
import { CURRENCIES, getCurrencyMeta } from "../data/currencies";

export default function CurrencyPicker({
  selectedCurrency,
  onSelect,
  currencyOptions = [],
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const selectedMeta = getCurrencyMeta(selectedCurrency);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filter currency list based on search query
  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    const options = currencyOptions.length > 0 ? currencyOptions : Object.keys(CURRENCIES);

    if (!q) return options;

    return options.filter((code) => {
      const lowerCode = code.toLowerCase();
      const meta = CURRENCIES[code.toUpperCase()];
      const name = meta?.name?.toLowerCase() || "";
      return lowerCode.includes(q) || name.includes(q);
    });
  }, [search, currencyOptions]);

  return (
    <>
      {/* Selector Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between gap-2.5 px-3 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-xl border border-gray-200/80 shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed group w-full text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0 leading-none">{selectedMeta.flag}</span>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm sm:text-base text-gray-900 tracking-wide">
              {selectedCurrency.toUpperCase()}
            </span>
            <span className="text-[11px] text-gray-500 truncate max-w-[110px] sm:max-w-[130px]">
              {selectedMeta.name}
            </span>
          </div>
        </div>
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors text-xs">
          ▼
        </span>
      </button>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Select Currency</h3>
                <p className="text-xs text-gray-500">Choose from 160+ world currencies</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-gray-100 bg-gray-50/50">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-3 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search currency, country, or code..."
                  className="w-full pl-9 pr-8 py-2 bg-white text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder-gray-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Currencies List */}
            <div className="overflow-y-auto p-2 divide-y divide-gray-50 flex-1">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No currencies match "{search}"
                </div>
              ) : (
                filteredOptions.map((code) => {
                  const upper = code.toUpperCase();
                  const meta = getCurrencyMeta(code);
                  const isSelected = upper === selectedCurrency.toUpperCase();

                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onSelect(code.toLowerCase());
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 ${
                        isSelected
                          ? "bg-blue-50 text-blue-900 font-semibold"
                          : "hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl leading-none">{meta.flag}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold flex items-center gap-1.5">
                            {upper}
                            {meta.symbol && (
                              <span className="text-xs font-normal text-gray-500">
                                ({meta.symbol})
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {meta.name}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <Check size={18} className="text-blue-600 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
