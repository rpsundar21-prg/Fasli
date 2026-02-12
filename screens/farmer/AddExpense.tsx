import React, { useState, useEffect, useRef } from 'react';
import { ScreenName, DiaryCategory, EntryType, DiarySubItem, DiaryEntry, FarmerScreenProps } from '../../types';
import { MobileLayout, Button, Input, Select } from '../../components/ui';
import { ChevronLeft, Scale, Pencil, Trash2 } from 'lucide-react';

export const AddExpenseScreen: React.FC<FarmerScreenProps> = ({ navigate, entries, selectedCategory, onAddEntry, onUpdateEntry, entryToEdit, activeCultivationId, activeCultivation }) => {
    const isEditing = !!entryToEdit;
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    
    // Detailed Fields State
    const [landWorkType, setLandWorkType] = useState('');
    const [labourWorkType, setLabourWorkType] = useState('');
    const [labourCount, setLabourCount] = useState('');
    
    // Weeding State
    const [weedingMode, setWeedingMode] = useState<'Machine' | 'Labour'>('Labour');
    const [weedMachineOwnership, setWeedMachineOwnership] = useState<'Own' | 'Rental'>('Rental'); 
    const [weedLabourCount, setWeedLabourCount] = useState('');
    const [weedWage, setWeedWage] = useState('');
    const [weedMachineCount, setWeedMachineCount] = useState('');
    const [weedRent, setWeedRent] = useState('');

    // Harvesting State
    const [harvestingMode, setHarvestingMode] = useState<'Machine' | 'Labour'>('Labour');
    const [harvestingMachineOwnership, setHarvestingMachineOwnership] = useState<'Own' | 'Rental'>('Rental');
    const [harvestingHours, setHarvestingHours] = useState('');
    const [harvestingRentPerHour, setHarvestingRentPerHour] = useState('');

    // Seed/Chem State
    const [suggestedBy, setSuggestedBy] = useState('');
    const [resilienceMode, setResilienceMode] = useState('');
    const [source, setSource] = useState('');
    const [seedTreatment, setSeedTreatment] = useState(false);
    const [seedTreatmentCost, setSeedTreatmentCost] = useState('');
    
    // Sub Items State for Fertilizer/Pesticide
    const [subItems, setSubItems] = useState<DiarySubItem[]>([]);
    const [subName, setSubName] = useState('');
    const [subQty, setSubQty] = useState('');
    const [subAmount, setSubAmount] = useState('');
    const [editingSubId, setEditingSubId] = useState<string | null>(null);

    // Marketing State
    const [saleType, setSaleType] = useState<'Raw' | 'Value Added'>('Raw');
    const [buyerType, setBuyerType] = useState('');
    const [valueAddedCost, setValueAddedCost] = useState('');

    const quantityInputRef = useRef<HTMLInputElement>(null);

    const isLandPrep = selectedCategory === DiaryCategory.LAND_PREP;
    const isLabour = selectedCategory === DiaryCategory.LABOUR;
    const isWeeding = selectedCategory === DiaryCategory.WEEDING;
    const isSeeds = selectedCategory === DiaryCategory.SEEDS;
    const isChem = selectedCategory === DiaryCategory.FERTILIZER || selectedCategory === DiaryCategory.PESTICIDE;
    const isSale = selectedCategory === DiaryCategory.SALE;
    const isYield = selectedCategory === DiaryCategory.YIELD;
    const isIrrigation = selectedCategory === DiaryCategory.IRRIGATION;
    const isHarvesting = selectedCategory === DiaryCategory.HARVESTING;
    const isOthers = selectedCategory === DiaryCategory.OTHERS;
    const isInorganic = activeCultivation?.farmingMethod === 'Inorganic';

    // Calculation Logic for Sale Balance
    const totalYield = entries
        .filter(e => e.cultivationId === activeCultivationId && e.type === EntryType.YIELD)
        .reduce((sum, e) => sum + (e.quantity || 0), 0);

    const totalSold = entries
        .filter(e => e.cultivationId === activeCultivationId && e.category === DiaryCategory.SALE)
        .reduce((sum, e) => sum + (e.quantity || 0), 0);

    const balanceStock = Math.max(0, totalYield - totalSold);

    useEffect(() => {
        if (entryToEdit) {
            setDate(entryToEdit.date);
            setAmount(entryToEdit.amount.toString());
            setQuantity(entryToEdit.quantity?.toString() || '');
            setDescription(entryToEdit.description);
            
            // Map fields based on category
            if (isLandPrep) setLandWorkType(entryToEdit.landWorkType || '');
            if (isLabour) {
                setLabourWorkType(entryToEdit.labourWorkType || '');
                setLabourCount(entryToEdit.labourCount?.toString() || '');
            }
            if (isWeeding) {
                setWeedingMode(entryToEdit.weedingMode || 'Labour');
                if (entryToEdit.weedingMode === 'Machine') {
                    setWeedMachineOwnership(entryToEdit.weedMachineOwnership || 'Rental');
                    setWeedMachineCount(entryToEdit.machineCount?.toString() || '');
                    setWeedRent(entryToEdit.machineRent?.toString() || '');
                } else {
                    setWeedLabourCount(entryToEdit.labourCount?.toString() || '');
                    setWeedWage(entryToEdit.labourWage?.toString() || '');
                }
            }
            if (isHarvesting) {
                setHarvestingMode(entryToEdit.harvestingMode || 'Labour');
                if (entryToEdit.harvestingMode === 'Machine') {
                    setHarvestingMachineOwnership(entryToEdit.harvestingMachineOwnership || 'Rental');
                    setHarvestingHours(entryToEdit.harvestingHours?.toString() || '');
                    setHarvestingRentPerHour(entryToEdit.harvestingRentPerHour?.toString() || '');
                }
            }
            if (isSeeds) {
                setSuggestedBy(entryToEdit.seedSuggestedBy || '');
                setSource(entryToEdit.seedSource || '');
                setSeedTreatment(entryToEdit.seedTreatment || false);
                setSeedTreatmentCost(entryToEdit.seedTreatmentCost?.toString() || '');
            }
            if (isChem) {
                setSuggestedBy(entryToEdit.chemSuggestedBy || '');
                setSource(entryToEdit.chemSource || '');
                setResilienceMode(entryToEdit.resilienceMode || '');
                setSubItems(entryToEdit.subItems || []);
            }
            if (isSale) {
                setSaleType(entryToEdit.saleType || 'Raw');
                setBuyerType(entryToEdit.buyerType || '');
                setValueAddedCost(entryToEdit.valueAddedCost?.toString() || '');
            }
        }
    }, [entryToEdit, isLandPrep, isLabour, isWeeding, isHarvesting, isSeeds, isChem, isSale]);

    // Hide Amount logic (Standard fields)
    const hideAmount = isYield || (isSeeds && source === 'Own') || (isWeeding && weedingMode === 'Machine' && weedMachineOwnership === 'Own') || (isHarvesting && harvestingMode === 'Machine' && harvestingMachineOwnership === 'Own') || isChem;
    
    // Auto Calculate Chem Totals
    useEffect(() => {
        if (isChem) {
            const totalQty = subItems.reduce((acc, item) => acc + item.quantity, 0);
            const totalAmt = subItems.reduce((acc, item) => acc + item.amount, 0);
            setQuantity(totalQty.toString());
            setAmount(totalAmt.toString());
        }
    }, [subItems, isChem]);

    // Auto Calculate Weeding Amount
    useEffect(() => {
        if (isWeeding) {
            let total = 0;
            if (weedingMode === 'Labour') {
                const count = parseFloat(weedLabourCount) || 0;
                const wage = parseFloat(weedWage) || 0;
                total = count * wage;
            } else {
                if (weedMachineOwnership === 'Rental') {
                    const count = parseFloat(weedMachineCount) || 0;
                    const rent = parseFloat(weedRent) || 0;
                    total = count * rent;
                } else {
                    total = 0; // Own machine
                }
            }
            if (total > 0 || (weedingMode === 'Machine' && weedMachineOwnership === 'Own')) setAmount(total.toString());
        }
    }, [isWeeding, weedingMode, weedLabourCount, weedWage, weedMachineCount, weedRent, weedMachineOwnership]);

    // Auto Calculate Harvesting Amount
    useEffect(() => {
        if (isHarvesting) {
            let total = 0;
            if (harvestingMode === 'Machine') {
                if (harvestingMachineOwnership === 'Rental') {
                    const hrs = parseFloat(harvestingHours) || 0;
                    const rent = parseFloat(harvestingRentPerHour) || 0;
                    total = hrs * rent;
                    setAmount(total.toString());
                } else {
                    setAmount('0'); // Own machine
                }
            } 
        }
    }, [isHarvesting, harvestingMode, harvestingMachineOwnership, harvestingHours, harvestingRentPerHour]);

    // Sub Item Handlers
    const handleAddSubItem = () => {
        if (!subName || !subQty || !subAmount) {
            alert("Please fill all item details");
            return;
        }
        const newItem: DiarySubItem = {
            id: Date.now().toString(),
            name: subName,
            quantity: parseFloat(subQty),
            amount: parseFloat(subAmount)
        };
        setSubItems([...subItems, newItem]);
        setSubName('');
        setSubQty('');
        setSubAmount('');
    };

    const handleEditSubItem = (item: DiarySubItem) => {
        setSubName(item.name);
        setSubQty(item.quantity.toString());
        setSubAmount(item.amount.toString());
        setEditingSubId(item.id);
    };

    const handleUpdateSubItem = () => {
        if (!editingSubId) return;
        setSubItems(subItems.map(item => item.id === editingSubId ? { ...item, name: subName, quantity: parseFloat(subQty), amount: parseFloat(subAmount) } : item));
        setEditingSubId(null);
        setSubName('');
        setSubQty('');
        setSubAmount('');
    };

    const handleDeleteSubItem = (id: string) => {
        setSubItems(subItems.filter(item => item.id !== id));
    };

    const handleSave = () => {
        const numAmount = hideAmount ? (isChem ? (parseFloat(amount) || 0) : 0) : (parseFloat(amount) || 0);
        const numQty = parseFloat(quantity) || 0;

        // Validation
        if (isChem && subItems.length === 0) {
            alert(`Please add at least one ${selectedCategory} item.`);
            return;
        }

        // Sale Validation
        if (isSale) {
             let effectiveBalance = balanceStock;
             if (isEditing && entryToEdit && entryToEdit.category === DiaryCategory.SALE) {
                 effectiveBalance += (entryToEdit.quantity || 0);
             }
             if (numQty > effectiveBalance) {
                 window.alert(`🚫 You don't have that much quantity!\nAvailable: ${effectiveBalance} Kg`);
                 if (quantityInputRef.current) {
                     quantityInputRef.current.focus();
                     quantityInputRef.current.select();
                 }
                 return;
             }
        }

        const entry: DiaryEntry = {
            id: entryToEdit ? entryToEdit.id : Date.now().toString(),
            cultivationId: activeCultivationId,
            date,
            category: selectedCategory as DiaryCategory,
            type: isSale ? EntryType.INCOME : (isYield ? EntryType.YIELD : EntryType.EXPENSE),
            amount: numAmount,
            quantity: numQty > 0 ? numQty : undefined,
            description: description || 'No description',
            // Extended details logic
            landWorkType: isLandPrep ? landWorkType : undefined,
            labourWorkType: isLabour ? labourWorkType : undefined,
            labourCount: isLabour 
                ? parseFloat(labourCount) 
                : (isWeeding && weedingMode === 'Labour' ? parseFloat(weedLabourCount) : undefined),
            // Weeding details
            weedingMode: isWeeding ? weedingMode : undefined,
            weedMachineOwnership: isWeeding && weedingMode === 'Machine' ? weedMachineOwnership : undefined,
            machineCount: isWeeding && weedingMode === 'Machine' ? parseFloat(weedMachineCount) : undefined,
            machineRent: isWeeding && weedingMode === 'Machine' && weedMachineOwnership === 'Rental' ? parseFloat(weedRent) : undefined,
            labourWage: isWeeding && weedingMode === 'Labour' ? parseFloat(weedWage) : undefined,
            
            // Harvesting details
            harvestingMode: isHarvesting ? harvestingMode : undefined,
            harvestingMachineOwnership: isHarvesting && harvestingMode === 'Machine' ? harvestingMachineOwnership : undefined,
            harvestingHours: isHarvesting && harvestingMode === 'Machine' && harvestingMachineOwnership === 'Rental' ? parseFloat(harvestingHours) : undefined,
            harvestingRentPerHour: isHarvesting && harvestingMode === 'Machine' && harvestingMachineOwnership === 'Rental' ? parseFloat(harvestingRentPerHour) : undefined,

            // Seed details
            seedSuggestedBy: isSeeds ? suggestedBy : undefined,
            seedSource: isSeeds ? source : undefined,
            seedTreatment: isSeeds ? seedTreatment : undefined,
            seedTreatmentCost: isSeeds && seedTreatment ? parseFloat(seedTreatmentCost) : undefined,
            // Chemical details (Fertilizer/Pesticide)
            chemSuggestedBy: isChem ? suggestedBy : undefined,
            resilienceMode: isChem && suggestedBy === 'Resilience Center' ? resilienceMode : undefined,
            chemSource: isChem ? source : undefined,
            subItems: isChem ? subItems : undefined,
            
            // Sale details
            saleType: isSale ? saleType : undefined,
            buyerType: isSale ? buyerType : undefined,
            valueAddedCost: (isSale && saleType === 'Value Added') ? parseFloat(valueAddedCost) : undefined
        };
        
        let successMessage = "";

        if (isEditing && onUpdateEntry) {
            onUpdateEntry(entry);
            successMessage = `Entry Updated Successfully!\n\nCategory: ${selectedCategory}\nDate: ${date}\n${entry.type === EntryType.YIELD ? `Qty: ${numQty} Kg` : `Amount: ₹${numAmount}`}`;
            window.alert(successMessage);
            navigate(ScreenName.ENTRY_LIST);
        } else {
            onAddEntry(entry);
            successMessage = `Entry Added Successfully!\n\nCategory: ${selectedCategory}\nDate: ${date}\n${entry.type === EntryType.YIELD ? `Qty: ${numQty} Kg` : `Amount: ₹${numAmount}`}`;
            window.alert(successMessage);
            navigate(ScreenName.DIARY_CATEGORIES);
        }
    };

    const renderDetails = () => {
        if (isLandPrep) return (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                <Input 
                    label="Type of Work" 
                    placeholder="e.g. Ploughing, Leveling"
                    value={landWorkType} 
                    onChange={e=>setLandWorkType(e.target.value)} 
                />
            </div>
        );

        if (isLabour) return (
             <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                <Input 
                    label="Type of Work" 
                    placeholder="e.g. Sowing, Weeding, Harvesting"
                    value={labourWorkType} 
                    onChange={e=>setLabourWorkType(e.target.value)} 
                />
                <Input 
                    label="No. of Labour" 
                    type="number"
                    value={labourCount} 
                    onChange={e=>setLabourCount(e.target.value)} 
                />
            </div>
        );

        if (isWeeding) return (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                 <div className="flex bg-white rounded-lg p-1 border">
                    <button onClick={() => setWeedingMode('Labour')} className={`flex-1 py-2 text-sm rounded ${weedingMode==='Labour' ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-500'}`}>Labour</button>
                    <button onClick={() => setWeedingMode('Machine')} className={`flex-1 py-2 text-sm rounded ${weedingMode==='Machine' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-500'}`}>Machine</button>
                </div>
                {weedingMode === 'Labour' ? (
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="No. of Labour" type="number" value={weedLabourCount} onChange={e=>setWeedLabourCount(e.target.value)} />
                        <Input label="Wages / Labour" type="number" value={weedWage} onChange={e=>setWeedWage(e.target.value)} />
                    </div>
                ) : (
                    <div className="space-y-3">
                         <div className="flex bg-white rounded-lg p-1 border">
                            <button onClick={() => setWeedMachineOwnership('Own')} className={`flex-1 py-2 text-sm rounded ${weedMachineOwnership==='Own' ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-500'}`}>Own</button>
                            <button onClick={() => setWeedMachineOwnership('Rental')} className={`flex-1 py-2 text-sm rounded ${weedMachineOwnership==='Rental' ? 'bg-orange-100 text-orange-800 font-bold' : 'text-gray-500'}`}>Rental</button>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                             <Input label="No. of Machine" type="number" value={weedMachineCount} onChange={e=>setWeedMachineCount(e.target.value)} />
                             {weedMachineOwnership === 'Rental' && (
                                <Input label="Rent / Machine" type="number" value={weedRent} onChange={e=>setWeedRent(e.target.value)} />
                             )}
                        </div>
                    </div>
                )}
            </div>
        );

        if (isHarvesting) return (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                 <div className="flex bg-white rounded-lg p-1 border">
                    <button onClick={() => setHarvestingMode('Labour')} className={`flex-1 py-2 text-sm rounded ${harvestingMode==='Labour' ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-500'}`}>Labour</button>
                    <button onClick={() => setHarvestingMode('Machine')} className={`flex-1 py-2 text-sm rounded ${harvestingMode==='Machine' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-500'}`}>Machine</button>
                </div>
                {harvestingMode === 'Machine' && (
                    <div className="space-y-3">
                         <div className="flex bg-white rounded-lg p-1 border">
                            <button onClick={() => setHarvestingMachineOwnership('Own')} className={`flex-1 py-2 text-sm rounded ${harvestingMachineOwnership==='Own' ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-500'}`}>Own</button>
                            <button onClick={() => setHarvestingMachineOwnership('Rental')} className={`flex-1 py-2 text-sm rounded ${harvestingMachineOwnership==='Rental' ? 'bg-orange-100 text-orange-800 font-bold' : 'text-gray-500'}`}>Rental</button>
                         </div>
                         {harvestingMachineOwnership === 'Rental' && (
                             <div className="grid grid-cols-2 gap-3">
                                <Input label="Hours" type="number" value={harvestingHours} onChange={e=>setHarvestingHours(e.target.value)} />
                                <Input label="Rent / Hour" type="number" value={harvestingRentPerHour} onChange={e=>setHarvestingRentPerHour(e.target.value)} />
                             </div>
                         )}
                    </div>
                )}
            </div>
        );

        if (isSeeds) return (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                <Select label="Suggested By" value={suggestedBy} onChange={e=>setSuggestedBy(e.target.value)} options={[{value:'',label:'Select'}, {value:'Resilience Center',label:'Resilience Center'}, {value:'AAO',label:'AAO'}, {value:'Fertilizer Shop',label:'Fertilizer Shop'}, {value:'Other Farmer',label:'Other Farmer'}]} />
                <Select label="Source" value={source} onChange={e=>setSource(e.target.value)} options={[{value:'',label:'Select'}, {value:'Own',label:'Own'}, {value:'Fertilizer Shop',label:'Fertilizer Shop'}, {value:'Govt Department',label:'Govt Department'}, {value:'Other Farmer',label:'Other Farmer'}]} />
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={seedTreatment} onChange={e => setSeedTreatment(e.target.checked)} className="w-5 h-5 text-green-600 rounded" />
                        <span className="text-sm font-medium text-gray-700">Seed Treated?</span>
                    </label>
                    {seedTreatment && <Input placeholder="Treatment Cost (₹)" type="number" value={seedTreatmentCost} onChange={e=>setSeedTreatmentCost(e.target.value)} />}
                </div>
            </div>
        );

        if (isChem) {
            const chemSourceOptions = [
                {value:'Fertilizer Shop',label:'Fertilizer Shop'},
                {value:'Society',label:'Society'},
            ];
            if (!isInorganic) chemSourceOptions.push({value:'Own Product',label:'Own Product'});

            return (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                    <Select label="Suggested By" value={suggestedBy} onChange={e=>setSuggestedBy(e.target.value)} options={[{value:'',label:'Select'}, {value:'Resilience Center',label:'Resilience Center'}, {value:'AAO',label:'AAO'}, {value:'Fertilizer Shop',label:'Fertilizer Shop'}, {value:'Other Farmer',label:'Other Farmer'}]} />
                    {suggestedBy === 'Resilience Center' && (
                        <Select label="How?" value={resilienceMode} onChange={e=>setResilienceMode(e.target.value)} options={[{value:'',label:'Select'}, {value:'Through App',label:'Through App'}, {value:'Directly',label:'Directly'}, {value:'FFS',label:'FFS'}, {value:'WhatsApp',label:'WhatsApp'}]} />
                    )}
                    <Select label="Where did you buy?" value={source} onChange={e=>setSource(e.target.value)} options={[{value:'',label:'Select'}, ...chemSourceOptions]} />

                    {/* Sub Item List */}
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Item Details</h4>
                        <div className="space-y-2 mb-4">
                            {subItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} {selectedCategory === DiaryCategory.FERTILIZER ? 'Kg' : 'ml'} • ₹{item.amount}</p>
                                    </div>
                                    <div className="flex gap-2">
                                         <button onClick={() => handleEditSubItem(item)} className="p-1 bg-blue-50 text-blue-600 rounded"><Pencil className="w-4 h-4"/></button>
                                         <button onClick={() => handleDeleteSubItem(item.id)} className="p-1 bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                            {subItems.length > 0 && (
                                <div className="flex justify-between text-sm font-bold bg-gray-100 p-2 rounded">
                                    <span>Total:</span>
                                    <span>{quantity} {selectedCategory === DiaryCategory.FERTILIZER ? 'Kg' : 'ml'} | ₹{amount}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                             <Input 
                                label={selectedCategory === DiaryCategory.FERTILIZER ? "Fertilizer Name" : "Pesticide Name"} 
                                value={subName} 
                                onChange={e=>setSubName(e.target.value)} 
                                placeholder={selectedCategory === DiaryCategory.FERTILIZER ? "e.g. Urea" : "e.g. Neem Oil"}
                             />
                             <div className="grid grid-cols-2 gap-3 mb-3">
                                <Input label={selectedCategory === DiaryCategory.FERTILIZER ? "Weight (Kg)" : "Volume (ml)"} type="number" value={subQty} onChange={e=>setSubQty(e.target.value)} />
                                <Input label="Amount (₹)" type="number" value={subAmount} onChange={e=>setSubAmount(e.target.value)} />
                             </div>
                             {editingSubId ? (
                                 <div className="flex gap-2">
                                     <Button onClick={handleUpdateSubItem} className="py-2 text-sm bg-blue-600">Update Item</Button>
                                     <Button onClick={() => { setEditingSubId(null); setSubName(''); setSubQty(''); setSubAmount(''); }} className="py-2 text-sm bg-gray-400">Cancel</Button>
                                 </div>
                             ) : (
                                 <Button onClick={handleAddSubItem} className="py-2 text-sm">Add Item</Button>
                             )}
                        </div>
                    </div>
                </div>
            );
        }

        if (isSale) return (
            <div className="space-y-4">
                {/* Sale Balance Summary */}
                 <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center"><Scale className="w-4 h-4 mr-1"/> Stock Balance</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded shadow-sm">
                            <p className="text-[10px] text-gray-500 uppercase">Total Yield</p>
                            <p className="font-bold text-blue-600">{totalYield} Kg</p>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm">
                            <p className="text-[10px] text-gray-500 uppercase">Sold</p>
                            <p className="font-bold text-green-600">{totalSold} Kg</p>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm border border-blue-200">
                            <p className="text-[10px] text-gray-500 uppercase">Balance</p>
                            <p className={`font-bold ${balanceStock <= 0 ? 'text-red-500' : 'text-orange-600'}`}>{balanceStock} Kg</p>
                        </div>
                    </div>
                 </div>

                <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                    <div className="flex bg-white rounded-lg p-1 border">
                        <button onClick={() => setSaleType('Raw')} className={`flex-1 py-2 text-sm rounded ${saleType==='Raw' ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-500'}`}>Raw Sale</button>
                        <button onClick={() => setSaleType('Value Added')} className={`flex-1 py-2 text-sm rounded ${saleType==='Value Added' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-500'}`}>Value Added</button>
                    </div>
                    {saleType === 'Raw' ? (
                        <Select label="Buyer Channel" value={buyerType} onChange={e=>setBuyerType(e.target.value)} options={[
                            {value:'',label:'Select'}, {value:'TNCSC',label:'TNCSC'}, {value:'Local Buyer',label:'Local Buyer'}, {value:'Mill',label:'Mill'}, {value:'Seed for Dept',label:'Seed for Dept'}, {value:'Commission Shop',label:'Commission Shop'}, {value:'Social Media',label:'Social Media'}, {value:'Through App',label:'Through App'}
                        ]} />
                    ) : (
                        <>
                            <Select label="Sales Channel" value={buyerType} onChange={e=>setBuyerType(e.target.value)} options={[
                                {value:'',label:'Select'}, {value:'Through App',label:'Through App'}, {value:'Social Media',label:'Social Media'}, {value:'Direct Sale',label:'Direct Sale'}
                            ]} />
                            <Input label="Value Addition Cost (₹)" type="number" value={valueAddedCost} onChange={e=>setValueAddedCost(e.target.value)} placeholder="e.g. Processing, Packaging cost" />
                        </>
                    )}
                </div>
            </div>
        );

        return null;
    };

    return (
        <MobileLayout className="bg-white flex flex-col h-screen">
            <div className={`p-4 text-white flex items-center ${isSale ? 'bg-green-700' : 'bg-green-600'}`}>
                 <button onClick={() => isEditing ? navigate(ScreenName.ENTRY_LIST) : navigate(ScreenName.DIARY_CATEGORIES)} className="mr-4"><ChevronLeft/></button>
                 <div className="flex-1">
                    <p className="text-xs opacity-80 uppercase font-semibold">{activeCultivation?.cropName}</p>
                    <h2 className="text-lg font-bold">{isEditing ? `Edit ${selectedCategory}` : selectedCategory}</h2>
                 </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <>
                    <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50 outline-none" />
                    
                    {renderDetails()}

                    <div className={((hideAmount || isLandPrep || isLabour || isWeeding || isIrrigation || isHarvesting || isOthers) ? "w-full" : "grid grid-cols-2 gap-4")}>
                        {!isLandPrep && !isLabour && !isWeeding && !isIrrigation && !isHarvesting && !isOthers && !isChem && (
                            <Input 
                                ref={quantityInputRef}
                                label="Quantity (Kg/L)" 
                                type="number" 
                                value={quantity} 
                                onChange={e=>setQuantity(e.target.value)} 
                                placeholder={isSale ? `Available: ${balanceStock}` : "0.00"}
                            />
                        )}
                        {!hideAmount && (
                            <Input label="Amount (₹)" type="number" value={amount} onChange={e=>setAmount(e.target.value)} readOnly={isWeeding || (isHarvesting && harvestingMode === 'Machine' && harvestingMachineOwnership === 'Rental')} />
                        )}
                    </div>
                    <Input label="Description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Notes..." />
                </>
            </div>

            <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white">
                <Button onClick={handleSave}>{isEditing ? 'Update Entry' : 'Save Entry'}</Button>
            </div>
        </MobileLayout>
    );
};