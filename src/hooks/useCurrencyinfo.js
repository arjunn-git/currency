import { useEffect, useState, useCallback } from "react";

const CACHE_KEY_PREFIX = "cc_rates_";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function useCurrencyInfo(baseCurrency) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const base = (baseCurrency || "usd").toLowerCase();

  const fetchCurrencyData = useCallback(async (forceRefresh = false) => {
    if (!base) return;

    // 1. Check localStorage cache unless forceRefresh is true
    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${base}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          const isFresh = Date.now() - parsed.timestamp < CACHE_TTL_MS;
          if (isFresh && parsed.rates && Object.keys(parsed.rates).length > 0) {
            setData(parsed.rates);
            setLastUpdated(parsed.lastUpdated);
            return;
          }
        }
      } catch {
        // Ignore localStorage read errors
      }
    }

    setLoading(true);
    setError(null);

    let rates = null;
    let updateTime = null;

    // 2. Try primary API (with key if available)
    const apiKey = import.meta.env?.VITE_EXCHANGE_RATE_API_KEY;
    if (apiKey) {
      try {
        const primaryRes = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base.toUpperCase()}`
        );
        if (primaryRes.ok) {
          const primaryJson = await primaryRes.json();
          if (primaryJson.result !== "error" && primaryJson.conversion_rates) {
            rates = primaryJson.conversion_rates;
            updateTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }
        }
      } catch {
        // Fall back to open endpoint below
      }
    }

    // 3. Fallback to open endpoint (no API key required)
    if (!rates) {
      try {
        const openRes = await fetch(
          `https://open.er-api.com/v6/latest/${base.toUpperCase()}`
        );
        if (openRes.ok) {
          const openJson = await openRes.json();
          if (openJson.result === "success" && openJson.rates) {
            rates = openJson.rates;
            updateTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }
        }
      } catch (err) {
        console.error("Open API error:", err);
      }
    }

    // 4. Update state & cache
    if (rates && Object.keys(rates).length > 0) {
      // Normalize rate keys to lowercase for consistency
      const normalized = {};
      for (const [k, v] of Object.entries(rates)) {
        normalized[k.toLowerCase()] = v;
      }
      setData(normalized);
      setLastUpdated(updateTime || "Just now");

      try {
        localStorage.setItem(
          `${CACHE_KEY_PREFIX}${base}`,
          JSON.stringify({
            rates: normalized,
            lastUpdated: updateTime,
            timestamp: Date.now(),
          })
        );
      } catch {
        // Ignore localStorage write error
      }
    } else {
      setError("Unable to fetch real-time rates. Please check your connection.");
    }

    setLoading(false);
  }, [base]);

  useEffect(() => {
    fetchCurrencyData();
  }, [fetchCurrencyData]);

  const refetch = useCallback(() => {
    return fetchCurrencyData(true);
  }, [fetchCurrencyData]);

  return { data, loading, error, lastUpdated, refetch };
}

export default useCurrencyInfo;
