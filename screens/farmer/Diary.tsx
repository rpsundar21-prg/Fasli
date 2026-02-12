
import React from 'react';
import { ScreenName, DiaryCategory, EntryType, FarmerScreenProps } from '../../types';
import { MobileLayout, Button } from '../../components/ui';
import { ChevronLeft, Tractor, Sprout, FlaskConical, Hammer, Scissors, Droplets, User, Sun, Truck, Menu, Scale, Coins, Plus, Calendar, Pencil, Trash2 } from 'lucide-react';

export const DiaryCategoriesScreen: React.FC<FarmerScreenProps> = ({ navigate, setSelectedCategory, t }) => {
    const cultivationCategories = [
        { name: DiaryCategory.LAND_PREP, icon: Tractor },
        { name: DiaryCategory.SEEDS, icon: Sprout },
        { name: DiaryCategory.FERTILIZER, icon: FlaskConical },
        { name: DiaryCategory.PESTICIDE, icon: Hammer },
        { name: DiaryCategory.WEEDING, icon: Scissors },
        { name: DiaryCategory.IRRIGATION, icon: Droplets },
        { name: DiaryCategory.LABOUR, icon: User },
        { name: DiaryCategory.HARVESTING, icon: Sun },
        { name: DiaryCategory.TRANSPORT, icon: Truck },
        { name: DiaryCategory.OTHERS, icon: Menu },
    ];

    const postHarvestCategories = [
        { name: DiaryCategory.YIELD, icon: Scale, color: 'text-blue-700', bg: 'bg-blue-100' },
        { name: DiaryCategory.SALE, icon: Coins, color: 'text-green-700', bg: 'bg-green-100' },
    ];

    const renderCategoryBtn = (cat: any) => (
        <button key={cat.name} onClick={() => { setSelectedCategory(cat.name); navigate(ScreenName.ADD_EXPENSE); }} className="bg-white p-4 rounded-xl flex flex-col items-center justify-center shadow-sm h-32 hover:shadow-md transition-shadow border border-transparent hover:border-green-200">
            <div className={`p-3 rounded-full mb-2 ${cat.bg || 'bg-gray-100'}`}>
                <cat.icon className={`w-6 h-6 ${cat.color || 'text-gray-600'}`} />
            </div>
            <span className="text-xs font-semibold text-center leading-tight text-gray-700">{t(cat.name)}</span>
        </button>
    );

    return (
        <MobileLayout className="bg-green-50">
            <div className="p-6 pb-20 overflow-y-auto h-full">
                <div className="flex items-center mb-6">
                    <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4 bg-white p-2 rounded-full shadow-sm"><ChevronLeft className="w-5 h-5 text-gray-600"/></button>
                    <h2 className="text-xl font-bold text-gray-800">{t('select_category')}</h2>
                </div>
                
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t('cultivation_activities')}</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {cultivationCategories.map(renderCategoryBtn)}
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-green-200 flex-1"></div>
                    <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full whitespace-nowrap">{t('after_harvesting')}</span>
                    <div className="h-px bg-green-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {postHarvestCategories.map(renderCategoryBtn)}
                </div>
            </div>
        </MobileLayout>
    );
};

export const EntryListScreen: React.FC<FarmerScreenProps> = ({ navigate, entries, activeCultivationId, onEditEntry, onDeleteEntry, setSelectedCategory, t }) => {
    const currentEntries = entries.filter(e => e.cultivationId === activeCultivationId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <MobileLayout className="bg-gray-50 flex flex-col h-screen">
             <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                 <div className="flex items-center">
                    <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                    <h2 className="text-lg font-bold">{t('diary_entries')}</h2>
                 </div>
                 <button onClick={() => { setSelectedCategory(DiaryCategory.OTHERS); navigate(ScreenName.DIARY_CATEGORIES); }} className="text-green-600 font-semibold text-sm flex items-center"><Plus className="w-4 h-4 mr-1"/> {t('add_entry')}</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Calendar className="w-12 h-12 mb-2 opacity-20"/>
                        <p>{t('no_entries')}</p>
                    </div>
                ) : (
                    currentEntries.map(entry => (
                         <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600 uppercase">{t(entry.category)}</span>
                                    <span className="text-xs text-gray-400">{entry.date}</span>
                                </div>
                                <p className="text-sm text-gray-800 font-medium line-clamp-1">{entry.description}</p>
                                {entry.quantity && <p className="text-xs text-gray-500 mt-1">{t('qty')}: {entry.quantity}</p>}
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${entry.type === EntryType.INCOME ? 'text-green-600' : (entry.type === EntryType.YIELD ? 'text-blue-600' : 'text-red-600')}`}>
                                    {entry.type === EntryType.YIELD ? `${entry.quantity} Kg` : `₹${entry.amount}`}
                                </p>
                                <div className="flex justify-end gap-3 mt-2">
                                     <button onClick={() => onEditEntry && onEditEntry(entry)} className="text-blue-500"><Pencil className="w-4 h-4"/></button>
                                     <button onClick={() => onDeleteEntry && onDeleteEntry(entry.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            </div>
                         </div>
                    ))
                )}
            </div>
        </MobileLayout>
    );
};
