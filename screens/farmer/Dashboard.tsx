
import React from 'react';
import { ScreenName, EntryType, DiaryCategory, FarmerScreenProps } from '../../types';
import { MobileLayout, Card } from '../../components/ui';
import { Settings, ChevronDown, AlertCircle, Ruler, CalendarDays, ArrowDownRight, ArrowUpRight, Wallet, Scale, Plus, Calendar, Store, Stethoscope, TrendingUp, CloudRain, Sun, Cloud, Wind, Loader2, RefreshCw } from 'lucide-react';

export const FarmerDashboard: React.FC<FarmerScreenProps & { isSyncing?: boolean }> = ({ navigate, entries, activeCultivationId, activeCultivation, queries, marketPosts, currentUser, viewedQueryIds, onViewQueries, viewedMarketPostIds, onViewMarket, forecasts, viewedForecastIds, onViewForecasts, isRefreshingForecast, isSyncing, t }) => {
  const currentEntries = entries.filter(e => e.cultivationId === activeCultivationId);

  const totalExpense = currentEntries.reduce((sum, item) => {
      let val = 0;
      if (item.type === EntryType.EXPENSE) val = item.amount;
      if (item.category === DiaryCategory.SALE && item.valueAddedCost) val += item.valueAddedCost;
      return sum + val;
  }, 0);
    
  const totalIncome = currentEntries.filter(e => e.type === EntryType.INCOME).reduce((sum, item) => sum + item.amount, 0);
  const profit = totalIncome - totalExpense;
  
  const marketNotifications = marketPosts ? marketPosts.filter(p => p.farmerName !== (currentUser?.name || '') && !viewedMarketPostIds?.includes(p.id)).length : 0;
  const forecastNotifications = forecasts ? forecasts.filter(f => !viewedForecastIds?.includes(f.id)).length : 0;
  const latestForecast = forecasts && forecasts.length > 0 ? forecasts[0] : null;

  const WeatherIcon = () => {
      if (isRefreshingForecast) return <Loader2 className="w-4 h-4 animate-spin text-white" />;
      if (!latestForecast) return <Sun className="w-4 h-4" />;
      switch (latestForecast.condition) {
          case 'Rainy': return <CloudRain className="w-4 h-4 text-blue-200" />;
          case 'Cloudy': return <Cloud className="w-4 h-4 text-gray-200" />;
          case 'Stormy': return <Wind className="w-4 h-4 text-gray-300" />;
          default: return <Sun className="w-4 h-4 text-yellow-200" />;
      }
  };

  return (
    <MobileLayout className="bg-green-50">
      <div className="bg-green-600 p-6 pb-12 rounded-b-3xl relative shadow-lg">
        {isSyncing && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full flex items-center gap-2">
                <RefreshCw className="w-3 h-3 text-white animate-spin" />
                <span className="text-[10px] text-white font-bold tracking-tight">Cloud D1 Sync...</span>
            </div>
        )}
        
        <div className="flex justify-between items-start text-white mb-4">
          <div onClick={() => navigate(ScreenName.MY_CROPS)} className="cursor-pointer group flex-1">
            <p className="opacity-90 text-sm mb-1 flex items-center">{t('current_crop')} <ChevronDown className="w-4 h-4 ml-1"/></p>
            {activeCultivation ? (
                <div className="flex items-start gap-3 mt-1">
                     <img src={activeCultivation.image || "https://picsum.photos/seed/paddy/100/100"} alt="crop" className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md" />
                     <div>
                        <h2 className="text-2xl font-bold leading-tight">{activeCultivation.cropName}</h2>
                        <div className="text-green-100 text-xs mt-1 space-y-1">
                            <div className="flex items-center gap-2 font-medium">
                                <span>{activeCultivation.landName}</span>
                                <span className="bg-green-800 text-green-100 px-1.5 py-0.5 rounded text-[10px] uppercase">D1 Linked</span>
                            </div>
                        </div>
                     </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 mt-2 opacity-80">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-semibold">{t('no_crop_selected')}</span>
                </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button onClick={() => navigate(ScreenName.SETTINGS)} className="p-2 bg-green-700 rounded-full hover:bg-green-800 shadow-sm border border-green-600">
                <Settings className="w-5 h-5" />
            </button>
            {(latestForecast || isRefreshingForecast) && (
                <div 
                    onClick={onViewForecasts}
                    className="flex items-center bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-[10px] border border-white/20 cursor-pointer hover:bg-white/30 transition-colors"
                >
                    <WeatherIcon />
                    {!isRefreshingForecast && latestForecast && <span className="ml-1 font-bold">{latestForecast.temp}°C</span>}
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 space-y-4 relative z-10">
        <div className="grid grid-cols-2 gap-4">
            <Card className="flex flex-col items-center justify-center py-4 border-b-4 border-red-500 shadow-md">
                <ArrowDownRight className="w-6 h-6 text-red-500 mb-2" />
                <p className="text-gray-500 text-xs font-medium">{t('total_expense')}</p>
                <p className="text-lg font-bold text-gray-800">₹ {totalExpense.toLocaleString()}</p>
            </Card>
            <Card className="flex flex-col items-center justify-center py-4 border-b-4 border-green-500 shadow-md">
                <ArrowUpRight className="w-6 h-6 text-green-500 mb-2" />
                <p className="text-gray-500 text-xs font-medium">{t('total_income')}</p>
                <p className="text-lg font-bold text-gray-800">₹ {totalIncome.toLocaleString()}</p>
            </Card>
        </div>

        <Card className="flex flex-col items-center justify-center py-4 border-b-4 border-blue-500 shadow-md">
            <div className="flex w-full justify-between items-center px-4 mb-2">
                <div className="flex items-center">
                    <Wallet className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="text-gray-500 text-sm font-medium">{t('net_profit_loss')}</span>
                </div>
            </div>
            <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profit >= 0 ? '+' : ''} ₹ {profit.toLocaleString()}
            </p>
        </Card>

        <div className="grid grid-cols-3 gap-3 mt-4">
            <button onClick={() => navigate(ScreenName.DIARY_CATEGORIES)} className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-100 hover:border-green-200">
                <div className="bg-green-100 p-2 rounded-full mb-2"><Plus className="w-5 h-5 text-green-700" /></div>
                <span className="text-xs font-semibold text-gray-700">{t('add_entry')}</span>
            </button>
            <button onClick={() => navigate(ScreenName.ENTRY_LIST)} className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-100 hover:border-green-200">
                <div className="bg-blue-100 p-2 rounded-full mb-2"><Calendar className="w-5 h-5 text-blue-700" /></div>
                <span className="text-xs font-semibold text-gray-700">{t('diary_log')}</span>
            </button>
             <button onClick={() => navigate(ScreenName.MARKETPLACE)} className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-100 hover:border-green-200 relative">
                <div className="bg-orange-100 p-2 rounded-full mb-2"><Store className="w-5 h-5 text-orange-600" /></div>
                <span className="text-xs font-semibold text-gray-700">{t('market')}</span>
            </button>
        </div>
      </div>
    </MobileLayout>
  );
};
