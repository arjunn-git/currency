import { useEffect, useState } from "react";

function useCurrencyInfo(baseCurrency) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/7f9ce16b100e707e2452bfd9/latest/${baseCurrency}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.conversion_rates);
      });
  }, [baseCurrency]);

  return data; // returns an object like { USD: 1, INR: 83.3, EUR: 0.91 }
}

export default useCurrencyInfo;
