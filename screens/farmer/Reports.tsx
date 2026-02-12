
import React from 'react';
import { ScreenName, EntryType, FarmerScreenProps } from '../../types';
import { MobileLayout } from '../../components/ui';
import { ChevronLeft, PieChart, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#16a34a', '#eab308', '#2563eb', '#dc2626', '#9333ea', '#06b6d4'];

export const GraphReportScreen: React.FC<FarmerScreenProps> = ({ navigate, entries, activeCultivationId }) => {
    const currentEntries = entries.filter(e => e.cultivationId === activeCultivationId);
    
    // Pie Chart Data (Expenses by Category)
    const expenseData = currentEntries
        .filter(e => e.type === EntryType.EXPENSE)
        .reduce((acc, curr) => {
            const existing = acc.find(a => a.name === curr.category);
            if (existing) existing.value += curr.amount;
            else acc.push({ name: curr.category, value: curr.amount });
            return acc;
        }, [] as {name: string, value: number}[]);

    // Bar Chart Data (Monthly Income vs Expense)
    // Simplified for demo: just total comparison
    const totalExpense = currentEntries.filter(e => e.type === EntryType.EXPENSE).reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = currentEntries.filter(e => e.type === EntryType.INCOME).reduce((sum, e) => sum + e.amount, 0);
    const barData = [
        { name: 'Expense', amount: totalExpense, fill: '#ef4444' },
        { name: 'Income', amount: totalIncome, fill: '#22c55e' },
    ];

    return (
        <MobileLayout className="bg-white flex flex-col h-screen">
             <div className="bg-white p-4 shadow-sm flex items-center border-b">
                <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                <h2 className="text-lg font-bold">Analytics & Reports</h2>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 {/* Pie Chart */}
                 <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                     <h3 className="font-bold text-gray-700 mb-4 flex items-center"><PieChart className="w-4 h-4 mr-2"/> Expense Breakdown</h3>
                     <div className="h-64 flex items-center justify-center">
                        {expenseData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                        ) : <p className="text-gray-400 text-sm">No expense data available</p>}
                     </div>
                     <div className="grid grid-cols-2 gap-2 mt-4">
                         {expenseData.map((e, i) => (
                             <div key={e.name} className="flex items-center text-xs">
                                 <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                 <span className="text-gray-600 truncate flex-1">{e.name}</span>
                                 <span className="font-bold">₹{e.value}</span>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Bar Chart */}
                 <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                     <h3 className="font-bold text-gray-700 mb-4 flex items-center"><BarChart2 className="w-4 h-4 mr-2"/> Income vs Expense</h3>
                     <div className="h-48">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={barData} layout="vertical">
                                 <XAxis type="number" hide />
                                 <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                                 <Tooltip />
                                 <Bar dataKey="amount" barSize={20} radius={[0, 4, 4, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                 </Bar>
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                 </div>
             </div>
        </MobileLayout>
    );
};

export const CropSummaryScreen: React.FC<FarmerScreenProps> = ({ navigate, activeCultivation }) => {
    return (
        <MobileLayout className="bg-white">
            <div className="p-4 flex items-center border-b">
                 <button onClick={() => navigate(ScreenName.FARMER_DASHBOARD)} className="mr-4"><ChevronLeft/></button>
                 <h2 className="text-lg font-bold">Crop Details</h2>
            </div>
            <div className="p-6">
                <img src={activeCultivation?.image} className="w-full h-48 object-cover rounded-xl shadow-md mb-6" alt="crop"/>
                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Crop Name</span>
                        <span className="font-bold">{activeCultivation?.cropName}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Land Name</span>
                        <span className="font-bold">{activeCultivation?.landName}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Area</span>
                        <span className="font-bold">{activeCultivation?.areaSize} Acres</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Sowing Date</span>
                        <span className="font-bold">{activeCultivation?.startDate}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Farming Method</span>
                        <span className="font-bold">{activeCultivation?.farmingMethod}</span>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
};
