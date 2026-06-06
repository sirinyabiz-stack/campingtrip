import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';

const FoodManager = ({ tripId, foodLogs }) => {
  const { addFoodLog } = useTrips();
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mealName) return;
    addFoodLog(tripId, { mealName, ingredients });
    setMealName('');
    setIngredients('');
  };

  return (
    <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 shadow-2xs">
      <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-1">🍳 วางแผนเมนูอาหาร</h4>
      
      <form onSubmit={handleSubmit} className="space-y-2 mb-3">
        <input
          type="text"
          placeholder="ชื่อเมนู (เช่น บาร์บีคิวเนื้อ, หมูกระทะ)"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="w-full p-2 border border-orange-200 rounded-lg text-sm bg-white"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="วัตถุดิบที่ต้องซื้อ (เช่น เนื้อ, ผัก, ซอส)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="flex-1 p-2 border border-orange-200 rounded-lg text-sm bg-white"
          />
          <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-orange-700 transition shrink-0">
            บันทึกเมนู
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto">
        {foodLogs.map((food) => (
          <div key={food.id} className="bg-white p-2 rounded-lg border border-orange-100 text-xs shadow-3xs">
            <p className="font-bold text-orange-900">🍽️ {food.mealName}</p>
            {food.ingredients && (
              <p className="text-gray-500 mt-0.5">🛒 วัตถุดิบ: {food.ingredients}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodManager;