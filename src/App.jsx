import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, MapPin, DollarSign, Utensils, BarChart3, 
  Plus, Trash2, Edit3, Check, X, Moon, Sun, 
  Sparkles, Grid, Eye, CheckCircle2, Clock
} from 'lucide-react';

const TRIP_STATUSES = {
  PLANNING: { label: 'กำลังวางแผน', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  UPCOMING: { label: 'กำลังจะไป', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  COMPLETED: { label: 'เสร็จสิ้นแล้ว', color: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300' }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [trips, setTrips] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [viewTripDetails, setViewTripDetails] = useState(null);
  const [foodForm, setFoodForm] = useState({ title: '', quantity: 1, unitPrice: '', tripIds: [] });

  // Load Data
  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    const savedFood = JSON.parse(localStorage.getItem('food') || '[]');
    setTrips(savedTrips);
    setFoodItems(savedFood);
  }, []);

  const handleSaveFoodItem = (e) => {
    e.preventDefault();
    if (!foodForm.title || !foodForm.unitPrice || foodForm.tripIds.length === 0) {
      alert('กรุณากรอกชื่อวัตถุดิบ ราคา และเลือกทริปที่จะแชร์ให้ครบค่ะ');
      return;
    }
    const newItem = { ...foodForm, id: 'food-' + Date.now(), completed: false };
    const updatedFood = [...foodItems, newItem];
    setFoodItems(updatedFood);
    localStorage.setItem('food', JSON.stringify(updatedFood));
    setFoodForm({ title: '', quantity: 1, unitPrice: '', tripIds: [] });
    alert('บันทึกเสบียงและแชร์เข้าทริปเรียบร้อย!');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-zinc-950 text-white' : 'bg-stone-50 text-zinc-900'}`}>
      <header className="p-4 border-b dark:border-zinc-800 flex justify-between items-center">
        <h1 className="font-bold text-lg">CampLog Planner ⛺</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="p-4 pb-24">
        {/* ส่วนแสดงทริปและปุ่มดูรายละเอียด */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h2 className="font-bold text-xl">ทริปของคุณ</h2>
            {trips.map(trip => (
              <div key={trip.id} className="p-4 border rounded-xl dark:border-zinc-800 flex justify-between items-center">
                <span>{trip.title}</span>
                <button onClick={() => setViewTripDetails(trip)} className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                  <Eye size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ส่วนบันทึกเสบียง */}
        {activeTab === 'food' && (
          <form onSubmit={handleSaveFoodItem} className="p-4 border rounded-xl dark:border-zinc-800 space-y-4">
            <h2 className="font-bold">บันทึกเสบียง</h2>
            <input type="text" placeholder="ชื่อวัตถุดิบ" value={foodForm.title} onChange={e => setFoodForm({...foodForm, title: e.target.value})} className="w-full p-2 border dark:bg-zinc-900 rounded" />
            <input type="number" placeholder="ราคา" value={foodForm.unitPrice} onChange={e => setFoodForm({...foodForm, unitPrice: e.target.value})} className="w-full p-2 border dark:bg-zinc-900 rounded" />
            
            <div className="space-y-2">
              <label className="text-sm font-bold">เลือกทริปแชร์:</label>
              {trips.map(trip => (
                <label key={trip.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={foodForm.tripIds.includes(trip.id)} onChange={e => {
                    const ids = e.target.checked ? [...foodForm.tripIds, trip.id] : foodForm.tripIds.filter(id => id !== trip.id);
                    setFoodForm({...foodForm, tripIds: ids});
                  }} />
                  {trip.title}
                </label>
              ))}
            </div>
            <button type="submit" className="w-full p-2 bg-emerald-600 text-white rounded font-bold">บันทึกเสบียง</button>
          </form>
        )}
      </main>

      {/* หน้าต่างแสดงรายละเอียดทริป (Popup) */}
      {viewTripDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-sm">
            <h2 className="font-bold text-lg mb-4">{viewTripDetails.title}</h2>
            <p className="text-sm">รายละเอียดค่าใช้จ่ายรวมของทริปนี้...</p>
            <button onClick={() => setViewTripDetails(null)} className="mt-4 w-full p-2 bg-zinc-200 dark:bg-zinc-800 rounded">ปิด</button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full p-4 border-t dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-around">
        <button onClick={() => setActiveTab('dashboard')}><Grid size={24} /></button>
        <button onClick={() => setActiveTab('food')}><Utensils size={24} /></button>
      </nav>
    </div>
  );
}
