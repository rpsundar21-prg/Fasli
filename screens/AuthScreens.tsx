
import React, { useState, useEffect } from 'react';
import { ScreenName, Region, Location, Cascade, Village, MembershipType, FarmerProfile, AuthScreenProps } from '../types';
import { Button, Input, MobileLayout, Select, Card } from '../components/ui';
import { Sprout, Phone, Lock, User, Tractor, Leaf, Languages, Globe, ChevronRight, MapPin } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';

// 1. Welcome Screen
export const WelcomeScreen: React.FC<AuthScreenProps> = ({ navigate, t, language, setLanguage }) => {
  return (
    <MobileLayout className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000" 
          alt="Tamil Nadu Agriculture" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-green-900/90" />
      </div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-20">
          <div className="bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg flex items-center px-3 py-1.5 transition-all hover:bg-white/30">
              <Globe className="w-4 h-4 text-white mr-2" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer appearance-none pr-4"
              >
                  {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code} className="text-gray-900">
                          {lang.native}
                      </option>
                  ))}
              </select>
          </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between p-8">
        <div className="mt-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 mb-6 shadow-2xl">
            <Sprout className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">
            {t('app_name')}
          </h1>
          <p className="text-green-100 text-lg font-medium opacity-90 italic">
            {t('app_tagline')}
          </p>
        </div>

        <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Button 
            className="bg-yellow-500 hover:bg-yellow-400 text-green-900 border-none h-14 text-lg shadow-xl shadow-yellow-900/20"
            onClick={() => navigate(ScreenName.LOGIN)}
          >
            {t('login')} <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
          <Button 
            variant="outline" 
            className="border-white/40 text-white hover:bg-white/10 h-14 text-lg backdrop-blur-sm"
            onClick={() => navigate(ScreenName.REGISTER)}
          >
            {t('register')}
          </Button>
          
          <div className="pt-4 text-center">
             <p className="text-white/60 text-xs font-medium tracking-widest uppercase">
               Proudly Made for Tamil Nadu Farmers
             </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

// 2. Login Screen (Fixed to ensure it's functional)
export const LoginScreen: React.FC<AuthScreenProps> = ({ navigate, t }) => {
  return (
    <MobileLayout className="bg-white">
        <div className="p-8 flex flex-col h-full">
            <button onClick={() => navigate(ScreenName.WELCOME)} className="mb-8 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
                <Globe className="w-5 h-5 text-gray-600 rotate-180" />
            </button>

            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-2">{t('welcome_back')}</h2>
                <p className="text-gray-500">{t('sign_in_desc')}</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                  <Input label={t('username')} placeholder="Admin or Mobile Number" />
                  <Input label={t('password')} type="password" placeholder="••••••••" />
                </div>
                
                <Button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="h-14">
                  {t('login')}
                </Button>
                
                <button className="w-full text-center text-sm font-bold text-green-700">
                    {t('forgot_password')}
                </button>
            </div>

            <div className="mt-auto pt-12 text-center text-gray-400">
                <Leaf className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-[10px] uppercase tracking-widest font-bold">Powered by Fasli Intelligence</p>
            </div>
        </div>
    </MobileLayout>
  );
};

export const OTPLoginScreen: React.FC<AuthScreenProps> = ({ navigate, t, language, setLanguage }) => {
    return <LoginScreen navigate={navigate} t={t} language={language} setLanguage={setLanguage} />;
};

// 4. Registration Screen (Improved dropdown logic)
export const RegisterScreen: React.FC<AuthScreenProps> = ({ navigate, t, regions = [], locations = [], cascades = [], villages = [], farmers = [] }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCascade, setSelectedCascade] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');
    const [membership, setMembership] = useState<string>(MembershipType.NON_MEMBER);
    const [jointYear, setJointYear] = useState('');

    const filteredLocations = locations.filter(l => l.regionId === selectedRegion);
    const filteredCascades = cascades.filter(c => c.locationId === selectedLocation);
    const filteredVillages = villages.filter(v => v.cascadeId === selectedCascade);

    // Replace your existing handleRegister with this:
    const handleRegister = async () => {
        setValidationError('');
        
        // 1. Client-side Validation
        if (!/^\d{10}$/.test(mobile)) {
            setValidationError('Mobile number must be exactly 10 digits.');
            return;
        }
        if (!name || !selectedRegion || !selectedVillage) {
            setValidationError('Please fill all mandatory fields.');
            return;
        }

        // 2. Prepare Data for API
        // Note: We use snake_case keys (e.g., region_id) to match the Database
        const farmerData = {
            name: name,
            mobile: mobile,
            region_id: selectedRegion,
            location_id: selectedLocation,
            cascade_id: selectedCascade,
            village_id: selectedVillage,
            membership_type: membership,
            joint_year: jointYear,
            primary_crop: "Pending", // We will update this later if needed
            password: password
        };

        try {
            // 3. Send Data to Cloudflare Backend
            // Make sure you have created functions/register.ts as discussed before
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(farmerData)
            });

            const result = await response.json();

            if (result.success) {
                alert("Registration Successful!");
                // Now navigate to Login or Crop Selection
                navigate(ScreenName.LOGIN); 
            } else {
                setValidationError(result.error || "Registration Failed");
            }
        } catch (error) {
            console.error(error);
            setValidationError("Network Error: Could not connect to server.");
        }
    };

    return (
      <MobileLayout className="bg-white p-6 overflow-y-auto">
          <div className="mb-8 mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900">{t('register')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('join_community')}</p>
            </div>
            <Tractor className="w-10 h-10 text-green-600 opacity-20" />
          </div>

          <div className="space-y-5 pb-12">
             {validationError && (
                 <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm font-bold animate-pulse">
                     {validationError}
                 </div>
             )}

             <div className="space-y-4">
                <Input 
                    label={t('full_name')}
                    placeholder="e.g. Arumugam" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input 
                    label={t('mobile_number')}
                    placeholder="10 digit number" 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
             </div>
             
             <Card className="p-4 border-2 border-green-50 bg-green-50/30">
                 <h3 className="text-sm font-bold text-green-800 mb-4 flex items-center">
                   <MapPin className="w-4 h-4 mr-1" /> {t('location_details')}
                 </h3>
                 <div className="space-y-1">
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
                          { value: '', label: `-- ${t('select_region')} --` },
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
                          { value: '', label: regions.length > 0 ? `-- ${t('select_location')} --` : 'No Regions Available' },
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
                          { value: '', label: filteredLocations.length > 0 ? `-- ${t('select_cascade')} --` : 'Waiting for Location...' },
                          ...filteredCascades.map(c => ({ value: c.id, label: c.name }))
                      ]}
                   />
                   <Select 
                      label={t('select_village')}
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      disabled={!selectedCascade}
                      options={[
                          { value: '', label: filteredCascades.length > 0 ? `-- ${t('select_village')} --` : 'Waiting for Cascade...' },
                          ...filteredVillages.map(v => ({ value: v.id, label: v.name }))
                      ]}
                   />
                 </div>
             </Card>

             <div className="space-y-4">
               <Select 
                  label={t('are_you_member')}
                  value={membership}
                  onChange={(e) => setMembership(e.target.value)}
                  options={[
                      { value: MembershipType.NON_MEMBER, label: 'No, I am not a member' },
                      { value: MembershipType.VAYALAGAM, label: 'Vayalagam Member' },
                      { value: MembershipType.KALANJIAM, label: 'Kalanjiam Member' },
                  ]}
               />
               {membership !== MembershipType.NON_MEMBER && (
                   <Input 
                      label={t('joint_year')}
                      placeholder="e.g. 2021" 
                      value={jointYear}
                      onChange={(e) => setJointYear(e.target.value)}
                   />
               )}
               <Input 
                    label={t('password')}
                    type="password" 
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
             </div>

             <Button className="h-14 mt-6 shadow-lg shadow-green-200" onClick={handleRegister}>
               {t('register_continue')}
             </Button>
             
             <p className="text-center text-gray-500 mt-6 text-sm">
                {t('already_account')} <span className="text-green-600 font-black cursor-pointer underline decoration-2 underline-offset-4" onClick={() => navigate(ScreenName.LOGIN)}>{t('login')}</span>
             </p>
          </div>
      </MobileLayout>
    );
};
