import React from 'react';

export const PolicySection = () => {
  return (
    <div className="mt-12 max-w-2xl mx-auto text-sm text-gray-600 space-y-4 border-t pt-8">
      <div>
        <h3 className="font-semibold mb-2">Privacy Policy</h3>
        <p>
          We are committed to protecting your privacy. We will not sell or give away your information to any third parties unless required to do so by law or court order.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Refund Policy</h3>
        <p>
          Due to the digital nature of our services, all purchases are final and non-refundable. By using our service, you acknowledge and agree to this no-refund policy.
        </p>
      </div>
    </div>
  );
};