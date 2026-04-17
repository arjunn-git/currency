// Google Analytics Setup
// Add to public/index.html in <head>
/*
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
*/

// Analytics tracking functions
const trackEvent = (eventName, parameters = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Usage examples
const handleConversion = (from, to, amount) => {
  trackEvent('currency_conversion', {
    from_currency: from,
    to_currency: to,
    amount: amount
  });
};

const handleAdClick = (adType) => {
  trackEvent('ad_click', {
    ad_type: adType
  });
};

const handleAffiliateClick = (service) => {
  trackEvent('affiliate_click', {
    service: service
  });
};

// Revenue tracking
const trackRevenue = (amount, currency = 'USD') => {
  trackEvent('purchase', {
    value: amount,
    currency: currency,
    transaction_id: Date.now().toString()
  });
};

export { trackEvent, handleConversion, handleAdClick, handleAffiliateClick, trackRevenue };