
import React, { useState } from 'react';
import { ScreenName, Region, Location, Cascade, Village, MembershipType, FarmerProfile, AuthScreenProps } from '../types';
import { Button, Input, MobileLayout, Select } from '../components/ui';
import { Sprout, Phone, Lock, User, Tractor, Leaf, Languages, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';

// 1. Welcome Screen
export const WelcomeScreen: React.FC<AuthScreenProps> = ({ navigate, t, language, setLanguage }) => {
  return (
    <MobileLayout className="bg-gradient-to-b from-green-50 to-yellow-50 justify-between p-6 relative">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-green-100 shadow-sm flex items-center px-2 py-1">
              <Globe className="w-4 h-4 text-green-700 mr-2" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer appearance-none pr-4"
                style={{ direction: 'ltr' }}
              >
                  {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                          {lang.native} ({lang.name})
                      </option>
                  ))}
              </select>
          </div>
      </div>

      <div className="flex flex-col items-center mt-12">
        <h1 className="text-4xl font-bold text-green-800 tracking-tight">{t('app_name')}</h1>
        <p className="text-green-600 mt-2 text-lg">{t('app_tagline')}</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {/* Placeholder for Vector Illustration */}
        <div className="relative w-64 h-64">
           <svg viewBox="0 0 200 200" className="w-full h-full text-green-600 animate-pulse-slow">
              <circle cx="100" cy="150" r="40" fill="#eab308" opacity="0.2" />
              <path d="M100 150 L100 80 Q130 50 160 80" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M100 150 L100 90 Q70 60 40 90" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M100 150 L100 100" stroke="currentColor" strokeWidth="8" />
              <circle cx="100" cy="150" r="10" fill="#166534" />
           </svg>
           <img 
             src="https://picsum.photos/seed/farmer/400/400" 
             alt="Farmer illustration" 
             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-cover rounded-full border-4 border-yellow-400 shadow-xl opacity-90"
           />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <Button onClick={() => navigate(ScreenName.LOGIN)}>{t('login')}</Button>
        <Button variant="outline" onClick={() => navigate(ScreenName.REGISTER)}>{t('register')}</Button>
        <div className="text-center pt-2">
            {/* Admin access is now hidden from UI and only accessible via URL ?mode=admin */}
        </div>
      </div>
    </MobileLayout>
  );
};

// 2. Login Screen
export const LoginScreen: React.FC<AuthScreenProps> = ({ navigate, t }) => {
  return (
    <MobileLayout className="bg-green-50 p-6">
        <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-green-600 w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{t('welcome_back')}</h2>
                <p className="text-gray-500">{t('sign_in_desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
                <Input placeholder={t('username')} type="text" />
                <Input placeholder={t('password')} type="password" />
                
                <Button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)}>{t('login')}</Button>
                
                <div className="flex justify-end items-center text-sm mt-2">
                    <button className="text-gray-400 hover:text-gray-600">{t('forgot_password')}</button>
                </div>
            </div>
        </div>

        <div className="mt-auto py-6">
            <div className="flex justify-center space-x-2 opacity-50">
                <Sprout className="text-green-800" />
                <Tractor className="text-green-800" />
                <Sprout className="text-green-800" />
            </div>
        </div>
    </MobileLayout>
  );
};

// 3. OTP Login Screen (Unused/Hidden)
export const OTPLoginScreen: React.FC<AuthScreenProps> = ({ navigate, t, language, setLanguage }) => {
    return <LoginScreen navigate={navigate} t={t} language={language} setLanguage={setLanguage} />;
};

// 4. Registration Screen
export const RegisterScreen: React.FC<AuthScreenProps> = ({ navigate, t, regions = [], locations = [], cascades = [], villages = [], farmers = [] }) => {
    // Form State
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    // State for cascading dropdowns
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCascade, setSelectedCascade] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');
    
    // State for Membership
    const [membership, setMembership] = useState<string>(MembershipType.NON_MEMBER);
    const [jointYear, setJointYear] = useState('');

    // Filter Logic
    const filteredLocations = locations.filter(l => l.regionId === selectedRegion);
    const filteredCascades = cascades.filter(c => c.locationId === selectedLocation);
    const filteredVillages = villages.filter(v => v.cascadeId === selectedCascade);

    const handleRegister = () => {
        setValidationError('');

        // 1. Validate Mobile Number Length (Exact 10)
        // Ensure no spaces or non-digits, and length is exactly 10
        if (!/^\d{10}$/.test(mobile)) {
            setValidationError('Mobile number must be exactly 10 digits.');
            return;
        }

        // 2. Check for Duplicates
        const duplicateFarmer = farmers.find(f => f.mobile === mobile);
        if (duplicateFarmer) {
            setValidationError(`This Mobile number already entered for this farmer ${duplicateFarmer.name}`);
            return;
        }

        // 3. Validate other fields (Basic)
        if (!name) {
            setValidationError('Please enter your name.');
            return;
        }
        if (!password) {
             setValidationError('Please create a password.');
             return;
        }

        // If all good, proceed
        navigate(ScreenName.SELECT_CROP);
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Strict Validation:
        // 1. Allow empty string (deleting)
        // 2. Allow only digits (0-9) via Regex test
        // 3. Max length 10
        if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
            setMobile(value);
            setValidationError(''); // Clear error on type
        }
    };

    return (
      <MobileLayout className="bg-gray-50 p-6 overflow-y-auto">
          <div className="mb-6 mt-4">
            <h2 className="text-2xl font-bold text-green-800">{t('farmer_registration')}</h2>
            <p className="text-gray-500">{t('join_community')}</p>
          </div>

          <div className="space-y-4 pb-8">
             {validationError && (
                 <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm font-medium">
                     {validationError}
                 </div>
             )}

             <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <Input 
                    placeholder={t('full_name')} 
                    className="pl-10" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
             </div>
             <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <Input 
                    placeholder={t('mobile_number')} 
                    type="tel" 
                    inputMode="numeric"
                    className="pl-10" 
                    value={mobile}
                    onChange={handleMobileChange}
                    maxLength={10} // HTML attribute limit
                />
             </div>
             
             {/* Master Data Dropdowns */}
             <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                 <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('location_details')}</h3>
                 <Select 
                    label={t('select_region')}
                    value={selectedRegion}
                    onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setSelectedLocation('');
                        setSelectedCascade('');
                        setSelectedVillage('');
                    }}
                    options={[
                        { value: '', label: t('select_region') },
                        ...regions.map(r => ({ value: r.id, label: r.name }))
                    ]}
                 />
                 <Select 
                    label={t('select_location')}
                    value={selectedLocation}
                    onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setSelectedCascade('');
                        setSelectedVillage('');
                    }}
                    disabled={!selectedRegion}
                    options={[
                        { value: '', label: t('select_location') },
                        ...filteredLocations.map(l => ({ value: l.id, label: l.name }))
                    ]}
                 />
                 <Select 
                    label={t('select_cascade')}
                    value={selectedCascade}
                    onChange={(e) => {
                        setSelectedCascade(e.target.value);
                        setSelectedVillage('');
                    }}
                    disabled={!selectedLocation}
                    options={[
                        { value: '', label: t('select_cascade') },
                        ...filteredCascades.map(c => ({ value: c.id, label: c.name }))
                    ]}
                 />
                 <Select 
                    label={t('select_village')}
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    disabled={!selectedCascade}
                    options={[
                        { value: '', label: t('select_village') },
                        ...filteredVillages.map(v => ({ value: v.id, label: v.name }))
                    ]}
                 />
             </div>

             {/* Membership Info */}
             <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                 <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('membership_details')}</h3>
                 <Select 
                    label={t('are_you_member')}
                    value={membership}
                    onChange={(e) => setMembership(e.target.value)}
                    options={[
                        { value: MembershipType.NON_MEMBER, label: 'Non Member' },
                        { value: MembershipType.VAYALAGAM, label: 'Vayalagam' },
                        { value: MembershipType.KALANJIAM, label: 'Kalanjiam' },
                    ]}
                 />
                 {membership !== MembershipType.NON_MEMBER && (
                     <Input 
                        label={t('joint_year')}
                        placeholder="e.g. 2020 or 5 Years" 
                        value={jointYear}
                        onChange={(e) => setJointYear(e.target.value)}
                     />
                 )}
             </div>

             <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <Input 
                    placeholder={t('password')}
                    type="password" 
                    className="pl-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
             </div>

             <Select 
                options={[
                    { value: '', label: 'Select Primary Crop' },
                    { value: 'paddy', label: 'Paddy' },
                    { value: 'millets', label: 'Millets' },
                    { value: 'sugarcane', label: 'Sugarcane' },
                ]}
             />

             <Button className="rounded-full mt-4" onClick={handleRegister}>{t('register_continue')}</Button>
             
             <p className="text-center text-gray-500 mt-4 text-sm">
                {t('already_account')} <span className="text-green-600 font-bold cursor-pointer" onClick={() => navigate(ScreenName.LOGIN)}>{t('login')}</span>
             </p>
          </div>
      </MobileLayout>
    );
};
