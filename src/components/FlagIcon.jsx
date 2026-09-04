import React, { useState } from "react";

const SPECIAL_FLAGS = {
  EUR: "eu",
  ANG: "nl",
  XAF: "cm",
  XCD: "ag",
  XOF: "sn",
  XPF: "pf",
  BTC: null,
};

export default function FlagIcon({ currencyCode, className = "w-6 h-4" }) {
  const [error, setError] = useState(false);
  const code = (currencyCode || "").toUpperCase();

  const countryCode =
    SPECIAL_FLAGS[code] !== undefined
      ? SPECIAL_FLAGS[code]
      : code.slice(0, 2).toLowerCase();

  if (error || !countryCode) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase shadow-xs shrink-0 ${className}`}
      >
        {code.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      alt={`${code} flag`}
      className={`inline-block object-cover rounded shadow-xs border border-black/10 shrink-0 ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
