import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Clock, Mail } from 'lucide-react';

const PaymentModal = ({ course, onClose, onPaymentSuccess }) => {
  const [paymentStep, setPaymentStep] = useState('payment'); // payment, qr, processing, success
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes

  const upiId = 'merchant@paytm'; // Replace with actual UPI ID
  const upiUrl = `upi://pay?pa=${upiId}&pn=RiseGen&am=${course.price}&cu=INR&tn=Course: ${course.title}`;

  useEffect(() => {
    if (paymentStep === 'qr') {
      generateQRCode();
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStep('payment');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStep]);

  const generateQRCode = async () => {
    // Simple QR code placeholder - in production use proper QR library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    setQrCodeUrl(qrUrl);
  };

  const handlePayNow = () => {
    if (!userEmail) {
      alert('Please enter your email address');
      return;
    }
    setPaymentStep('qr');
  };

  const simulatePayment = () => {
    setPaymentStep('processing');
    // Simulate payment verification process
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        onPaymentSuccess(course, userEmail);
        // Send enrollment confirmation
        setTimeout(() => {
          alert(`🎉 Welcome to ${course.title}!\n\n✅ Payment Verified: ₹${course.price}\n📧 Confirmation sent to: ${userEmail}\n🎯 Course access: Immediate\n📚 Free content unlocked\n🔓 Premium content available`);
        }, 500);
        onClose();
      }, 2000);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {paymentStep === 'success' ? 'Payment Successful!' : 'Complete Payment'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {paymentStep === 'payment' && (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">₹{course.price}</span>
                  <span className="text-sm text-gray-500">{course.time}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email for confirmation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                onClick={handlePayNow}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
              >
                <Smartphone className="w-5 h-5" />
                <span>Pay with UPI</span>
              </button>
            </div>
          )}

          {paymentStep === 'qr' && (
            <div className="text-center">
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-red-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Time remaining: {formatTime(countdown)}</span>
                  </div>
                </div>
              </div>

              {qrCodeUrl && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 inline-block">
                  <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
                </div>
              )}

              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with any UPI app to pay ₹{course.price}
              </p>

              <div className="space-y-2 mb-6">
                <button
                  onClick={simulatePayment}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  I have paid (Simulate)
                </button>
                <button
                  onClick={() => setPaymentStep('payment')}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Payment
                </button>
              </div>

              <p className="text-xs text-gray-500">
                UPI ID: {upiId}
              </p>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment...</h3>
              <p className="text-gray-600">Please wait while we verify your payment</p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">You have been enrolled in {course.title}</p>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-center space-x-2 text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Confirmation email sent to {userEmail}</span>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-center text-green-700">
                    <p className="text-sm font-medium">🎯 Course Access: Immediate</p>
                    <p className="text-xs mt-1">Start learning right away!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;