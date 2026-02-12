
import React, { useState, useEffect } from 'react';
import { ScreenName, MarketType, FarmerScreenProps } from '../../types';
import { MobileLayout, Button, Input } from '../../components/ui';
import { ChevronLeft, Plus, ChevronDown, Phone } from 'lucide-react';

export const MarketPlaceScreen: React.FC<FarmerScreenProps> = ({ navigate, marketPosts, onAddMarketPost, currentUser }) => {
    const [view, setView] = useState<'BUY' | 'SELL' | 'RENT'>('SELL'); 
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [postType, setPostType] = useState<MarketType>(MarketType.SALE);
    const [itemName, setItemName] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (showForm) {
            // Default form type based on view
            // If viewing SALE posts -> I probably want to Sell (Post Type SALE)
            // If viewing DEMAND posts -> I probably want to Buy (Post Type DEMAND)
            if (view === 'SELL') setPostType(MarketType.SALE);
            else if (view === 'BUY') setPostType(MarketType.DEMAND);
        }
    }, [showForm, view]);
    
    const handlePost = () => {
        if (!itemName || !qty || !price) return;
        if (onAddMarketPost) {
            onAddMarketPost({
                id: Date.now().toString(),
                farmerName: currentUser?.name || 'Me',
                type: postType,
                itemName,
                quantity: parseFloat(qty),
                amount: parseFloat(price),
                date: new Date().toISOString().split('T')[0],
                contact: currentUser?.mobile
            });
            setShowForm(false);
            setItemName(''); setQty(''); setPrice('');
        }
    };

    // Filter posts based on the view
    // 'SELL' View -> Shows items FOR SALE (MarketType.SALE)
    // 'BUY' View -> Shows items WANTED (MarketType.DEMAND)
    const filteredPosts = marketPosts?.filter(p => {
        if (view === 'SELL') return p.type === MarketType.SALE;
        if (view === 'BUY') return p.type === MarketType.DEMAND;
        return true;
    }) || [];

    return (
        <MobileLayout className="bg-gray-50 flex flex-col h-screen">
             <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                 <div className="flex items-center">
                    <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                    <h2 className="text-lg font-bold">Marketplace</h2>
                 </div>
                 <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center shadow-green-200 shadow-md"><Plus className="w-4 h-4 mr-1"/> Post Ad</button>
            </div>
            
            <div className="bg-white border-b px-4 flex gap-4">
                <button onClick={() => setView('SELL')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${view==='SELL' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'}`}>FOR SALE</button>
                <button onClick={() => setView('BUY')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${view==='BUY' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'}`}>WANTED / DEMAND</button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 animate-in slide-in-from-bottom-10 fade-in-20">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Create New Post</h3>
                            <button onClick={() => setShowForm(false)} className="p-1 bg-gray-100 rounded-full"><ChevronDown className="w-5 h-5"/></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button onClick={() => setPostType(MarketType.SALE)} className={`flex-1 py-2 text-sm rounded-md transition-all ${postType === MarketType.SALE ? 'bg-white shadow text-green-700 font-bold' : 'text-gray-500'}`}>I want to Sell</button>
                                <button onClick={() => setPostType(MarketType.DEMAND)} className={`flex-1 py-2 text-sm rounded-md transition-all ${postType === MarketType.DEMAND ? 'bg-white shadow text-blue-700 font-bold' : 'text-gray-500'}`}>I want to Buy</button>
                            </div>
                            <Input label="Item Name" placeholder="e.g. Paddy Seeds, Tractor" value={itemName} onChange={e=>setItemName(e.target.value)}/>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Quantity" type="number" value={qty} onChange={e=>setQty(e.target.value)}/>
                                <Input label={postType === MarketType.SALE ? "Price (₹)" : "Budget (₹)"} type="number" value={price} onChange={e=>setPrice(e.target.value)}/>
                            </div>
                            <Button onClick={handlePost}>Post Now</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>No {view === 'SELL' ? 'Sale' : 'Demand'} posts found.</p>
                    </div>
                ) : (
                    filteredPosts.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${post.type === MarketType.SALE ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <div className="ml-3">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${post.type === MarketType.SALE ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {post.type === MarketType.SALE ? 'For Sale' : 'Wanted'}
                                </span>
                                <span className="text-xs text-gray-400">{post.date}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg">{post.itemName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{post.quantity} units • <span className="font-bold text-gray-900">₹{post.amount}</span></p>
                            
                            <div className="flex items-center justify-between border-t pt-2 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{post.farmerName.charAt(0)}</div>
                                    <span className="text-xs font-medium text-gray-600">{post.farmerName}</span>
                                </div>
                                {post.contact && (
                                    <button className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                        <Phone className="w-3 h-3 mr-1"/> {post.contact}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </MobileLayout>
    );
};
