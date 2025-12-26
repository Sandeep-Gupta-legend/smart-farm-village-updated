import React, { useState } from 'react';


const UPI_ID = '7710884302@kotak';

const BuyerUPIPayment = () => {
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleScreenshot = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 animate-fade-in">
      <div className="w-full max-w-lg p-8 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-lg border border-green-200 animate-pop-in mt-16 relative">
        <h2 className="text-4xl font-extrabold text-green-700 animate-slide-in mb-8 text-center">Pay via UPI</h2>
        <p className="text-lg text-gray-700 mb-4 text-center">Scan the QR code below or use the UPI ID to pay using Google Pay, PhonePe, Paytm, or any UPI app.</p>
        <div className="flex flex-col items-center mb-6">
          <QRCode value={`upi://pay?pa=${UPI_ID}&pn=SmartFarmVillage`} size={180} />
          <div className="mt-4 text-center">
            <span className="font-bold text-green-700">UPI ID:</span> <span className="text-green-900">{UPI_ID}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-pop-in">
          <label className="font-bold text-green-700">Transaction ID (after payment):</label>
          <input
            type="text"
            value={txnId}
            onChange={e => setTxnId(e.target.value)}
            className="border border-green-300 rounded-lg p-3 text-lg"
            placeholder="Enter UPI transaction ID"
            required
          />
          <label className="font-bold text-green-700">Upload Payment Screenshot (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshot}
            className="border border-green-300 rounded-lg p-3 text-lg"
          />
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xl shadow-lg transition-all duration-300 animate-bounce"
          >
            Submit Payment Details
          </button>
        </form>
        {submitted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-xl text-center animate-pop-in">
            <h3 className="text-xl font-bold text-green-700 mb-2">Thank you!</h3>
            <p className="text-green-900">Your payment details have been submitted. We will verify and confirm your order soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerUPIPayment;
