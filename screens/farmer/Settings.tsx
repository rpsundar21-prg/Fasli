

import React from 'react';
import { ScreenName, FarmerScreenProps } from '../../types';
import { MobileLayout, Button, Select } from '../../components/ui';
import { ChevronLeft, User, Languages, Phone, LogOut, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../i18n';

export const SettingsScreen: React.FC<FarmerScreenProps> = ({ navigate, currentUser, language, setLanguage, t }) => {
    return (
        <MobileLayout className="bg-gray-50">
             <div className="bg-white p-4 shadow-sm flex items-center border-b">
                <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                <h2 className="text-lg font-bold">{t('settings')}</h2>
             </div>
             
             <div className="p-4 space-y-6">
                 {/* Profile Card */}
                 <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                         <User className="w-8 h-8 text-green-700" />
                     </div>
                     <div>
                         <h3 className="font-bold text-lg">{currentUser?.name || 'Farmer'}</h3>
                         <p className="text-sm text-gray-500">{currentUser?.mobile || '9876543210'}</p>
                         <p className="text-xs text-green-600 font-medium mt-1">{currentUser?.primaryCrop} {t('farmer')}</p>
                     </div>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-4">
                     <div className="flex items-center gap-3 mb-3">
                         <Languages className="w-5 h-5 text-gray-500" />
                         <span className="text-gray-700 font-semibold">{t('change_language')}</span>
                     </div>
                     <div>
                        <Select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            options={SUPPORTED_LANGUAGES.map(lang => ({
                                value: lang.code,
                                label: `${lang.native} (${lang.name})`
                            }))}
                        />
                     </div>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                     <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                         <div className="flex items-center gap-3">
                             <Phone className="w-5 h-5 text-gray-500" />
                             <span className="text-gray-700">{t('contact_support')}</span>
                         </div>
                     </button>
                 </div>

                 <Button variant="danger" onClick={() => navigate(ScreenName.WELCOME)} className="mt-8">
                     <LogOut className="w-4 h-4" /> {t('logout')}
                 </Button>
                 
                 <p className="text-center text-xs text-gray-400 mt-4">Version 1.0.0</p>
             </div>
        </MobileLayout>
    );
};
