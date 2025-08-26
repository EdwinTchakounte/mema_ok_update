import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, CreditCard, DollarSign } from 'lucide-react';
import { ChurchSymbol } from '../common/ChurchSymbol';

interface DonationModalProps {
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const handleCustomAmount = (value: string) => {
    setAmount(value);
    setSelectedAmount(null);
  };

  const processDonation = async () => {
    setProcessing(true);
    
    // Simulate Lygos payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Merci pour votre don de ${amount}€ !`);
    setProcessing(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Faire un don</h2>
                <p className="text-sm text-gray-600">Soutenez notre mission</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Predefined Amounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Montant suggéré
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
                      <span className="font-semibold">{value}€</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant personnalisé (€)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="1"
                  placeholder="Montant personnalisé"
                  value={amount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Paiement sécurisé Lygos</p>
                  <p className="text-sm text-gray-600">Traitement sécurisé des paiements</p>
                </div>
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={processDonation}
              disabled={!amount || parseFloat(amount) <= 0 || processing}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border border-white border-t-transparent rounded-full animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span>Donner {amount || '0'}€</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ChurchSymbol type="dove" size="sm" />
              <span>Votre don aide à répandre la parole</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};