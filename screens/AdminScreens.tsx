
import React, { useState } from 'react';
import { Query, ScreenName, Region, Location, Cascade, Village, MarketPost, MarketType } from '../types';
import { Button, Input, AdminLayout, Card, Select } from '../components/ui';
import { Users, DollarSign, BarChart2, Download, Search, LayoutDashboard, ChevronLeft, MessageCircle, CheckCircle, Mic, Square, Database, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdminScreenProps {
  navigate: (screen: ScreenName) => void;
  queries?: Query[];
  onResolveQuery?: (id: string, solution: string, hasAudio: boolean) => void;
  selectedQueryId?: string | null;
  onSelectQuery?: (id: string) => void;

  // Master Data Props
  level?: 'Region' | 'Location' | 'Cascade' | 'Village';
  regions?: Region[];
  locations?: Location[];
  cascades?: Cascade[];
  villages?: Village[];
  // Fix: addRegion and similar methods should allow returning a Promise for async D1 operations
  addRegion?: (name: string) => boolean | Promise<boolean>;
  deleteRegion?: (id: string) => void | Promise<void>;
  addLocation?: (rId: string, name: string) => boolean | Promise<boolean>;
  deleteLocation?: (id: string) => void | Promise<void>;
  addCascade?: (lId: string, name: string) => boolean | Promise<boolean>;
  deleteCascade?: (id: string) => void | Promise<void>;
  addVillage?: (cId: string, name: string) => boolean | Promise<boolean>;
  deleteVillage?: (id: string) => void | Promise<void>;

  // Market
  marketPosts?: MarketPost[];
}

export const AdminLoginScreen: React.FC<AdminScreenProps> = ({ navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'Admin' && password === 'Admin@123') {
        setError('');
        navigate(ScreenName.ADMIN_DASHBOARD);
    } else {
        setError('Invalid Username or Password. Use Admin / Admin@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Fasli Admin</h1>
                <p className="text-slate-500 mt-2">Administrative Portal</p>
            </div>
            
            <div className="space-y-4">
                <Input 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <Input 
                    placeholder="Password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
                />
                
                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                
                <Button variant="admin" onClick={handleLogin}>Sign In</Button>
            </div>
            <div className="mt-4 text-center">
                <span className="text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(ScreenName.WELCOME)}>Back to App</span>
            </div>
        </div>
    </div>
  );
};

const AdminHeader: React.FC<{ title: string; navigate: any }> = ({ title, navigate }) => (
    <header className="bg-slate-800 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
             <LayoutDashboard className="cursor-pointer" onClick={() => navigate(ScreenName.ADMIN_DASHBOARD)} />
             <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex gap-4">
            <button onClick={() => navigate(ScreenName.ADMIN_MASTER_MENU)} className="hover:text-blue-300">Master Data</button>
            <button onClick={() => navigate(ScreenName.ADMIN_ANALYTICS)} className="hover:text-blue-300">Analytics</button>
            <button onClick={() => navigate(ScreenName.ADMIN_QUERIES)} className="hover:text-blue-300">Queries</button>
            <button onClick={() => navigate(ScreenName.ADMIN_MARKET)} className="hover:text-blue-300">Market</button>
            <button onClick={() => navigate(ScreenName.FARMER_LIST)} className="hover:text-blue-300">Farmers</button>
            <button onClick={() => navigate(ScreenName.ADMIN_LOGIN)} className="text-red-300 hover:text-red-100">Logout</button>
        </div>
    </header>
);

export const AdminMasterMenu: React.FC<AdminScreenProps> = ({ navigate }) => {
    return (
        <AdminLayout>
            <AdminHeader title="Master Data Management" navigate={navigate} />
            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 cursor-pointer hover:bg-slate-50 border-l-4 border-blue-500" onClick={() => navigate(ScreenName.ADMIN_MASTER_REGION)}>
                        <Database className="w-8 h-8 text-blue-500 mb-2"/>
                        <h3 className="font-bold text-lg">1. Regions</h3>
                        <p className="text-sm text-gray-500">Manage Regions</p>
                    </Card>
                    <Card className="p-6 cursor-pointer hover:bg-slate-50 border-l-4 border-green-500" onClick={() => navigate(ScreenName.ADMIN_MASTER_LOCATION)}>
                        <Database className="w-8 h-8 text-green-500 mb-2"/>
                        <h3 className="font-bold text-lg">2. Locations</h3>
                        <p className="text-sm text-gray-500">Manage Locations under Regions</p>
                    </Card>
                    <Card className="p-6 cursor-pointer hover:bg-slate-50 border-l-4 border-yellow-500" onClick={() => navigate(ScreenName.ADMIN_MASTER_CASCADE)}>
                        <Database className="w-8 h-8 text-yellow-500 mb-2"/>
                        <h3 className="font-bold text-lg">3. Cascades</h3>
                        <p className="text-sm text-gray-500">Manage Clusters under Locations</p>
                    </Card>
                    <Card className="p-6 cursor-pointer hover:bg-slate-50 border-l-4 border-purple-500" onClick={() => navigate(ScreenName.ADMIN_MASTER_VILLAGE)}>
                        <Database className="w-8 h-8 text-purple-500 mb-2"/>
                        <h3 className="font-bold text-lg">4. Villages</h3>
                        <p className="text-sm text-gray-500">Manage Villages under Cascades</p>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export const AdminMasterDataScreen: React.FC<AdminScreenProps> = ({ 
    navigate, level, regions=[], locations=[], cascades=[], villages=[],
    addRegion, deleteRegion, addLocation, deleteLocation, 
    addCascade, deleteCascade, addVillage, deleteVillage
}) => {
    const [name, setName] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCascade, setSelectedCascade] = useState('');
    const [msg, setMsg] = useState('');

    // Fix: handleAdd needs to be async to await the add methods
    const handleAdd = async () => {
        let success = false;
        setMsg('');
        if (!name.trim()) return;

        if (level === 'Region' && addRegion) success = await addRegion(name);
        else if (level === 'Location' && addLocation) {
            if (!selectedRegion) { setMsg('Error: Select Region first'); return; }
            success = await addLocation(selectedRegion, name);
        }
        else if (level === 'Cascade' && addCascade) {
            if (!selectedLocation) { setMsg('Error: Select Location first'); return; }
            success = await addCascade(selectedLocation, name);
        }
        else if (level === 'Village' && addVillage) {
            if (!selectedCascade) { setMsg('Error: Select Cascade first'); return; }
            success = await addVillage(selectedCascade, name);
        }

        if (success) {
            setName('');
            setMsg(`${level} added successfully.`);
        } else {
            setMsg('Error: Duplicate Name or Invalid Input.');
        }
    };

    let displayList: {id: string, name: string}[] = [];
    if (level === 'Region') {
        displayList = regions;
    } else if (level === 'Location') {
        displayList = locations.filter(l => !selectedRegion || l.regionId === selectedRegion);
    } else if (level === 'Cascade') {
        displayList = cascades.filter(c => !selectedLocation || c.locationId === selectedLocation);
    } else if (level === 'Village') {
        displayList = villages.filter(v => !selectedCascade || v.cascadeId === selectedCascade);
    }

    return (
        <AdminLayout>
            <div className="bg-white border-b p-4 flex items-center sticky top-0 shadow-sm z-10">
                <button onClick={() => navigate(ScreenName.ADMIN_MASTER_MENU)} className="p-2 hover:bg-slate-100 rounded-full mr-4">
                    <ChevronLeft className="text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Manage {level}s</h1>
            </div>
            
            <div className="p-8 max-w-4xl mx-auto space-y-6">
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {(level === 'Location' || level === 'Cascade' || level === 'Village') && (
                            <Select 
                                label="Select Region"
                                value={selectedRegion}
                                onChange={e => {
                                    setSelectedRegion(e.target.value);
                                    setSelectedLocation('');
                                    setSelectedCascade('');
                                }}
                                options={[{value:'', label:'All Regions'}, ...regions.map(r => ({value:r.id, label:r.name}))]}
                            />
                        )}
                        {(level === 'Cascade' || level === 'Village') && (
                            <Select 
                                label="Select Location"
                                value={selectedLocation}
                                onChange={e => {
                                    setSelectedLocation(e.target.value);
                                    setSelectedCascade('');
                                }}
                                disabled={!selectedRegion}
                                options={[{value:'', label:'All Locations'}, ...locations.filter(l => l.regionId === selectedRegion).map(l => ({value:l.id, label:l.name}))]}
                            />
                        )}
                        {(level === 'Village') && (
                            <Select 
                                label="Select Cascade"
                                value={selectedCascade}
                                onChange={e => setSelectedCascade(e.target.value)}
                                disabled={!selectedLocation}
                                options={[{value:'', label:'All Cascades'}, ...cascades.filter(c => c.locationId === selectedLocation).map(c => ({value:c.id, label:c.name}))]}
                            />
                        )}
                    </div>
                    
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Input 
                                label={`New ${level} Name`} 
                                placeholder={`Enter ${level} Name`} 
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Button variant="admin" onClick={handleAdd} style={{width:'auto', padding:'0.75rem 2rem'}}>
                                <Plus className="w-4 h-4 mr-2" /> Add
                            </Button>
                        </div>
                    </div>
                    {msg && <p className={`text-sm ${msg.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{msg}</p>}
                </Card>

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Name</th>
                                <th className="p-4 text-right font-semibold text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayList.map(item => (
                                <tr key={item.id} className="border-b hover:bg-slate-50 last:border-0">
                                    <td className="p-4 font-medium text-slate-700">{item.name}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            // Fix: delete methods can be async, so we await them
                                            onClick={async () => {
                                                if(level==='Region' && deleteRegion) await deleteRegion(item.id);
                                                if(level==='Location' && deleteLocation) await deleteLocation(item.id);
                                                if(level==='Cascade' && deleteCascade) await deleteCascade(item.id);
                                                if(level==='Village' && deleteVillage) await deleteVillage(item.id);
                                            }}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {displayList.length === 0 && (
                                <tr><td colSpan={2} className="p-6 text-center text-slate-400 italic">No entries found for the current selection.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export const AdminMarketScreen: React.FC<AdminScreenProps> = ({ navigate, marketPosts }) => {
    const [filter, setFilter] = useState<'ALL' | 'SALE' | 'DEMAND'>('ALL');
    const filteredPosts = marketPosts?.filter(p => filter === 'ALL' || p.type === filter) || [];

    return (
        <AdminLayout>
             <AdminHeader title="Marketplace Listings" navigate={navigate} />
             <div className="p-8 max-w-7xl mx-auto">
                <div className="flex gap-4 mb-6">
                    {['ALL', 'SALE', 'DEMAND'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border'}`}
                        >
                            {f} Posts
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 border-b">
                                <th className="p-4 font-semibold text-slate-600">Date</th>
                                <th className="p-4 font-semibold text-slate-600">Type</th>
                                <th className="p-4 font-semibold text-slate-600">Farmer</th>
                                <th className="p-4 font-semibold text-slate-600">Item</th>
                                <th className="p-4 font-semibold text-slate-600">Qty / Amount</th>
                                <th className="p-4 font-semibold text-slate-600">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((p) => (
                                <tr key={p.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4 text-slate-500 text-sm">{p.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${p.type === MarketType.SALE ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {p.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-slate-800">{p.farmerName}</td>
                                    <td className="p-4 text-slate-700">{p.itemName}</td>
                                    <td className="p-4 text-slate-600">{p.quantity} units @ ₹{p.amount}</td>
                                    <td className="p-4 text-slate-600 font-mono text-sm">{p.contact || 'N/A'}</td>
                                </tr>
                            ))}
                             {filteredPosts.length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No market posts found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
        </AdminLayout>
    );
}

export const AdminDashboardScreen: React.FC<AdminScreenProps> = ({ navigate, queries }) => {
    const pendingQueries = queries?.filter(q => q.status === 'PENDING').length || 0;
    return (
        <AdminLayout>
            <AdminHeader title="Dashboard" navigate={navigate} />
            <div className="p-8 max-w-7xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-l-4 border-blue-600 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Total Farmers</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-1">1,240</h3>
                            </div>
                            <Users className="text-blue-600" />
                        </div>
                    </Card>
                    <Card className="border-l-4 border-green-600 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Total Expenses</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-1">₹4.2Cr</h3>
                            </div>
                            <DollarSign className="text-green-600" />
                        </div>
                    </Card>
                     <Card 
                        className="border-l-4 border-red-500 p-6 cursor-pointer hover:bg-red-50 transition-colors"
                        onClick={() => navigate(ScreenName.ADMIN_QUERIES)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Pending Queries</p>
                                <h3 className="text-3xl font-bold text-red-600 mt-1">{pendingQueries}</h3>
                            </div>
                            <MessageCircle className="text-red-500 w-8 h-8" />
                        </div>
                    </Card>
                    <Card className="border-l-4 border-orange-500 p-6 cursor-pointer hover:bg-slate-50" onClick={() => navigate(ScreenName.ADMIN_MARKET)}>
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Marketplace</p>
                                <h3 className="text-lg font-bold text-slate-800 mt-1 text-orange-600">View Posts &rarr;</h3>
                            </div>
                            <ShoppingBag className="text-orange-600" />
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export const FarmerListScreen: React.FC<AdminScreenProps> = ({ navigate }) => {
    const farmers = [
        { id: 1, name: 'Velu Naik', village: 'Keezhadi', crop: 'Paddy' },
        { id: 2, name: 'Lakshmi A', village: 'Melur', crop: 'Sugarcane' },
    ];
    return (
        <AdminLayout>
            <AdminHeader title="Farmer Database" navigate={navigate} />
             <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 border-b">
                                <th className="p-4 font-semibold text-slate-600">Name</th>
                                <th className="p-4 font-semibold text-slate-600">Village</th>
                                <th className="p-4 font-semibold text-slate-600">Primary Crop</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farmers.map((f) => (
                                <tr key={f.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4">{f.name}</td>
                                    <td className="p-4 text-slate-500">{f.village}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{f.crop}</span></td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => navigate(ScreenName.FARMER_DETAILS)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export const FarmerDetailsScreen: React.FC<AdminScreenProps> = ({ navigate }) => {
    return (
        <AdminLayout>
             <div className="bg-white border-b p-4 flex justify-between items-center sticky top-0">
                 <div className="flex items-center gap-4">
                    <button onClick={() => navigate(ScreenName.FARMER_LIST)} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft className="text-slate-600" /></button>
                    <h1 className="text-xl font-bold text-slate-800">Velu Naik - Profile</h1>
                 </div>
             </div>
             <div className="p-8 max-w-5xl mx-auto space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-bold">Velu Naik</h2>
                    <p className="text-slate-500">Keezhadi, Sivaganga Dist.</p>
                </Card>
             </div>
        </AdminLayout>
    );
};

export const AnalyticsScreen: React.FC<AdminScreenProps> = ({ navigate }) => {
    return (
        <AdminLayout>
            <AdminHeader title="Data Analytics" navigate={navigate} />
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                 <Card className="p-6 h-96">
                    <h3 className="text-lg font-bold mb-4 text-slate-700">Profitability by Crop Type</h3>
                    <ResponsiveContainer width="100%" height="85%">
                         <BarChart data={[{ name: 'Paddy', expense: 4000, profit: 2400 }, { name: 'Sugarcane', expense: 3000, profit: 1398 }]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="expense" fill="#f87171" name="Avg Expense" />
                            <Bar dataKey="profit" fill="#4ade80" name="Avg Profit" />
                        </BarChart>
                    </ResponsiveContainer>
                 </Card>
            </div>
        </AdminLayout>
    );
};

export const AdminQueriesScreen: React.FC<AdminScreenProps> = ({ navigate, queries, onSelectQuery }) => {
    return (
        <AdminLayout>
             <AdminHeader title="Expert Support" navigate={navigate} />
             <div className="p-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {queries?.map((q) => (
                        <div key={q.id} onClick={() => onSelectQuery && onSelectQuery(q.id)} className="p-6 border-b hover:bg-slate-50 cursor-pointer flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-slate-800 text-lg mb-1">{q.question}</h3>
                                <p className="text-sm text-slate-500">{q.cropName} • {q.status}</p>
                            </div>
                            <ChevronLeft className="rotate-180 text-slate-400" />
                        </div>
                    ))}
                    {(!queries || queries.length === 0) && (
                        <div className="p-12 text-center text-slate-400">No queries found.</div>
                    )}
                </div>
             </div>
        </AdminLayout>
    );
};

export const AdminQueryResponseScreen: React.FC<AdminScreenProps> = ({ navigate, queries, selectedQueryId, onResolveQuery }) => {
    const query = queries?.find(q => q.id === selectedQueryId);
    const [solution, setSolution] = useState(query?.solution || '');
    if (!query) return <div className="p-8 text-center">Query not found</div>;
    return (
        <AdminLayout>
            <div className="bg-white border-b p-4 flex items-center sticky top-0 shadow-sm z-10">
                <button onClick={() => navigate(ScreenName.ADMIN_QUERIES)} className="p-2 hover:bg-slate-100 rounded-full mr-4"><ChevronLeft className="text-slate-600" /></button>
                <h1 className="text-xl font-bold text-slate-800">Reply to Query</h1>
            </div>
            <div className="p-8 max-w-4xl mx-auto">
                 <Card className="p-6">
                    <h2 className="text-lg font-bold mb-4">{query.question}</h2>
                    {query.imageUrl && (
                        <div className="mb-4">
                            <img src={query.imageUrl} alt="Query context" className="max-h-64 rounded-lg object-contain bg-slate-100" />
                        </div>
                    )}
                    <textarea 
                        className="w-full border p-4 h-48 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Type solution..."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                    ></textarea>
                    <Button variant="admin" onClick={() => onResolveQuery && onResolveQuery(query.id, solution, false)}>Send Solution</Button>
                 </Card>
            </div>
        </AdminLayout>
    );
};
