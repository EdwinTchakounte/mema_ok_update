import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, HelpCircle, ChevronDown, ChevronRight, Play, Download, Share2, Settings } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Comment écouter un audio ?",
      answer: "Cliquez sur le bouton play dans la card audio. Vous pouvez contrôler la lecture avec les boutons pause, avance rapide et réglage du volume.",
      icon: Play
    },
    {
      question: "Comment télécharger du contenu ?",
      answer: "Cliquez sur l'icône de téléchargement dans chaque card. Le contenu sera sauvegardé sur votre appareil pour une écoute hors ligne.",
      icon: Download
    },
    {
      question: "Comment partager du contenu ?",
      answer: "Utilisez le bouton de partage dans chaque card pour partager sur les réseaux sociaux ou copier le lien.",
      icon: Share2
    },
    {
      question: "Comment changer la langue ?",
      answer: "Allez dans Paramètres > Préférences > Langue et sélectionnez votre langue préférée (Français ou English).",
      icon: Settings
    },
    {
      question: "Comment activer le mode sombre ?",
      answer: "Dans Paramètres > Préférences, activez le toggle 'Mode sombre' pour basculer vers le thème sombre.",
      icon: Settings
    },
    {
      question: "Que faire si l'audio ne se charge pas ?",
      answer: "Vérifiez votre connexion internet. Si le problème persiste, essayez de vider le cache dans Paramètres > Données > Vider le cache.",
      icon: HelpCircle
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Centre d'aide</h2>
                <p className="text-sm text-gray-600">Questions fréquentes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <faq.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                  </div>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-gray-700 leading-relaxed pl-11">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Besoin d'aide supplémentaire ?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium">
              Nous contacter
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};