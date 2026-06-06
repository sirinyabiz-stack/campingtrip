import React, { useState } from 'react';
import { useTrips } from '../context/TripContext';

const ExpenseManager = ({ tripId, expenses }) => {
  const { addExpense } = useTrips();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('shared');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    addExpense(tripId, { title, amount: parseFloat(amount), type });
    setTitle('');
    setAmount('');
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">💰 บันทึกค่าใช้จ่าย</h4>
      
      <form onSubmit={handleSubmit} className="space-y-2 mb-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="รายการ (เช่น ค่าน้ำมัน)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded-lg text-sm bg-gray-50"
          />
          <input
            type="number"
            placeholder="จำนวนเงิน (บาท)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded-lg text-sm bg-gray-50"
          />
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer">
            <input type="radio" checked={type === 'shared'} onChange={() => setType('shared')} /> หารเท่ากัน
          </label>
          <label className="text-xs text-gray-600 flex items-center gap-1 cursor-pointer">
            <input type="radio" checked={type === 'direct'} onChange={() => setType('direct')} /> ส่วนตัว
          </label>
          <button type="submit" className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition">
            เพิ่มรายการ
          </button>
        </div>
      </form>

      <ul className="space-y-1.5 max-h-36 overflow-y-auto">
        {expenses.map((exp) => (
          <li key={exp.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span className="text-gray-700">{exp.title} <span className="text-[10px] text-gray-400">({exp.type === 'shared' ? 'หารกลุ่ม' : 'ส่วนตัว'})</span></span>
            <span className="font-semibold text-gray-900">฿{exp.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseManager;