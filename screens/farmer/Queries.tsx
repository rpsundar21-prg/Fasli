
import React, { useState } from 'react';
import { ScreenName, FarmerScreenProps } from '../../types';
import { MobileLayout, Button } from '../../components/ui';
import { ChevronLeft, Plus, MessageCircle, Check, Camera, Mic } from 'lucide-react';

export const QueriesListScreen: React.FC<FarmerScreenProps> = ({ navigate, queries, activeCultivationId }) => {
    const cropQueries = queries?.filter(q => q.cultivationId === activeCultivationId) || [];
    
    return (
        <MobileLayout className="bg-gray-50 flex flex-col h-screen">
             <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                 <div className="flex items-center">
                    <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                    <h2 className="text-lg font-bold">Ask Expert</h2>
                 </div>
                 <button onClick={() => navigate(ScreenName.ADD_QUERY)} className="text-green-600 font-semibold text-sm flex items-center"><Plus className="w-4 h-4 mr-1"/> New Query</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {cropQueries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <MessageCircle className="w-12 h-12 mb-2 opacity-20"/>
                        <p>No queries yet.</p>
                        <Button className="mt-4 w-auto" onClick={() => navigate(ScreenName.ADD_QUERY)}>Ask Now</Button>
                    </div>
                 ) : (
                     cropQueries.map(q => (
                         <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                             <div className="flex justify-between items-start mb-2">
                                 <span className="text-xs text-gray-400">{q.date}</span>
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${q.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{q.status}</span>
                             </div>
                             <h3 className="font-semibold text-gray-800 mb-2">{q.question}</h3>
                             {q.imageUrl && <div className="mb-2"><img src={q.imageUrl} alt="query" className="h-20 w-20 object-cover rounded-lg" /></div>}
                             
                             {q.status === 'RESOLVED' && q.solution && (
                                 <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-2">
                                     <p className="text-xs text-green-800 font-bold mb-1 flex items-center"><Check className="w-3 h-3 mr-1"/> Expert Solution:</p>
                                     <p className="text-sm text-gray-700">{q.solution}</p>
                                 </div>
                             )}
                         </div>
                     ))
                 )}
            </div>
        </MobileLayout>
    );
};

export const AddQueryScreen: React.FC<FarmerScreenProps> = ({ navigate, onAddQuery, activeCultivation, activeCultivationId }) => {
    const [question, setQuestion] = useState('');
    const [hasAudio, setHasAudio] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if(!question && !hasAudio) return;
        if(onAddQuery) {
            onAddQuery({
                id: Date.now().toString(),
                cultivationId: activeCultivationId,
                cropName: activeCultivation?.cropName || 'Unknown',
                date: new Date().toISOString().split('T')[0],
                status: 'PENDING',
                question: question || 'Audio Query',
                hasAudio,
                imageUrl: imagePreview || undefined
            });
            navigate(ScreenName.QUERIES_LIST);
        }
    };

    return (
        <MobileLayout className="bg-white flex flex-col h-screen">
             <div className="bg-white p-4 shadow-sm flex items-center border-b">
                <button onClick={() => navigate(ScreenName.QUERIES_LIST)} className="mr-4"><ChevronLeft/></button>
                <h2 className="text-lg font-bold">New Query</h2>
             </div>
             
             <div className="p-6 flex-1">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Describe your issue</label>
                 <textarea 
                    className="w-full border rounded-xl p-4 h-40 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" 
                    placeholder="e.g. My paddy leaves are turning yellow..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                 ></textarea>

                 {imagePreview && (
                     <div className="mt-4">
                         <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                         <button onClick={() => setImagePreview(null)} className="text-xs text-red-500 mt-1">Remove</button>
                     </div>
                 )}

                 <div className="flex gap-4 mt-6">
                     <button onClick={triggerFileInput} className="flex-1 py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-green-400">
                         <Camera className="w-6 h-6 mb-1" />
                         <span className="text-xs">Add Photo</span>
                         <input 
                             type="file" 
                             ref={fileInputRef} 
                             onChange={handleFileChange} 
                             accept="image/*" 
                             className="hidden" 
                         />
                     </button>
                     <button 
                        onClick={() => setHasAudio(!hasAudio)}
                        className={`flex-1 py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 transition-colors ${hasAudio ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 text-gray-500'}`}
                     >
                         <Mic className="w-6 h-6 mb-1" />
                         <span className="text-xs">{hasAudio ? 'Audio Added' : 'Record Audio'}</span>
                     </button>
                 </div>
             </div>

             <div className="p-6 border-t">
                 <Button onClick={handleSubmit} disabled={!question && !hasAudio}>Submit Query</Button>
             </div>
        </MobileLayout>
    );
};
