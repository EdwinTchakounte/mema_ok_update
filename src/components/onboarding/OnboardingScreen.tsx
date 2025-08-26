import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChurchSymbol } from '../common/ChurchSymbol';
import { OnboardingStep } from '../../types';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { language, t } = useLanguage();

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: { fr: "Bienvenue dans votre communauté", en: "Welcome to your community" },
      description: { fr: "Découvrez une nouvelle façon de vivre votre foi au quotidien avec notre application moderne", en: "Discover a new way to live your faith daily with our modern application" },
      icon: 'church',
      color: 'from-gray-700 to-gray-900'
    },
    {
      id: 2,
      title: { fr: "Écoutez la Parole", en: "Listen to the Word" },
      description: { fr: "Accédez à des prédications inspirantes, des enseignements spirituels et des témoignages transformateurs", en: "Access inspiring sermons, spiritual teachings and transformative testimonies" },
      icon: 'bible',
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 3,
      title: { fr: "Restez connecté", en: "Stay connected" },
      description: { fr: "Recevez les dernières actualités, partagez avec votre communauté et grandissez ensemble dans la foi", en: "Get the latest news, share with your community and grow together in faith" },
      icon: 'dove',
      color: 'from-gray-500 to-gray-700'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-xl">
            <ChurchSymbol type="cross" className="text-gray-600" />
          </div>
          <span className="text-gray-900 font-semibold">{t('appTitle')}</span>
        </div>
        <button
          onClick={skipOnboarding}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {t('skip')}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-sm"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center shadow-lg`}
            >
              <ChurchSymbol 
                type={steps[currentStep].icon as any} 
                size="lg" 
                className="text-white" 
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              {steps[currentStep].title[language]}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-base leading-relaxed"
            >
              {steps[currentStep].description[language]}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="flex gap-2 mt-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-gray-900 scale-125'
                  : index < currentStep
                  ? 'bg-gray-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-6">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            currentStep === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Précédent</span>
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-sm"
        >
          <span>{currentStep === steps.length - 1 ? t('finish') : t('next')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};