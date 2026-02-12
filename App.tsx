
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

  const t = (key: string) => {
      const langDict = translations[language];
      if (langDict && langDict[key]) return langDict[key];
      if (translations['en'][key]) return translations['en'][key];
      return key;
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

  // Load Initial Data from D1 via Cloudflare API
  useEffect(() => {
    const initData = async () => {
        setIsSyncing(true);
        try {
            const data = await ApiService.fetchAllData();
            if (data?.cultivations) setCultivations(data.cultivations);
            if (data?.entries) setEntries(data.entries);
            if (data?.queries) setQueries(data.queries);
            if (data?.marketPosts) setMarketPosts(data.marketPosts);
            if (data?.farmer) setCurrentUser(data.farmer);
            
            // Sync Master Data
            if (data?.regions) setRegions(data.regions);
            if (data?.locations) setLocations(data.locations);
            if (data?.cascades) setCascades(data.cascades);
            if (data?.villages) setVillages(data.villages);
            
            if (data?.cultivations?.length > 0) {
                setActiveCultivationId(data.cultivations[0].id);
            }
        } catch (err) {
            console.error("Cloud D1 Load Trace:", err);
        } finally {
            setIsSyncing(false);
        }
    };
    initData();
  }, []);

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

      const jsonStr = response.text.match(/\{.*\}/s)?.[0];
      if (jsonStr) {
        const data = JSON.parse(jsonStr);
        const newForecast: Forecast = {
          id: `f-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          temp: data.temp,
          condition: data.condition,
          chanceOfRain: data.chanceOfRain,
          advice: data.advice,
          regionName: region
        };
        setForecasts([newForecast, ...forecasts]);
      }
    } catch (error) {
      console.error("Forecast fetch failed:", error);
    } finally {
      setIsRefreshingForecast(false);
    }
  }, [currentUser, activeCultivationId, language, forecasts, isRefreshingForecast, cultivations]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [entryToEdit, setEntryToEdit] = useState<DiaryEntry | null>(null);
  const [cultivationToEdit, setCultivationToEdit] = useState<Cultivation | null>(null);
  const [viewedQueryIds, setViewedQueryIds] = useState<string[]>([]);
  const [viewedMarketPostIds, setViewedMarketPostIds] = useState<string[]>([]);
  const [viewedForecastIds, setViewedForecastIds] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') setCurrentScreen(ScreenName.ADMIN_LOGIN);
  }, []);

  const activeCultivation = cultivations.find(c => c.id === activeCultivationId) || cultivations[0];

  const commonProps = { 
    navigate: setCurrentScreen,
    language,
    setLanguage,
    t
  };

  const farmerProps = {
      ...commonProps,
      entries,
      onAddEntry: handleAddEntry,
      onUpdateEntry: handleUpdateEntry,
      onEditEntry: (e: DiaryEntry) => { setEntryToEdit(e); setSelectedCategory(e.category); setCurrentScreen(ScreenName.ADD_EXPENSE); },
      entryToEdit,
      selectedCategory,
      setSelectedCategory,
      cultivations,
      activeCultivationId,
      setActiveCultivationId,
      onAddCultivation: handleAddCultivation,
      onEditCultivation: (c: Cultivation) => { setCultivationToEdit(c); setCurrentScreen(ScreenName.SELECT_CROP); },
      cultivationToEdit,
      activeCultivation,
      queries,
      onAddQuery: handleAddQuery,
      marketPosts,
      onAddMarketPost: handleAddMarketPost,
      currentUser,
      forecasts,
      isRefreshingForecast,
      onViewForecasts: () => { handleViewForecasts(); fetchRealForecast(); },
      isSyncing,
      regions,
      locations,
      cascades,
      villages
  };

  const adminProps = {
    ...commonProps,
    queries,
    onResolveQuery: (id: string, solution: string) => {
        setQueries(prev => prev.map(q => q.id === id ? { ...q, status: 'RESOLVED', solution, solutionDate: new Date().toISOString() } : q));
        setCurrentScreen(ScreenName.ADMIN_QUERIES);
    },
    selectedQueryId,
    onSelectQuery: (id: string) => {
        setSelectedQueryId(id);
        setCurrentScreen(ScreenName.ADMIN_QUERY_RESPONSE);
    },
    regions,
    locations,
    cascades,
    villages,
    addRegion: (name: string) => {
        if (regions.find(r => r.name === name)) return false;
        const newRegion = { id: 'r' + Date.now(), name };
        setRegions([...regions, newRegion]);
        syncWithCloud(() => ApiService.saveMasterData('region', newRegion));
        return true;
    },
    deleteRegion: (id: string) => {
        setRegions(regions.filter(r => r.id !== id));
        syncWithCloud(() => ApiService.deleteMasterData('region', id));
    },
    addLocation: (rId: string, name: string) => {
        if (locations.find(l => l.name === name)) return false;
        const newLoc = { id: 'l' + Date.now(), regionId: rId, name };
        setLocations([...locations, newLoc]);
        syncWithCloud(() => ApiService.saveMasterData('location', newLoc));
        return true;
    },
    deleteLocation: (id: string) => {
        setLocations(locations.filter(l => l.id !== id));
        syncWithCloud(() => ApiService.deleteMasterData('location', id));
    },
    addCascade: (lId: string, name: string) => {
        if (cascades.find(c => c.name === name)) return false;
        const newCasc = { id: 'c' + Date.now(), locationId: lId, name };
        setCascades([...cascades, newCasc]);
        syncWithCloud(() => ApiService.saveMasterData('cascade', newCasc));
        return true;
    },
    deleteCascade: (id: string) => {
        setCascades(cascades.filter(c => c.id !== id));
        syncWithCloud(() => ApiService.deleteMasterData('cascade', id));
    },
    addVillage: (cId: string, name: string) => {
        if (villages.find(v => v.name === name)) return false;
        const newVill = { id: 'v' + Date.now(), cascadeId: cId, name };
        setVillages([...villages, newVill]);
        syncWithCloud(() => ApiService.saveMasterData('village', newVill));
        return true;
    },
    deleteVillage: (id: string) => {
        setVillages(villages.filter(v => v.id !== id));
        syncWithCloud(() => ApiService.deleteMasterData('village', id));
    },
    marketPosts
  };

  const handleViewForecasts = () => {
    const fIds = forecasts.map(f => f.id);
    setViewedForecastIds(prev => [...new Set([...prev, ...fIds])]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.WELCOME: return <WelcomeScreen {...commonProps} />;
      case ScreenName.LOGIN: return <LoginScreen {...commonProps} />;
      case ScreenName.REGISTER: return <RegisterScreen {...farmerProps} />;
      case ScreenName.FARMER_DASHBOARD: return <FarmerDashboard {...farmerProps} />;
      case ScreenName.MY_CROPS: return <MyCropsScreen {...farmerProps} onAddNew={() => { setCultivationToEdit(null); setCurrentScreen(ScreenName.SELECT_CROP); }} />;
      case ScreenName.SELECT_CROP: return <SelectCropScreen {...farmerProps} />;
      case ScreenName.DIARY_CATEGORIES: return <DiaryCategoriesScreen {...farmerProps} />;
      case ScreenName.ADD_EXPENSE: return <AddExpenseScreen {...farmerProps} />;
      case ScreenName.ENTRY_LIST: return <EntryListScreen {...farmerProps} />;
      case ScreenName.MARKETPLACE: return <MarketPlaceScreen {...farmerProps} />;
      case ScreenName.FORECAST: return <ForecastScreen {...farmerProps} />;
      case ScreenName.ADMIN_LOGIN: return <AdminLoginScreen {...commonProps} />;
      case ScreenName.ADMIN_DASHBOARD: return <AdminDashboardScreen {...adminProps} />;
      case ScreenName.ADMIN_MASTER_MENU: return <AdminMasterMenu {...adminProps} />;
      case ScreenName.ADMIN_MASTER_REGION: return <AdminMasterDataScreen {...adminProps} level="Region" />;
      case ScreenName.ADMIN_MASTER_LOCATION: return <AdminMasterDataScreen {...adminProps} level="Location" />;
      case ScreenName.ADMIN_MASTER_CASCADE: return <AdminMasterDataScreen {...adminProps} level="Cascade" />;
      case ScreenName.ADMIN_MASTER_VILLAGE: return <AdminMasterDataScreen {...adminProps} level="Village" />;
      case ScreenName.ADMIN_ANALYTICS: return <AnalyticsScreen {...adminProps} />;
      case ScreenName.ADMIN_QUERIES: return <AdminQueriesScreen {...adminProps} />;
      case ScreenName.ADMIN_QUERY_RESPONSE: return <AdminQueryResponseScreen {...adminProps} />;
      case ScreenName.ADMIN_MARKET: return <AdminMarketScreen {...adminProps} />;
      case ScreenName.FARMER_LIST: return <FarmerListScreen {...adminProps} />;
      case ScreenName.FARMER_DETAILS: return <FarmerDetailsScreen {...adminProps} />;
      case ScreenName.SETTINGS: return <SettingsScreen {...farmerProps} />;
      default: return <WelcomeScreen {...commonProps} />;
    }
  };

  return <>{renderScreen()}</>;
};

export default App;
