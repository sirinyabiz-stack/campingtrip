import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTrips = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    const localData = localStorage.getItem('camplog_trips');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('camplog_trips', JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip) => {
    setTrips([...trips, { id: Date.now(), ...trip, expenses: [], foodLogs: [] }]);
  };

  const addExpense = (tripId, expense) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, expenses: [...trip.expenses, { id: Date.now(), ...expense }] };
      }
      return trip;
    }));
  };

  const addFoodLog = (tripId, food) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, foodLogs: [...trip.foodLogs, { id: Date.now(), ...food }] };
      }
      return trip;
    }));
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, addExpense, addFoodLog }}>
      {children}
    </TripContext.Provider>
  );
};