
import React, { useState, useEffect } from 'react';
import { ScreenName, Cultivation, FarmerScreenProps } from '../../types';
import { MobileLayout, Card, Input, Select, Button } from '../../components/ui';
import { ChevronLeft, Plus, Pencil, Trash2 } from 'lucide-react';

export const MyCropsScreen: React.FC<FarmerScreenProps> = ({ navigate, cultivations, activeCultivationId, setActiveCultivationId, onEditCultivation, onDeleteCultivation, onAddNew }) => {
    const handleSelect = (id: string) => {
        setActiveCultivationId(id);
        navigate(ScreenName.FARMER_DASHBOARD);
    };
    return (
        <MobileLayout className="bg-green-50">
            <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                 <div className="flex items-center">
                    <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                    <h2 className="text-lg font-bold">My Crops</h2>
                 </div>
                 <button onClick={onAddNew} className="text-green-600 font-semibold text-sm flex items-center"><Plus className="w-4 h-4 mr-1"/> Add New</button>
            </div>
            <div className="p-4 space-y-4">
                {cultivations.map(cult => (
                    <Card key={cult.id} onClick={() => handleSelect(cult.id)} className={`flex items-center p-3 border-2 relative group ${cult.id === activeCultivationId ? 'border-green-500 bg-green-50' : 'border-transparent'}`}>
                        <img src={cult.image || "https://picsum.photos/seed/crop/100/100"} alt={cult.cropName} className="w-16 h-16 rounded-lg object-cover mr-4" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{cult.cropName}</h3>
                            <div className="text-sm text-gray-500">{cult.landName} • {cult.areaSize} Acres</div>
                        </div>
                        <div className="flex flex-col gap-2 ml-2 z-10" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => onEditCultivation && onEditCultivation(cult)} className="p-2 bg-white rounded-full shadow-sm"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => onDeleteCultivation && onDeleteCultivation(cult.id)} className="p-2 bg-white rounded-full shadow-sm"><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                    </Card>
                ))}
            </div>
        </MobileLayout>
    );
};

export const SelectCropScreen: React.FC<FarmerScreenProps> = ({ navigate, onAddCultivation, onUpdateCultivation, cultivationToEdit }) => {
    const isEditing = !!cultivationToEdit;
    const [landName, setLandName] = useState('');
    const [areaSize, setAreaSize] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [farmingMethod, setFarmingMethod] = useState<'Organic' | 'Inorganic'>('Inorganic');
    const [selectedCrop, setSelectedCrop] = useState<any>(null);
    const [irrigationSource, setIrrigationSource] = useState('');
    const [irrigationMethod, setIrrigationMethod] = useState('');
    
    // New Fields
    const [isInsured, setIsInsured] = useState(false);
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [premiumAmount, setPremiumAmount] = useState('');
    const [claimAmount, setClaimAmount] = useState('');
    const [plantingMethod, setPlantingMethod] = useState<'Direct Seeding' | 'Planting'>('Planting');
    const [irrigationMethodOptions, setIrrigationMethodOptions] = useState<{value:string,label:string}[]>([]);

    // Last Year Data State
    const [lastYearExpense, setLastYearExpense] = useState('');
    const [lastYearYield, setLastYearYield] = useState('');
    const [lastYearIncome, setLastYearIncome] = useState('');

    const crops = [
        { id: '1', name: 'Paddy', img: 'https://picsum.photos/seed/paddy/100/100' },
        { id: '2', name: 'Millets', img: 'https://picsum.photos/seed/millets/100/100' },
        { id: '3', name: 'Groundnut', img: 'https://picsum.photos/seed/groundnut/100/100' },
        { id: '4', name: 'Sugarcane', img: 'https://picsum.photos/seed/sugarcane/100/100' },
    ];

    useEffect(() => {
        if (cultivationToEdit) {
            setLandName(cultivationToEdit.landName);
            setAreaSize(cultivationToEdit.areaSize.toString());
            setStartDate(cultivationToEdit.startDate);
            setFarmingMethod(cultivationToEdit.farmingMethod);
            setIrrigationSource(cultivationToEdit.irrigationSource || '');
            setIrrigationMethod(cultivationToEdit.irrigationMethod || '');
            setIsInsured(cultivationToEdit.isInsured || false);
            setInsuranceProvider(cultivationToEdit.insuranceProvider || '');
            setPremiumAmount(cultivationToEdit.premiumAmount?.toString() || '');
            setClaimAmount(cultivationToEdit.claimAmount?.toString() || '');
            setPlantingMethod(cultivationToEdit.plantingMethod || 'Planting');
            
            // Populate Last Year Data
            setLastYearExpense(cultivationToEdit.lastYearExpense?.toString() || '');
            setLastYearYield(cultivationToEdit.lastYearYield?.toString() || '');
            setLastYearIncome(cultivationToEdit.lastYearIncome?.toString() || '');

            const matchedCrop = crops.find(c => c.name === cultivationToEdit.cropName) || { id: 'custom', name: cultivationToEdit.cropName, img: cultivationToEdit.image };
            setSelectedCrop(matchedCrop);
        }
    }, [cultivationToEdit]);

    useEffect(() => {
        if (['Well Irrigation', 'Borewell Irrigation', 'Farm Pond', 'Community Well'].includes(irrigationSource)) {
            setIrrigationMethodOptions([
                {value:'', label:'Select Method'},
                {value:'Channel', label:'Channel'},
                {value:'Drip Irrigation', label:'Drip Irrigation'},
                {value:'Sprinkler', label:'Sprinkler'},
                {value:'Pipe Irrigation', label:'Pipe Irrigation'}
            ]);
        } else {
            setIrrigationMethodOptions([]);
            setIrrigationMethod('');
        }
    }, [irrigationSource]);

    const handleSubmit = () => {
        if (!selectedCrop) return;
        const newCultivation: Cultivation = {
            id: cultivationToEdit ? cultivationToEdit.id : Date.now().toString(),
            cropName: selectedCrop.name,
            landName: landName.trim() || `${selectedCrop.name} Field`,
            areaSize: areaSize ? parseFloat(areaSize) : 1,
            startDate,
            image: selectedCrop.img,
            farmingMethod,
            irrigationSource,
            irrigationMethod: irrigationMethodOptions.length > 0 ? irrigationMethod : undefined,
            isInsured,
            insuranceProvider: isInsured ? insuranceProvider as any : undefined,
            premiumAmount: isInsured ? parseFloat(premiumAmount) : undefined,
            claimAmount: isInsured ? parseFloat(claimAmount) : undefined,
            plantingMethod,
            // Last Year Data
            lastYearExpense: lastYearExpense ? parseFloat(lastYearExpense) : undefined,
            lastYearYield: lastYearYield ? parseFloat(lastYearYield) : undefined,
            lastYearIncome: lastYearIncome ? parseFloat(lastYearIncome) : undefined,
        };

        if (isEditing && onUpdateCultivation) onUpdateCultivation(newCultivation);
        else onAddCultivation(newCultivation);
        navigate(ScreenName.MY_CROPS);
    };

    return (
        <MobileLayout className="bg-green-50 p-6 overflow-y-auto h-screen flex flex-col">
            <div className="flex items-center mb-6">
                 <button onClick={() => navigate(ScreenName.MY_CROPS)} className="mr-4"><ChevronLeft/></button>
                 <h2 className="text-2xl font-bold text-green-800">{isEditing ? 'Edit Cultivation' : 'New Cultivation'}</h2>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm mb-6 space-y-4">
                <Input label="Land / Field Name" value={landName} onChange={(e) => setLandName(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Area (Acres)" type="number" value={areaSize} onChange={(e) => setAreaSize(e.target.value)} />
                    <Input label="Sowing Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                
                <Select label="Irrigation Source" value={irrigationSource} onChange={e=>setIrrigationSource(e.target.value)} options={[{value:'', label:'Select'}, {value:'Well Irrigation', label:'Well'}, {value:'Borewell Irrigation', label:'Borewell'}, {value:'Tank/Lake Irrigation', label:'Tank'}, {value:'River', label:'River'}, {value:'Farm Pond', label:'Farm Pond'}, {value:'Community Well', label:'Community Well'}]} />
                
                {irrigationMethodOptions.length > 0 && (
                    <Select 
                        label="Irrigation Method" 
                        value={irrigationMethod} 
                        onChange={e=>setIrrigationMethod(e.target.value)} 
                        options={irrigationMethodOptions} 
                    />
                )}
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Planting Method</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['Direct Seeding', 'Planting'].map(m => (
                            <button key={m} onClick={() => setPlantingMethod(m as any)} className={`flex-1 py-2 text-sm rounded-md ${plantingMethod === m ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}>{m}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Farming Method</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setFarmingMethod('Organic')} className={`flex-1 py-2 text-sm rounded-md ${farmingMethod === 'Organic' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}>Organic</button>
                        <button onClick={() => setFarmingMethod('Inorganic')} className={`flex-1 py-2 text-sm rounded-md ${farmingMethod === 'Inorganic' ? 'bg-white shadow text-blue-700' : 'text-gray-500'}`}>Inorganic</button>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked={isInsured} onChange={e => setIsInsured(e.target.checked)} className="w-5 h-5 text-green-600 rounded" />
                        <span className="font-semibold text-gray-700">Crop Insured?</span>
                    </label>
                    {isInsured && (
                        <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                            <Select label="Provider" value={insuranceProvider} onChange={e=>setInsuranceProvider(e.target.value)} options={[{value:'',label:'Select'}, {value:'People Mutual',label:'People Mutual'}, {value:'PMFBY',label:'PMFBY'}, {value:'Private',label:'Private'}]} />
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Premium (₹)" type="number" value={premiumAmount} onChange={e=>setPremiumAmount(e.target.value)} />
                                <Input label="Claim (₹)" type="number" value={claimAmount} onChange={e=>setClaimAmount(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Last Year Data Section */}
                <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Last Year Data (Optional)</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <Input label="Expense (₹)" type="number" value={lastYearExpense} onChange={e => setLastYearExpense(e.target.value)} />
                        <Input label="Yield (Kg)" type="number" value={lastYearYield} onChange={e => setLastYearYield(e.target.value)} />
                        <Input label="Income (₹)" type="number" value={lastYearIncome} onChange={e => setLastYearIncome(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="mb-24">
                <h3 className="font-semibold text-gray-800 mb-3">Select Crop</h3>
                <div className="grid grid-cols-3 gap-3">
                    {crops.map((crop) => (
                        <Card key={crop.id} onClick={() => setSelectedCrop(crop)} className={`flex flex-col items-center p-3 border-2 ${selectedCrop?.name === crop.name ? 'border-green-600 bg-green-50' : 'border-transparent'}`}>
                            <img src={crop.img} alt={crop.name} className="w-16 h-16 rounded-full object-cover mb-2" />
                            <h3 className="text-xs font-semibold text-center">{crop.name}</h3>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto">
                <Button onClick={handleSubmit} disabled={!selectedCrop}>{isEditing ? 'Update' : 'Start'}</Button>
            </div>
        </MobileLayout>
    );
};
