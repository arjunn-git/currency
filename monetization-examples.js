// Affiliate Links Example
const AffiliateBanner = () => (
  <div className="affiliate-banner bg-blue-50 p-4 rounded-lg my-4 border border-blue-200">
    <p className="text-sm text-gray-600 mb-2">💡 Need to exchange currency?</p>
    <a
      href="https://example-affiliate-link.com?ref=your-ref-code"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      Get Best Exchange Rates →
    </a>
    <p className="text-xs text-gray-500 mt-1">*Affiliate link - helps support this free tool</p>
  </div>
);

// Premium Features Example
const PremiumModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">Upgrade to Premium</h3>
        <ul className="space-y-2 mb-6">
          <li>✅ Historical exchange rates</li>
          <li>✅ Advanced charts & graphs</li>
          <li>✅ Multiple currency conversion</li>
          <li>✅ Ad-free experience</li>
          <li>✅ Priority support</li>
        </ul>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Maybe Later
          </button>
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upgrade - $4.99/mo
          </button>
        </div>
      </div>
    </div>
  );
};