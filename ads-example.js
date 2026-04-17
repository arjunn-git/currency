// Example: Adding Google AdSense to your app
// Add this to your public/index.html in the <head> section
/*
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossorigin="anonymous"></script>
*/

// Then add ad components to your App.jsx
import React from 'react';

const AdBanner = ({ slot, style = {} }) => (
  <div className="ad-container my-4 text-center">
    <ins className="adsbygoogle"
         style={{ display: 'block', ...style }}
         data-ad-client="ca-pub-XXXXXXXXXX"
         data-ad-slot={slot}
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </div>
);

// Usage in App.jsx
<AdBanner slot="1234567890" style={{ minHeight: '90px' }} />