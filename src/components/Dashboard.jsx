import React from 'react';
import { useTrips } from '../context/TripContext';

const Dashboard = () => {
  const { trips } = useTrips();

  const totalTrips = trips.length;
  const totalExpenses = trips.reduce((acc, trip) => {
    const tripTotal = trip.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    return acc + tripTotal;
  }, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🏕️ ภาพรวมทริปแคมปิ้ง (Dashboard)</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-sm text-gray-500 font-medium">ทริปทั้งหมด</p>
          <p className="text-2xl font-bold text-green-700">{totalTrips} ทริป</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-sm text-gray-500 font-medium">ค่าใช้จ่ายรวมทุกทริป</p>
          <p className="text-2xl font-bold text-blue-700">฿{totalExpenses.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;