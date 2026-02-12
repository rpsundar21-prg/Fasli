
// Enums
export enum UserRole {
  FARMER = 'FARMER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

export enum ScreenName {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  OTP_LOGIN = 'OTP_LOGIN',
  REGISTER = 'REGISTER',
  FARMER_DASHBOARD = 'FARMER_DASHBOARD',
  MY_CROPS = 'MY_CROPS',
  SELECT_CROP = 'SELECT_CROP',
  DIARY_CATEGORIES = 'DIARY_CATEGORIES',
  ADD_EXPENSE = 'ADD_EXPENSE',
  ENTRY_LIST = 'ENTRY_LIST',
  CROP_SUMMARY = 'CROP_SUMMARY',
  GRAPH_REPORT = 'GRAPH_REPORT',
  SETTINGS = 'SETTINGS',
  QUERIES_LIST = 'QUERIES_LIST',
  ADD_QUERY = 'ADD_QUERY',
  MARKETPLACE = 'MARKETPLACE',
  FORECAST = 'FORECAST', // New
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  FARMER_LIST = 'FARMER_LIST',
  FARMER_DETAILS = 'FARMER_DETAILS',
  ADMIN_ANALYTICS = 'ADMIN_ANALYTICS',
  ADMIN_QUERIES = 'ADMIN_QUERIES',
  ADMIN_QUERY_RESPONSE = 'ADMIN_QUERY_RESPONSE',
  ADMIN_MASTER_MENU = 'ADMIN_MASTER_MENU',
  ADMIN_MASTER_REGION = 'ADMIN_MASTER_REGION',
  ADMIN_MASTER_LOCATION = 'ADMIN_MASTER_LOCATION',
  ADMIN_MASTER_CASCADE = 'ADMIN_MASTER_CASCADE',
  ADMIN_MASTER_VILLAGE = 'ADMIN_MASTER_VILLAGE',
  ADMIN_MARKET = 'ADMIN_MARKET',
}

export enum EntryType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  YIELD = 'YIELD',
}

export enum DiaryCategory {
  LAND_PREP = 'Land Prep',
  SEEDS = 'Seeds',
  FERTILIZER = 'Fertilizer',
  PESTICIDE = 'Pesticide',
  LABOUR = 'Labour',
  WEEDING = 'Weed Control', 
  IRRIGATION = 'Irrigation',
  TRANSPORT = 'Transport',
  HARVESTING = 'Harvesting',
  OTHERS = 'Others',
  YIELD = 'Yield',
  SALE = 'Marketing / Sale',
}

export enum MarketType {
    SALE = 'SALE',
    DEMAND = 'DEMAND'
}

export enum MembershipType {
    VAYALAGAM = 'Vayalagam',
    KALANJIAM = 'Kalanjiam',
    NON_MEMBER = 'Non Member'
}

// Master Data Interfaces
export interface Region { id: string; name: string; }
export interface Location { id: string; regionId: string; name: string; }
export interface Cascade { id: string; locationId: string; name: string; } 
export interface Village { id: string; cascadeId: string; name: string; }

// Interfaces
export interface Cultivation {
  id: string;
  cropName: string;
  landName: string;
  areaSize: number;
  startDate: string;
  image?: string;
  farmingMethod: 'Organic' | 'Inorganic'; 
  irrigationSource?: string;
  irrigationMethod?: string;
  isInsured?: boolean;
  insuranceProvider?: 'People Mutual' | 'PMFBY' | 'Private';
  premiumAmount?: number;
  claimAmount?: number;
  plantingMethod?: 'Direct Seeding' | 'Planting';
  lastYearExpense?: number;
  lastYearYield?: number;
  lastYearIncome?: number;
}

export interface DiarySubItem {
    id: string;
    name: string;
    quantity: number;
    amount: number;
}

export interface DiaryEntry {
  id: string;
  cultivationId: string;
  date: string;
  category: DiaryCategory;
  type: EntryType;
  amount: number;
  quantity?: number;
  description: string;
  imageUrl?: string;
  subItems?: DiarySubItem[];
  landWorkType?: string; 
  labourWorkType?: string; 
  labourCount?: number; 
  weedingMode?: 'Machine' | 'Labour';
  weedMachineOwnership?: 'Own' | 'Rental'; 
  machineCount?: number;
  machineRent?: number;
  labourWage?: number; 
  harvestingMode?: 'Machine' | 'Labour';
  harvestingMachineOwnership?: 'Own' | 'Rental';
  harvestingHours?: number;
  harvestingRentPerHour?: number;
  seedSource?: string; 
  seedSuggestedBy?: string; 
  seedTreatment?: boolean;
  seedTreatmentCost?: number;
  chemSuggestedBy?: string; 
  resilienceMode?: string; 
  chemSource?: string; 
  saleType?: 'Raw' | 'Value Added';
  buyerType?: string; 
  valueAddedCost?: number; 
}

export interface Query {
  id: string;
  cultivationId: string;
  cropName: string;
  date: string;
  status: 'PENDING' | 'RESOLVED';
  question: string;
  imageUrl?: string;
  hasAudio?: boolean;
  solution?: string;
  hasSolutionAudio?: boolean;
  solutionDate?: string;
}

export interface MarketPost {
    id: string;
    farmerName: string;
    type: MarketType;
    itemName: string;
    quantity: number;
    amount?: number; 
    date: string;
    contact?: string;
}

export interface Forecast {
    id: string;
    date: string;
    temp: number;
    condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Stormy';
    chanceOfRain: number;
    advice: string;
    regionName: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  mobile: string;
  regionId?: string;
  locationId?: string;
  cascadeId?: string;
  villageId?: string;
  primaryCrop: string;
  membershipType?: MembershipType;
  jointYear?: string;
}

export interface CommonProps {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
}

export interface FarmerScreenProps extends CommonProps {
  navigate: (screen: ScreenName) => void;
  entries: DiaryEntry[];
  onAddEntry: (entry: DiaryEntry) => void;
  onUpdateEntry?: (entry: DiaryEntry) => void;
  onDeleteEntry?: (id: string) => void;
  onEditEntry?: (entry: DiaryEntry) => void;
  entryToEdit?: DiaryEntry | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  cultivations: Cultivation[];
  activeCultivationId: string;
  setActiveCultivationId: (id: string) => void;
  onAddCultivation: (c: Cultivation) => void;
  onUpdateCultivation?: (c: Cultivation) => void;
  onDeleteCultivation?: (id: string) => void;
  onEditCultivation?: (c: Cultivation) => void;
  onAddNew?: () => void;
  cultivationToEdit?: Cultivation | null;
  activeCultivation?: Cultivation;
  queries?: Query[];
  onAddQuery?: (q: Query) => void;
  marketPosts?: MarketPost[];
  onAddMarketPost?: (p: MarketPost) => void;
  currentUser?: FarmerProfile;
  
  forecasts?: Forecast[];
  isRefreshingForecast?: boolean;
  viewedForecastIds?: string[];
  onViewForecasts?: () => void;
  
  viewedQueryIds?: string[];
  onViewQueries?: () => void;
  viewedMarketPostIds?: string[];
  onViewMarket?: () => void;
}

export interface AuthScreenProps extends CommonProps {
  navigate: (screen: ScreenName) => void;
  regions?: Region[];
  locations?: Location[];
  cascades?: Cascade[];
  villages?: Village[];
  farmers?: FarmerProfile[];
}

export interface AdminScreenProps extends CommonProps {
  navigate: (screen: ScreenName) => void;
  queries?: Query[];
  onResolveQuery?: (id: string, solution: string, hasAudio: boolean) => void;
  selectedQueryId?: string | null;
  onSelectQuery?: (id: string) => void;
  level?: 'Region' | 'Location' | 'Cascade' | 'Village';
  regions?: Region[];
  locations?: Location[];
  cascades?: Cascade[];
  villages?: Village[];
  addRegion?: (name: string) => boolean;
  deleteRegion?: (id: string) => void;
  addLocation?: (rId: string, name: string) => boolean;
  deleteLocation?: (id: string) => void;
  addCascade?: (lId: string, name: string) => boolean;
  deleteCascade?: (id: string) => void;
  addVillage?: (cId: string, name: string) => boolean;
  deleteVillage?: (id: string) => void;
  marketPosts?: MarketPost[];
}
