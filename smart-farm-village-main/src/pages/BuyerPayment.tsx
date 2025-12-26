import React, { useEffect } from 'react';

const UPI_ID = '7710884302@kotak';
const BANK_ACCOUNT = '4449933332';

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePayment = async () => {
  const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!res) {
    alert('Razorpay SDK failed to load.');
    return;
  }
  const options = {
    key: 'rzp_test_YourKeyHere', // Replace with your Razorpay Key
    amount: 10000, // Example: Rs. 100.00
    currency: 'INR',
    name: 'Smart Farm Village',
    description: 'Buyer Payment',
    image: '/assets/farming-logo.png',
    handler: function (response) {
      alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
    },
    prefill: {
      name: '',
      email: '',
      contact: '',
    },
    notes: {
      upi_id: UPI_ID,
      bank_account: BANK_ACCOUNT,
    },
    theme: {
      color: '#00b894',
    },
    method: {
      upi: true,
      netbanking: true,
      card: true,
    },
  };
  // @ts-ignore
  const rzp = new window.Razorpay(options);
  rzp.open();
};

const BuyerPayment = () => {
  useEffect(() => {
    loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <div className="w-full max-w-lg p-8 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-lg border border-green-200 animate-pop-in mt-16 relative">
        <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in mb-8 text-center">Make Payment</h2>
        <p className="text-lg text-gray-700 mb-4 text-center">Pay securely using UPI, Netbanking, or Card. Your payment will be routed to:</p>
        <div className="mb-6 text-center">
          <span className="font-bold text-green-700">UPI ID:</span> <span className="text-green-900">{UPI_ID}</span><br />
          <span className="font-bold text-green-700">Bank Account:</span> <span className="text-green-900">{BANK_ACCOUNT}</span>
        </div>
        <button
          onClick={handlePayment}
          className="w-full py-4 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xl shadow-lg transition-all duration-300 animate-bounce"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default BuyerPayment;
