import { useEffect, useState, useCallback } from "react";

function useCurrencyInfo(baseCurrency) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCurrencyData = useCallback(async () => {
    if (!baseCurrency) return;

    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
      if (!apiKey) {
        throw new Error("API key not found. Please check your environment variables.");
      }

      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.result === "error") {
        throw new Error(result["error-type"] || "Unknown API error");
      }

      setData(result.conversion_rates || {});
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Currency fetch error:", err);
      setError(err.message);
      setData({});
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    fetchCurrencyData();
  }, [fetchCurrencyData]);

  return { data, loading, error, lastUpdated, refetch: fetchCurrencyData };
}

export default useCurrencyInfo;
