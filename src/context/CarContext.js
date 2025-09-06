import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [deletedIds, setDeletedIds] = useState({ cars: [], records: [] });
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  // Load local data on start
  useEffect(() => {
    const loadLocalData = async () => {
      const localData = await AsyncStorage.getItem('cars');
      if (localData) setCars(JSON.parse(localData));
      const deletedData = await AsyncStorage.getItem('deletedIds');
      if (deletedData) setDeletedIds(JSON.parse(deletedData));
    };
    loadLocalData();
  }, []);

  // Save local data whenever cars or deletedIds change
  useEffect(() => {
    AsyncStorage.setItem('cars', JSON.stringify(cars));
    AsyncStorage.setItem('deletedIds', JSON.stringify(deletedIds));
    if (user && isConnected) {
      mergeWithCloud(cars, deletedIds, user.uid);
    }
  }, [cars, deletedIds, user, isConnected]);

  // Detect network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected && user) {
        mergeWithCloud(cars, deletedIds, user.uid);
      }
    });
    return () => unsubscribe();
  }, [user, cars, deletedIds]);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && isConnected) {
        mergeWithCloud(cars, deletedIds, firebaseUser.uid);
      }
    });
    return () => unsubscribe();
  }, [isConnected]);

  // Merge local and cloud data with edits and deletes
  const mergeWithCloud = async (localCars, deleted, uid) => {
    if (!uid) return;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      let cloudCars = docSnap.exists() ? docSnap.data().cars || [] : [];

      // Remove deleted items
      cloudCars = cloudCars.filter(car => !deleted.cars.includes(car.id));
      cloudCars.forEach(car => {
        if (car.maintenanceRecords) {
          car.maintenanceRecords = car.maintenanceRecords.filter(
            r => !deleted.records.includes(r.id)
          );
        }
      });

      // Merge cars
      const mergedCarsMap = {};
      cloudCars.forEach(car => mergedCarsMap[car.id] = car);
      localCars.forEach(localCar => {
        if (!mergedCarsMap[localCar.id]) {
          mergedCarsMap[localCar.id] = localCar;
        } else {
          // Choose latest modified for car
          if ((localCar.lastModified || 0) > (mergedCarsMap[localCar.id].lastModified || 0)) {
            mergedCarsMap[localCar.id] = { ...localCar };
          }
          // Merge maintenance records
          const cloudRecords = mergedCarsMap[localCar.id].maintenanceRecords || [];
          const localRecords = localCar.maintenanceRecords || [];
          const recordsMap = {};
          cloudRecords.forEach(r => recordsMap[r.id] = r);
          localRecords.forEach(r => {
            if (!recordsMap[r.id] || (r.lastModified || 0) > (recordsMap[r.id].lastModified || 0)) {
              recordsMap[r.id] = r;
            }
          });
          mergedCarsMap[localCar.id].maintenanceRecords = Object.values(recordsMap);
        }
      });

      const mergedCars = Object.values(mergedCarsMap);

      // Update local and cloud
      setCars(mergedCars);
      await setDoc(docRef, { cars: mergedCars });
      await AsyncStorage.setItem('cars', JSON.stringify(mergedCars));

      // Clear deleted IDs after successful sync
      setDeletedIds({ cars: [], records: [] });
      await AsyncStorage.removeItem('deletedIds');

    } catch (err) {
      console.warn('Merge with cloud failed:', err);
    }
  };

  // CRUD functions
  const addCar = (newCar) => {
    const carWithTimestamp = { ...newCar, lastModified: Date.now() };
    setCars(c => [...c, carWithTimestamp]);
  };

 const updateCar = (updatedCar) => {
  setCars(cars.map(car =>
    car.id === updatedCar.id
      ? { ...updatedCar, lastModified: Date.now() }
      : car
  ));
};

  const deleteCar = (carId) => {
    setCars(cars.filter(car => car.id !== carId));
    setDeletedIds(prev => ({ ...prev, cars: [...prev.cars, carId] }));
  };

  const addMaintenanceRecord = (carId, record) => {
    const recordWithTimestamp = { ...record, lastModified: Date.now() };
    setCars(currentCars =>
      currentCars.map(car =>
        car.id === carId
          ? { ...car, maintenanceRecords: [...car.maintenanceRecords, recordWithTimestamp] }
          : car
      )
    );
  };

  const updateMaintenanceRecord = (carId, recordId, updatedFields) => {
    setCars(currentCars =>
      currentCars.map(car => {
        if (car.id !== carId) return car;
        return {
          ...car,
          maintenanceRecords: car.maintenanceRecords.map(record =>
            record.id === recordId ? { ...record, ...updatedFields, lastModified: Date.now() } : record
          ),
        };
      })
    );
  };
const updateMaintenanceRecordPhotos = (carId, recordId, photoUris) => {
  setCars(currentCars =>
    currentCars.map(car => {
      if (car.id !== carId) return car;
      return {
        ...car,
        maintenanceRecords: car.maintenanceRecords.map(record =>
          record.id === recordId
            ? { ...record, photoUris, lastModified: Date.now() }
            : record
        ),
      };
    })
  );
};


  const deleteMaintenanceRecord = (carId, recordId) => {
    setCars(currentCars =>
      currentCars.map(car => {
        if (car.id !== carId) return car;
        return {
          ...car,
          maintenanceRecords: car.maintenanceRecords.filter(r => r.id !== recordId),
        };
      })
    );
    setDeletedIds(prev => ({ ...prev, records: [...prev.records, recordId] }));
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        addCar,
        updateCar,
        deleteCar,
        addMaintenanceRecord,
        updateMaintenanceRecord,
        deleteMaintenanceRecord,
        updateMaintenanceRecordPhotos,
        user,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => useContext(CarContext);