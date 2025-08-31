import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CarListScreen from '../screens/CarListScreen';
import CarDetailsScreen from '../screens/CarDetailsScreen';
import AddMaintenanceScreen from '../screens/AddMaintenanceScreen';
import AddCarScreen from '../screens/AddCarScreen'; // placeholder if you have it
import SettingsScreen from '../screens/SettingsScreen'; // placeholder if you have it
const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CarList">
        <Stack.Screen name="CarList" component={CarListScreen} options={{ title: 'Cars' }} />
        <Stack.Screen name="CarDetails" component={CarDetailsScreen} options={{ title: 'Car Details' }} />
        <Stack.Screen name="AddMaintenance" component={AddMaintenanceScreen} options={{ title: 'Add Maintenance' }} />
        <Stack.Screen name="AddCar" component={AddCarScreen} options={{ title: 'Add Car' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}