import React from 'react';
import { Calendar, Users, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChurchSymbol } from '../common/ChurchSymbol';

export const WelcomeSection: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-full shadow-lg">
              <ChurchSymbol type="dove" className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user ? `Welcome back, ${user.name}` : t('welcomeMessage')}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {currentDate}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Community</h3>
            <p className="text-sm text-gray-600">1,247 members</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChurchSymbol type="bible" className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Content</h3>
            <p className="text-sm text-gray-600">152 resources</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Support</h3>
            <p className="text-sm text-gray-600">$12,340 raised</p>
          </div>
        </div>
      </div>
    </div>
  );
};