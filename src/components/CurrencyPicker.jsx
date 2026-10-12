import React, { useState, useMemo, useEffect, useRef, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, X, Check, ChevronDown } from "lucide-react";
import { CURRENCIES, getCurrencyMeta } from "../data/currencies";
import FlagIcon from "./FlagIcon";

const PAGE_SIZE = 30;

function CurrencyPicker({
  selectedCurrency,
  onSelect,
  currencyOptions = [],
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const inputRef = useRef(null);

  const selectedMeta = getCurrencyMeta(selectedCurrency);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setVisibleCount(PAGE_SIZE);
      const timer = setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      setSearch("");
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filter currency list based on search query (only when modal is open)
  const filteredOptions = useMemo(() => {
    if (!isOpen) return [];
    const q = search.trim().toLowerCase();
    const options = currencyOptions.length > 0 ? currencyOptions : Object.keys(CURRENCIES);

    if (!q) return options;

    return options.filter((code) => {
      const lowerCode = code.toLowerCase();
      const meta = CURRENCIES[code.toUpperCase()];
      const name = meta?.name?.toLowerCase() || "";
      return lowerCode.includes(q) || name.includes(q);
    });
  }, [isOpen, search, currencyOptions]);

  // Load more items as user scrolls down
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 120) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredOptions.length));
    }
  }, [filteredOptions.length]);

  const displayedOptions = useMemo(() => {
    return filteredOptions.slice(0, visibleCount);
  }, [filteredOptions, visibleCount]);

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-indigo-50/70">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Select Currency
            </h3>
            <p className="text-xs text-gray-500">
              Choose from 160+ world currencies
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-100 bg-gray-50/60">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search by code, country, or name..."
              className="w-full pl-9 pr-8 py-2 bg-white text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setVisibleCount(PAGE_SIZE);
                }}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Currencies List (Paginated / Virtualized for 60fps performance) */}
        <div
          onScroll={handleScroll}
          className="overflow-y-auto p-2 divide-y divide-gray-50 flex-1 max-h-[50vh] overscroll-contain"
        >
          {filteredOptions.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              No currencies match "{search}"
            </div>
          ) : (
            displayedOptions.map((code) => {
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
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors duration-100 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 text-blue-900 font-semibold"
                      : "hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FlagIcon currencyCode={upper} className="w-7 h-5 shadow-xs" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold flex items-center gap-1.5 text-gray-900">
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
  ) : null;

  return (
    <>
      {/* Selector Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between gap-2 px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl border border-white/20 shadow-sm backdrop-blur-md hover:border-white/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed group w-full text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FlagIcon currencyCode={selectedCurrency} className="w-6 h-4" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm sm:text-base text-white tracking-wide leading-tight drop-shadow-xs">
              {selectedCurrency.toUpperCase()}
            </span>
            <span className="text-[11px] text-blue-100/80 truncate max-w-[95px] sm:max-w-[110px]">
              {selectedMeta.name}
            </span>
          </div>
        </div>
        <ChevronDown
          size={16}
          className="text-white/70 group-hover:text-white transition-colors shrink-0"
        />
      </button>

      {/* Render modal directly into document.body */}
      {typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}

export default memo(CurrencyPicker);
