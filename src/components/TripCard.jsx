import React, { useState } from 'react';
import ExpenseManager from './ExpenseManager';
import FoodManager from './FoodManager';

const TripCard = ({ trip }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tripTotalCost = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-800">{trip.location}</h3>
          <p className="text-sm text-gray-500">📅 {trip.date}</p>
        </div>
        <div className="text-right flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">ค่าใช้จ่ายทริปนี้</p>
            <p className="text-base font-bold text-gray-900">฿{tripTotalCost.toLocaleString()}</p>
          </div>
          <span className={`text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            👇
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 bg-gray-50/30 space-y-4">
          <ExpenseManager tripId={trip.id} expenses={trip.expenses} />
          <FoodManager tripId={trip.id} foodLogs={trip.foodLogs} />
        </div>
      )}
    </div>
  );
};

export default TripCard;