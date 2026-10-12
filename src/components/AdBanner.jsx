import React, { useEffect } from "react";

export default function AdBanner({ slot = "default-slot", minHeight = "90px" }) {
  const adClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adClientId && window) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Suppress AdSense push errors if blocked or not loaded yet
      }
    }
  }, [adClientId]);

  if (!adClientId) {
    // Return subtle placeholder when no AdSense client ID configured yet
    return null;
  }

  return (
    <div className="w-full my-3 flex justify-center items-center overflow-hidden rounded-xl bg-black/10 backdrop-blur-sm border border-white/10" style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", textAlign: "center" }}
        data-ad-client={adClientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
