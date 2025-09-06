import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CarContext = createContext();

const STORAGE_KEY = 'car_data';

// Default demo data
const initialCars = [
  {
    id: '1',
    make: 'DEMO-Ford',
    model: 'Mustang',
    year: 1967,
    photoUri: null,
    maintenanceRecords: [
      {
        id: 'm1',
        type: 'Oil Change',
        date: '2024-05-15',
        mileage: 12000,
        notes: 'Changed oil and filter',
        photoUris: [],
      },
    ],
  },
];

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState(initialCars);
  const [loading, setLoading] = useState(true);

  // Load data from local storage on startup
  useEffect(() => {
    const loadCars = async () => {
      try {
        const storedCars = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedCars) {
          setCars(JSON.parse(storedCars));
        }
      } catch (error) {
        console.error('Error loading car data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCars();
  }, []);

  // Save data to local storage whenever cars change
  useEffect(() => {
    const saveCars = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
      } catch (error) {
        console.error('Error saving car data:', error);
      }
    };
    if (!loading) {
      saveCars();
    }
  }, [cars, loading]);

  // ===== CRUD FUNCTIONS =====
  const addCar = (newCar) => {
    setCars((currentCars) => [...currentCars, newCar]);
  };

  const addMaintenanceRecord = (carId, record) => {
    setCars((currentCars) =>
      currentCars.map((car) =>
        car.id === carId
          ? { ...car, maintenanceRecords: [...car.maintenanceRecords, record] }
          : car
      )
    );
  };

  const updateMaintenanceRecordPhotos = (carId, recordId, newPhotoUris) => {
    setCars((currentCars) =>
      currentCars.map((car) => {
        if (car.id !== carId) return car;
        return {
          ...car,
          maintenanceRecords: car.maintenanceRecords.map((record) =>
            record.id === recordId
              ? { ...record, photoUris: newPhotoUris }
              : record
          ),
        };
      })
    );
  };

  const updateCarPhoto = (carId, photoUri) => {
    setCars((currentCars) =>
      currentCars.map((car) =>
        car.id === carId ? { ...car, photoUri } : car
      )
    );
  };

  // ===== CLOUD SYNC PLACEHOLDER =====
  const syncToCloud = async (userId) => {
    // Example stub: Replace with Firebase/Supabase API call
    console.log(`Syncing ${cars.length} cars to cloud for user: ${userId}`);
    // await api.saveCars(userId, cars);
  };

  const loadFromCloud = async (userId) => {
    // Example stub: Replace with Firebase/Supabase API call
    console.log(`Loading cars from cloud for user: ${userId}`);
    // const cloudCars = await api.getCars(userId);
    // if (cloudCars) setCars(cloudCars);
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        addCar,
        addMaintenanceRecord,
        updateMaintenanceRecordPhotos,
        updateCarPhoto,
        syncToCloud,
        loadFromCloud,
        loading,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => useContext(CarContext);