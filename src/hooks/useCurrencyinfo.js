import { useCallback, useEffect, useRef, useState } from "react";

const CACHE_KEY_PREFIX = "cc_rates_v2_";
const CACHE_TTL_MS = 30 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 12_000;

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
    // Storage may be disabled or contain invalid JSON; continue without cache.
  }
  return null;
}

function useCurrencyInfo(baseCurrency) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const requestId = useRef(0);
  const base = (baseCurrency || "usd").toLowerCase();

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

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      // This public endpoint does not require a browser-exposed API key.
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${base.toUpperCase()}`,
        { signal: controller.signal, headers: { Accept: "application/json" } }
      );

      if (!response.ok) throw new Error(`Exchange-rate service returned ${response.status}.`);
      const payload = await response.json();
      if (payload.result !== "success" || !payload.rates) {
        throw new Error("The exchange-rate service returned an invalid response.");
      }

      const normalized = normalizeRates(payload.rates);
      if (!Object.keys(normalized).length || !normalized[base]) {
        throw new Error("No usable exchange rates were returned.");
      }

      const providerUpdatedAt = formatProviderTime(payload.time_last_update_utc);
      const providerNextUpdateAt = formatProviderTime(payload.time_next_update_utc);
      const record = {
        rates: normalized,
        fetchedAt: Date.now(),
        providerUpdatedAt,
        providerNextUpdateAt,
      };

      if (currentRequest !== requestId.current) return;
      setData(normalized);
      setLastUpdated(providerUpdatedAt || "Time not provided by provider");
      setIsStale(false);
      setError(null);
      try {
        localStorage.setItem(`${CACHE_KEY_PREFIX}${base}`, JSON.stringify(record));
      } catch {
        // Private browsing or storage limits should not prevent conversion.
      }
    } catch (fetchError) {
      if (currentRequest !== requestId.current) return;
      if (cached?.rates && Object.keys(cached.rates).length > 0) {
        setData(cached.rates);
        setLastUpdated(cached.providerUpdatedAt || formatProviderTime(cached.fetchedAt));
        setIsStale(true);
        setError("Couldn't refresh exchange rates. Showing saved rates, which may be out of date.");
      } else {
        setError(
          fetchError.name === "AbortError"
            ? "The exchange-rate request timed out. Please try again."
            : "Unable to load exchange rates. Check your connection and try again."
        );
        setIsStale(false);
      }
    } finally {
      clearTimeout(timeoutId);
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    fetchCurrencyData();
    return () => {
      // Ignore late responses after the selected base currency changes or unmounts.
      requestId.current += 1;
    };
  }, [fetchCurrencyData]);

  const refetch = useCallback(() => fetchCurrencyData(true), [fetchCurrencyData]);
  return { data, loading, error, lastUpdated, isStale, refetch };
}

export default useCurrencyInfo;
