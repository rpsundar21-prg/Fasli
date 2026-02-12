
import React, { useState, useEffect, useCallback } from 'react';
import { ScreenName, DiaryEntry, DiaryCategory, EntryType, Cultivation, Query, Region, Location, Cascade, Village, MarketPost, MarketType, FarmerProfile, Forecast } from './types';
import { translations } from './i18n';
import { GoogleGenAI } from "@google/genai";
import { ApiService } from './api';
import { 
  WelcomeScreen, LoginScreen, OTPLoginScreen, RegisterScreen 
} from './screens/AuthScreens';
import { 
  FarmerDashboard, SelectCropScreen, DiaryCategoriesScreen, AddExpenseScreen, 
  EntryListScreen, CropSummaryScreen, GraphReportScreen, SettingsScreen, MyCropsScreen,
  QueriesListScreen, AddQueryScreen, MarketPlaceScreen, ForecastScreen
} from './screens/FarmerScreens';
import { 
  AdminLoginScreen, AdminDashboardScreen, FarmerListScreen, 
  FarmerDetailsScreen, AnalyticsScreen, AdminQueriesScreen, AdminQueryResponseScreen,
  AdminMasterMenu, AdminMasterDataScreen, AdminMarketScreen
} from './screens/AdminScreens';



const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.WELCOME);
  const [language, setLanguage] = useState<string>('en');
  const [isRefreshingForecast, setIsRefreshingForecast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // States for cross-screen data sharing
  const [selectedCategory, setSelectedCategory] = useState<string>(DiaryCategory.LAND_PREP);
  const [entryToEdit, setEntryToEdit] = useState<DiaryEntry | null>(null);
  const [cultivationToEdit, setCultivationToEdit] = useState<Cultivation | null>(null);

  const t = (key: string) => {
      const langDict = translations[language];
      if (langDict && langDict[key]) return langDict[key];
      if (translations['en'][key]) return translations['en'][key];
      return key;
  };

  const registerFarmer = async (farmerData) => {
  try {
    // Make sure the URL matches your Cloudflare URL
    // If testing locally, use http://localhost:8788/register
    const response = await fetch('/register', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Date.now().toString(), // Or let the backend handle it
        name: farmerData.name,
        mobile: farmerData.mobile,
        region_id: farmerData.regionId,   // Ensure variable names match!
        location_id: farmerData.locationId,
        cascade_id: farmerData.cascadeId,
        village_id: farmerData.villageId,
        primary_crop: farmerData.primaryCrop,
        membership_type: farmerData.membershipType,
        joint_year: farmerData.jointYear
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      alert("Registration Successful!");
    } else {
      alert("Error: " + result.error);
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
};
  
  // Master Data State
  const [regions, setRegions] = useState<Region[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [cascades, setCascades] = useState<Cascade[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [cultivations, setCultivations] = useState<Cultivation[]>([]);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [marketPosts, setMarketPosts] = useState<MarketPost[]>([]);
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<FarmerProfile | null>(null);
  const [activeCultivationId, setActiveCultivationId] = useState<string>('');
  
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);

  const [forecasts, setForecasts] = useState<Forecast[]>([{
      id: 'f-initial',
      date: new Date().toISOString().split('T')[0],
      temp: 32,
      condition: 'Sunny',
      chanceOfRain: 10,
      advice: "forecast_advice_today",
      regionName: "Tamil Nadu"
  }]);

  // Handle URL Query Parameters (mode=admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
      setCurrentScreen(ScreenName.ADMIN_LOGIN);
    }
  }, []);

  // Load Initial Data from D1 via Cloudflare API
  const loadData = useCallback(async () => {
    setIsSyncing(true);
    try {
        const data = await ApiService.fetchAllData();
        console.log("D1 Cloud Master Data Sync:", {
            regions: data?.regions?.length,
            locations: data?.locations?.length,
            cascades: data?.cascades?.length,
            villages: data?.villages?.length
        });
        
        if (data?.regions) setRegions(data.regions);
        if (data?.locations) setLocations(data.locations);
        if (data?.cascades) setCascades(data.cascades);
        if (data?.villages) setVillages(data.villages);

        if (data?.cultivations) setCultivations(data.cultivations);
        if (data?.entries) setEntries(data.entries);
        if (data?.queries) setQueries(data.queries);
        if (data?.marketPosts) setMarketPosts(data.marketPosts);
        if (data?.farmer) setCurrentUser(data.farmer);
        if (data?.farmers) setFarmers(data.farmers);
        
        if (data?.cultivations?.length > 0 && !activeCultivationId) {
            setActiveCultivationId(data.cultivations[0].id);
        }
    } catch (err) {
        console.error("Cloud D1 Load Error:", err);
    } finally {
        setIsSyncing(false);
    }
  }, [activeCultivationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const syncWithCloud = async (action: () => Promise<any>) => {
      setIsSyncing(true);
      try {
          await action();
      } catch (err) {
          console.warn("Sync failed:", err);
      } finally {
          setIsSyncing(false);
      }
  };

  const handleAddEntry = (entry: DiaryEntry) => {
    setEntries(prev => [entry, ...prev]);
    syncWithCloud(() => ApiService.saveEntry(entry));
  };
  
  const handleUpdateEntry = (updatedEntry: DiaryEntry) => {
      setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
      syncWithCloud(() => ApiService.saveEntry(updatedEntry));
  };
  
  const handleAddCultivation = (cultivation: Cultivation) => {
    setCultivations(prev => [...prev, cultivation]);
    syncWithCloud(() => ApiService.saveCultivation(cultivation));
    if (!activeCultivationId) setActiveCultivationId(cultivation.id);
  };

  const handleAddQuery = (query: Query) => {
      setQueries(prev => [query, ...prev]);
      syncWithCloud(() => ApiService.saveQuery(query));
  };

  const handleAddMarketPost = (post: MarketPost) => {
      setMarketPosts(prev => [post, ...prev]);
      syncWithCloud(() => ApiService.saveMarketPost(post));
  };

  const fetchRealForecast = useCallback(async () => {
    if (isRefreshingForecast) return;
    setIsRefreshingForecast(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const region = currentUser?.regionId || 'Tamil Nadu';
      const crop = cultivations.find(c => c.id === activeCultivationId)?.cropName || 'Paddy';
      const langName = language === 'ta' ? 'Tamil' : 'English';

      const prompt = `Provide current weather and 3-day forecast for ${region}, Tamil Nadu.
      Analyze needs for ${crop}. Return JSON: {"temp": number, "condition": "Sunny"|"Rainy"|"Cloudy"|"Stormy", "chanceOfRain": number, "advice": "string in ${langName}"}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      const jsonStr = response.text?.match(/\{.*\}/s)?.[0];
      if (jsonStr) {
        const data = JSON.parse(jsonStr);
        const newForecast: Forecast = {
          id: `f-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          temp: data.temp,
          condition: data.condition,
          chanceOfRain: data.chanceOfRain,
          advice: data.advice || "AI Advice pending",
          regionName: region
        };
        setForecasts([newForecast]);
      }
    } catch (err) {
      console.error("Forecast AI Error:", err);
    } finally {
      setIsRefreshingForecast(false);
    }
  }, [activeCultivationId, cultivations, currentUser, isRefreshingForecast, language]);



  // Master Data Handlers
  const handleAddMaster = async (type: string, name: string, parentId?: string) => {
    const id = `${type}-${Date.now()}`;
    const data: any = { id, name };
    if (type === 'location') data.regionId = parentId;
    if (type === 'cascade') data.locationId = parentId;
    if (type === 'village') data.cascadeId = parentId;

    const res = await ApiService.saveMasterData(type, data);
    if (res.success) {
        if (type === 'region') setRegions([...regions, { id, name }]);
        if (type === 'location' && parentId) setLocations([...locations, { id, name, regionId: parentId }]);
        if (type === 'cascade' && parentId) setCascades([...cascades, { id, name, locationId: parentId }]);
        if (type === 'village' && parentId) setVillages([...villages, { id, name, cascadeId: parentId }]);
        return true;
    }
    return false;
  };

  const handleDeleteMaster = async (type: string, id: string) => {
      const res = await ApiService.deleteMasterData(type, id);
      if (res.success) {
          if (type === 'region') setRegions(regions.filter(r => r.id !== id));
          if (type === 'location') setLocations(locations.filter(l => l.id !== id));
          if (type === 'cascade') setCascades(cascades.filter(c => c.id !== id));
          if (type === 'village') setVillages(villages.filter(v => v.id !== id));
      }
  };

  // Common Props
  const commonProps = { language, setLanguage, t, navigate: setCurrentScreen };

  // Screen-specific props bundles
  const farmerProps = {
    ...commonProps,
    entries, onAddEntry: handleAddEntry, onUpdateEntry: handleUpdateEntry,
    onDeleteEntry: (id: string) => setEntries(entries.filter(e => e.id !== id)),
    onEditEntry: (entry: DiaryEntry) => { setEntryToEdit(entry); setSelectedCategory(entry.category); setCurrentScreen(ScreenName.ADD_EXPENSE); },
    entryToEdit, selectedCategory, setSelectedCategory,
    cultivations, activeCultivationId, setActiveCultivationId,
    onAddCultivation: handleAddCultivation,
    onEditCultivation: (c: Cultivation) => { setCultivationToEdit(c); setCurrentScreen(ScreenName.SELECT_CROP); },
    onDeleteCultivation: (id: string) => setCultivations(cultivations.filter(c => c.id !== id)),
    cultivationToEdit,
    onAddNew: () => { setCultivationToEdit(null); setCurrentScreen(ScreenName.SELECT_CROP); },
    activeCultivation: cultivations.find(c => c.id === activeCultivationId),
    queries, onAddQuery: handleAddQuery,
    marketPosts, onAddMarketPost: handleAddMarketPost,
    currentUser: currentUser || undefined,
    forecasts, isRefreshingForecast,
    onViewForecasts: () => { fetchRealForecast(); setCurrentScreen(ScreenName.FORECAST); }
  };

  const authProps = { ...commonProps, regions, locations, cascades, villages, farmers };

  const adminProps = {
      ...commonProps,
      queries, 
      onResolveQuery: (id: string, sol: string, hasAudio: boolean) => {
          setQueries(queries.map(q => q.id === id ? { ...q, status: 'RESOLVED', solution: sol } : q));
          setCurrentScreen(ScreenName.ADMIN_QUERIES);
      },
      selectedQueryId, onSelectQuery: (id: string) => { setSelectedQueryId(id); setCurrentScreen(ScreenName.ADMIN_QUERY_RESPONSE); },
      regions, locations, cascades, villages,
      addRegion: (n: string) => handleAddMaster('region', n),
      deleteRegion: (id: string) => handleDeleteMaster('region', id),
      addLocation: (rId: string, n: string) => handleAddMaster('location', n, rId),
      deleteLocation: (id: string) => handleDeleteMaster('location', id),
      addCascade: (lId: string, n: string) => handleAddMaster('cascade', n, lId),
      deleteCascade: (id: string) => handleDeleteMaster('cascade', id),
      addVillage: (cId: string, n: string) => handleAddMaster('village', n, cId),
      deleteVillage: (id: string) => handleDeleteMaster('village', id),
      marketPosts
  };

  switch (currentScreen) {
    case ScreenName.WELCOME: return <WelcomeScreen {...authProps} />;
    case ScreenName.LOGIN: return <LoginScreen {...authProps} />;
    case ScreenName.REGISTER: return <RegisterScreen {...authProps} />;
    case ScreenName.FARMER_DASHBOARD: return <FarmerDashboard {...farmerProps} isSyncing={isSyncing} />;
    case ScreenName.MY_CROPS: return <MyCropsScreen {...farmerProps} />;
    case ScreenName.SELECT_CROP: return <SelectCropScreen {...farmerProps} />;
    case ScreenName.DIARY_CATEGORIES: return <DiaryCategoriesScreen {...farmerProps} />;
    case ScreenName.ADD_EXPENSE: return <AddExpenseScreen {...farmerProps} />;
    case ScreenName.ENTRY_LIST: return <EntryListScreen {...farmerProps} />;
    case ScreenName.CROP_SUMMARY: return <CropSummaryScreen {...farmerProps} />;
    case ScreenName.GRAPH_REPORT: return <GraphReportScreen {...farmerProps} />;
    case ScreenName.SETTINGS: return <SettingsScreen {...farmerProps} />;
    case ScreenName.QUERIES_LIST: return <QueriesListScreen {...farmerProps} />;
    case ScreenName.ADD_QUERY: return <AddQueryScreen {...farmerProps} />;
    case ScreenName.MARKETPLACE: return <MarketPlaceScreen {...farmerProps} />;
    case ScreenName.FORECAST: return <ForecastScreen {...farmerProps} />;
    
    // Admin Screens
    case ScreenName.ADMIN_LOGIN: return <AdminLoginScreen {...adminProps} />;
    case ScreenName.ADMIN_DASHBOARD: return <AdminDashboardScreen {...adminProps} />;
    case ScreenName.FARMER_LIST: return <FarmerListScreen {...adminProps} />;
    case ScreenName.FARMER_DETAILS: return <FarmerDetailsScreen {...adminProps} />;
    case ScreenName.ADMIN_ANALYTICS: return <AnalyticsScreen {...adminProps} />;
    case ScreenName.ADMIN_QUERIES: return <AdminQueriesScreen {...adminProps} />;
    case ScreenName.ADMIN_QUERY_RESPONSE: return <AdminQueryResponseScreen {...adminProps} />;
    case ScreenName.ADMIN_MASTER_MENU: return <AdminMasterMenu {...adminProps} />;
    case ScreenName.ADMIN_MASTER_REGION: return <AdminMasterDataScreen {...adminProps} level="Region" />;
    case ScreenName.ADMIN_MASTER_LOCATION: return <AdminMasterDataScreen {...adminProps} level="Location" />;
    case ScreenName.ADMIN_MASTER_CASCADE: return <AdminMasterDataScreen {...adminProps} level="Cascade" />;
    case ScreenName.ADMIN_MASTER_VILLAGE: return <AdminMasterDataScreen {...adminProps} level="Village" />;
    case ScreenName.ADMIN_MARKET: return <AdminMarketScreen {...adminProps} />;
    default: return <WelcomeScreen {...authProps} />;
  }
};

export default App;
