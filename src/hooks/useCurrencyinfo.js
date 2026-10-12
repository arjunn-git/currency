import { useCallback, useEffect, useRef, useState } from "react";

const CACHE_KEY_PREFIX = "cc_rates_v2_";
const CACHE_TTL_MS = 30 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8_000;

// Instant fallback baseline rates for 0ms initial render without network blocking
const BASELINE_RATES = {
  usd: 1,
  inr: 88.65,
  eur: 0.92,
  gbp: 0.79,
  jpy: 153.2,
  cad: 1.38,
  aud: 1.53,
  aed: 3.67,
  cny: 7.24,
  sgd: 1.32,
  chf: 0.88,
};

function formatProviderTime(value) {
  if (!value) return null;
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeRates(rates) {
  if (!rates || typeof rates !== "object") return {};
  return Object.fromEntries(
    Object.entries(rates)
      .filter(([, value]) => Number.isFinite(Number(value)) && Number(value) > 0)
      .map(([code, value]) => [code.toLowerCase(), Number(value)])
  );
}

function readCache(base) {
  try {
    const cached = JSON.parse(localStorage.getItem(`${CACHE_KEY_PREFIX}${base}`) || "null");
    if (cached?.rates && Object.keys(cached.rates).length > 0) return cached;
  } catch {
    // Storage may be disabled or contain invalid JSON
  }
  return null;
}

function useCurrencyInfo(baseCurrency) {
  const base = (baseCurrency || "usd").toLowerCase();
  const requestId = useRef(0);

  // Synchronous initial state: Zero wait time on first paint!
  const [data, setData] = useState(() => {
    const cached = readCache(base);
    return cached?.rates || (base === "usd" ? BASELINE_RATES : {});
  });

  const [loading, setLoading] = useState(() => {
    const cached = readCache(base);
    return !(cached?.rates && Date.now() - cached.fetchedAt < CACHE_TTL_MS);
  });

  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => {
    const cached = readCache(base);
    return cached?.providerUpdatedAt || null;
  });
  const [isStale, setIsStale] = useState(false);

  const fetchCurrencyData = useCallback(async (forceRefresh = false) => {
    const currentRequest = ++requestId.current;
    const cached = readCache(base);

    if (!forceRefresh && cached?.rates && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      setData(cached.rates);
      setLastUpdated(cached.providerUpdatedAt || formatProviderTime(cached.fetchedAt));
      setIsStale(false);
      setError(null);
      setLoading(false);
      return;
    }

    if (!cached?.rates) {
      setLoading(true);
    }
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${base.toUpperCase()}`,
        { signal: controller.signal, headers: { Accept: "application/json" } }
      );

      if (!response.ok) throw new Error(`Status ${response.status}`);
      const payload = await response.json();
      if (payload.result !== "success" || !payload.rates) {
        throw new Error("Invalid exchange-rate feed response");
      }

      const normalized = normalizeRates(payload.rates);
      if (!Object.keys(normalized).length || !normalized[base]) {
        throw new Error("No usable rates returned");
      }

      const providerUpdatedAt = formatProviderTime(payload.time_last_update_utc);
      const record = {
        rates: normalized,
        fetchedAt: Date.now(),
        providerUpdatedAt,
      };

      if (currentRequest !== requestId.current) return;
      setData(normalized);
      setLastUpdated(providerUpdatedAt || "Live");
      setIsStale(false);
      setError(null);

      try {
        localStorage.setItem(`${CACHE_KEY_PREFIX}${base}`, JSON.stringify(record));
      } catch {
        // Storage full or private mode
      }
    } catch (fetchError) {
      if (currentRequest !== requestId.current) return;
      if (cached?.rates && Object.keys(cached.rates).length > 0) {
        setData(cached.rates);
        setLastUpdated(cached.providerUpdatedAt || formatProviderTime(cached.fetchedAt));
        setIsStale(true);
      } else {
        setError(
          fetchError.name === "AbortError"
            ? "Exchange-rate request timed out. Retrying in background..."
            : "Showing offline reference rates."
        );
        setIsStale(true);
      }
    } finally {
      clearTimeout(timeoutId);
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    fetchCurrencyData();
    return () => {
      requestId.current += 1;
    };
  }, [fetchCurrencyData]);

  const refetch = useCallback(() => fetchCurrencyData(true), [fetchCurrencyData]);
  return { data, loading, error, lastUpdated, isStale, refetch };
}

export default useCurrencyInfo;
