
import React from 'react';
import { ScreenName, FarmerScreenProps } from '../../types';
import { MobileLayout, Card } from '../../components/ui';
import { ChevronLeft, CloudRain, Sun, Cloud, Wind, Thermometer, Droplets, Info, CalendarDays, Loader2 } from 'lucide-react';

export const ForecastScreen: React.FC<FarmerScreenProps> = ({ navigate, forecasts, currentUser, t, isRefreshingForecast }) => {
    const latest = forecasts && forecasts.length > 0 ? forecasts[0] : null;

    const WeatherIconLarge = ({ condition }: { condition?: string }) => {
        if (isRefreshingForecast) return <Loader2 className="w-20 h-20 text-green-300 animate-spin" />;
        switch (condition) {
            case 'Rainy': return <CloudRain className="w-20 h-20 text-blue-500" />;
            case 'Cloudy': return <Cloud className="w-20 h-20 text-gray-400" />;
            case 'Stormy': return <Wind className="w-20 h-20 text-gray-600" />;
            default: return <Sun className="w-20 h-20 text-yellow-500" />;
        }
    };

    return (
        <MobileLayout className="bg-white flex flex-col h-screen">
             <div className="bg-white p-4 shadow-sm flex items-center border-b">
                <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                <div className="flex-1">
                    <h2 className="text-lg font-bold">{t('forecast_title')}</h2>
                    {isRefreshingForecast && <p className="text-[10px] text-green-600 font-bold animate-pulse">Refreshing Live Data...</p>}
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {(latest || isRefreshingForecast) ? (
                     <>
                        <div className="text-center space-y-2">
                            <p className="text-sm font-bold text-green-700 uppercase tracking-widest">{latest?.regionName || 'Searching Area...'}</p>
                            <p className="text-gray-400 text-xs">{t('updated_for')}: {latest?.date || 'Today'}</p>
                        </div>

                        <div className="flex flex-col items-center py-4 bg-gradient-to-b from-blue-50 to-white rounded-3xl border border-blue-100 relative overflow-hidden">
                            {latest?.id !== 'f-initial' && !isRefreshingForecast && (
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                    Live
                                </div>
                            )}
                            <WeatherIconLarge condition={latest?.condition} />
                            <h3 className="text-4xl font-black text-gray-800 mt-4">{latest?.temp || '--'}°C</h3>
                            <p className="text-xl font-semibold text-blue-600">{latest?.condition ? t(latest.condition) : '...'}</p>
                            
                            <div className="flex gap-8 mt-6">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center text-gray-500 text-xs mb-1">
                                        <Droplets className="w-3 h-3 mr-1" /> {t('chance_of_rain')}
                                    </div>
                                    <p className="font-bold">{latest?.chanceOfRain || 0}%</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200"></div>
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center text-gray-500 text-xs mb-1">
                                        <Thermometer className="w-3 h-3 mr-1" /> {t('max_temp')}
                                    </div>
                                    <p className="font-bold">{(latest?.temp || 30) + 3}°C</p>
                                </div>
                            </div>
                        </div>

                        <Card className="bg-orange-50 border-l-4 border-orange-400 p-5">
                            <div className="flex items-start gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <Info className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-orange-900 mb-1">{t('farmers_advice')}</h4>
                                    <p className="text-sm text-orange-800 leading-relaxed italic">
                                        {latest?.advice ? (latest.advice.startsWith('forecast_') ? t(latest.advice) : latest.advice) : 'AI is analyzing weather for your crops...'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-700 text-sm flex items-center">
                                <CalendarDays className="w-4 h-4 mr-2" /> {t('next_3_days')}
                            </h4>
                            {[1, 2, 3].map(day => (
                                <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-bold text-gray-600 w-12">{t('day_prefix')} {day}</p>
                                        {day === 1 ? <CloudRain className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs text-gray-400">{day === 1 ? t('Rainy') : t('Sunny')}</p>
                                        <p className="font-bold text-gray-800">30°C</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <CloudRain className="w-12 h-12 mb-2 opacity-20"/>
                        <p>{t('loading_forecast')}</p>
                     </div>
                 )}
             </div>

             <div className="p-6 bg-green-50 border-t border-green-100">
                 <p className="text-[10px] text-green-700 text-center font-medium">
                     {t('forecast_service_footer')}
                 </p>
             </div>
        </MobileLayout>
    );
};
