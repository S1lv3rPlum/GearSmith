import React, { createContext, useState, useContext } from 'react';
const CarContext = createContext();
const initialCars = [
  {
    id: '1',
    make: 'Ford',
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
  {
    id: '2',
    make: 'Chevy',
    model: 'Camaro',
    year: 1969,
    photoUri: null,
    maintenanceRecords: [],
  },
];
export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState(initialCars);
  const addCar = (newCar) => {
    setCars((currentCars) => [...currentCars, newCar]);
  };
  const addMaintenanceRecord = (carId, record) => {
    setCars(currentCars =>
      currentCars.map(car =>
        car.id === carId
          ? { ...car, maintenanceRecords: [...car.maintenanceRecords, record] }
          : car
      )
    );
  };
  const updateMaintenanceRecordPhotos = (carId, recordId, newPhotoUris) => {
    setCars(currentCars =>
      currentCars.map(car => {
        if (car.id !== carId) return car;
        return {
          ...car,
          maintenanceRecords: car.maintenanceRecords.map(record =>
            record.id === recordId
              ? { ...record, photoUris: newPhotoUris }
              : record
          ),
        };
      })
    );
  };
  const updateCarPhoto = (carId, photoUri) => {
    setCars(currentCars =>
      currentCars.map(car =>
        car.id === carId ? { ...car, photoUri } : car
      )
    );
  };
  return (
    <CarContext.Provider
      value={{
        cars,
        addCar,
        addMaintenanceRecord,
        updateMaintenanceRecordPhotos,
        updateCarPhoto,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};
export const useCars = () => useContext(CarContext);