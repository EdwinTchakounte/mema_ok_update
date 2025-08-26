import React, { useState } from 'react';
import { Heart, CreditCard, DollarSign } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChurchSymbol } from '../common/ChurchSymbol';

interface LygosPaymentProps {
  onClose: () => void;
}

export const LygosPayment: React.FC<LygosPaymentProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();

  const predefinedAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const handleCustomAmount = (value: string) => {
    setAmount(value);
    setSelectedAmount(null);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate Lygos payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, integrate with Lygos API here
    console.log('Processing donation via Lygos:', amount);
    
    setIsProcessing(false);
    alert(`Thank you for your donation of $${amount}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 p-4 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('donateToChurch')}
            </h2>
            <p className="text-gray-600">
              {t('supportMinistry')}
            </p>
          </div>

          <div className="space-y-6">
            {/* Predefined Amounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Select
              </label>
              <div className="grid grid-cols-2 gap-3">
                {predefinedAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAmountSelect(value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedAmount === value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('amount')} (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="1"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Lygos Secure Payment</p>
                  <p className="text-sm text-gray-600">Powered by Lygos Payment Gateway</p>
                </div>
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={processPayment}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span>{t('donate_amount')} ${amount || '0'}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ChurchSymbol type="dove" size="sm" />
              <span>Your donation helps spread the word</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};