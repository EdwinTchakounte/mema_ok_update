import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Users, Globe, Shield } from 'lucide-react';
import { ChurchSymbol } from '../common/ChurchSymbol';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
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
            <h2 className="text-xl font-bold text-gray-900">À propos</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChurchSymbol type="cross" className="text-white" size="md" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prédication Matinale</h3>
            <p className="text-sm text-gray-600">Version 1.0.0</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Notre Mission</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Connecter les communautés spirituelles à travers une plateforme moderne qui facilite 
                l'accès aux enseignements, prédications et actualités de votre église.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">1,247</p>
                <p className="text-xs text-gray-600">Membres</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Globe className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">2</p>
                <p className="text-xs text-gray-600">Langues</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Fonctionnalités</h4>
              <div className="space-y-2">
                {[
                  'Écoute d\'audios spirituels',
                  'Visionnage de vidéos d\'enseignement',
                  'Actualités de la communauté',
                  'Interface multilingue (FR/EN)',
                  'Mode hors ligne',
                  'Partage sur réseaux sociaux'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <h4 className="font-semibold text-gray-900">Sécurité & Confidentialité</h4>
              </div>
              <p className="text-sm text-gray-700">
                Vos données sont protégées et nous respectons votre vie privée. 
                Aucune information personnelle n'est partagée avec des tiers.
              </p>
            </div>

            <div className="text-center pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                <span>Développé avec</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>pour la communauté</span>
              </div>
              <p className="text-xs text-gray-400">
                © 2024 Prédication Matinale. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};