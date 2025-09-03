import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  SafeAreaView,
} from 'react-native';
import { useCars } from '../context/CarContext';
import { ThemeContext } from '../context/ThemeContext';
export default function CarListScreen({ navigation }) {
  const { cars } = useCars();
  const { theme } = useContext(ThemeContext);
  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.carItem, { borderColor: theme.accent }]}
      onPress={() => navigation.navigate('CarDetails', { carId: item.id })}
    >
      {item.photoUri ? (
        <Image source={{ uri: item.photoUri }} style={styles.carPhotoThumbnail} />
      ) : (
        <View style={[styles.carPhotoThumbnail, styles.photoPlaceholder]}>
          <Text style={[styles.photoPlaceholderText, { color: theme.text }]}>No Photo</Text>
        </View>
      )}
      <Text style={[styles.carName, { color: theme.text }]}>
        {item.make} {item.model} ({item.year})
      </Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={renderCarItem}
          ListEmptyComponent={
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>
              No cars available. Add some!
            </Text>
          }
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Add New Car"
            onPress={() => navigation.navigate('AddCar')}
            color={theme.accent}
          />
          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            color={theme.accent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    // borderColor replaced with theme value in component
  },
  carPhotoThumbnail: {
    width: 80,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 12,
    // color replaced with theme value in component
  },
  carName: {
    fontSize: 18,
    // color replaced with theme value in component
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 50, // ensures buttons are not overlapped by nav bar
  },
});
