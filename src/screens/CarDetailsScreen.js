import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCars } from '../context/CarContext';
import { ThemeContext } from '../context/ThemeContext';
// Paperclip icon emoji for maintenance records with photos
const PaperclipIcon = () => <Text style={{ fontSize: 20 }}>📎</Text>;
// Simple controls for sorting and filtering maintenance records
function SortFilterControls({ sortBy, setSortBy, filterType, setFilterType, maintenanceTypes }) {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.controlsContainer]}>
      <View style={styles.controlGroup}>
        <Text style={[styles.controlLabel, { color: theme.text }]}>Sort by:</Text>
        <View style={styles.controlButtons}>
          <TouchableOpacity
            onPress={() => setSortBy('date')}
            style={[
              styles.controlButton,
              sortBy === 'date' && { backgroundColor: theme.accent },
            ]}
          >
            <Text style={sortBy === 'date' ? [styles.controlTextActive] : { color: theme.text }}>
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortBy('type')}
            style={[
              styles.controlButton,
              sortBy === 'type' && { backgroundColor: theme.accent },
            ]}
          >
            <Text style={sortBy === 'type' ? styles.controlTextActive : { color: theme.text }}>
              Type
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.controlGroup}>
        <Text style={[styles.controlLabel, { color: theme.text }]}>Filter by type:</Text>
        <View style={styles.controlButtons}>
          <TouchableOpacity
            onPress={() => setFilterType('All')}
            style={[
              styles.controlButton,
              filterType === 'All' && { backgroundColor: theme.accent },
            ]}
          >
            <Text style={filterType === 'All' ? styles.controlTextActive : { color: theme.text }}>
              All
            </Text>
          </TouchableOpacity>
          {maintenanceTypes.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              style={[
                styles.controlButton,
                filterType === type && { backgroundColor: theme.accent },
              ]}
            >
              <Text style={filterType === type ? styles.controlTextActive : { color: theme.text }}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
export default function CarDetailScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { carId } = route.params;
  const { cars, addMaintenanceRecord, updateMaintenanceRecordPhotos, updateCarPhoto } = useCars();
  const car = cars.find(c => c.id === carId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('All');
  if (!car) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Car not found.</Text>
      </View>
    );
  }
  const maintenanceTypes = useMemo(() => {
    const typesSet = new Set(car.maintenanceRecords.map(rec => rec.type));
    return Array.from(typesSet);
  }, [car.maintenanceRecords]);
  const filteredAndSortedRecords = useMemo(() => {
    let records = [...car.maintenanceRecords];
    if (filterType !== 'All') {
      records = records.filter(rec => rec.type === filterType);
    }
    if (sortBy === 'date') {
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'type') {
      records.sort((a, b) => a.type.localeCompare(b.type));
    }
    return records;
  }, [car.maintenanceRecords, sortBy, filterType]);
  const openImageModal = (images) => {
    setSelectedImages(images);
    setModalVisible(true);
  };
  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImages([]);
  };
  const requestPermissions = async () => {
    if (Platform.OS === 'web') return true;
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaStatus.status !== 'granted') {
      Alert.alert('Permission required', 'Media library access is required.');
      return false;
    }
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus.status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is required.');
      return false;
    }
    return true;
  };
  const pickCarPhotoFromLibrary = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri || result.uri;
        if (uri) updateCarPhoto(carId, uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick vehicle photo. Please try again.');
      console.error(error);
    }
  };
  const takeCarPhotoWithCamera = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri || result.uri;
        if (uri) updateCarPhoto(carId, uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take vehicle photo. Please try again.');
      console.error(error);
    }
  };
  const addPhotosToRecord = async (recordId) => {
  const permissionGranted = await requestPermissions();
  if (!permissionGranted) return;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets?.map(asset => asset.uri) || [result.uri];
      const currentRecord = car.maintenanceRecords.find(r => r.id === recordId);
      if (!currentRecord) return;

      const updatedPhotoUris = [...(currentRecord.photoUris || []), ...newUris];

      const updatedRecord = {
        ...currentRecord,
        photoUris: updatedPhotoUris,
        lastModified: Date.now(), // <-- update timestamp here
      };

      updateMaintenanceRecordPhotos(carId, recordId, updatedRecord.photoUris, updatedRecord.lastModified);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to add photos. Please try again.');
    console.error(error);
  }
};
  const renderRecordItem = ({ item }) => (
    <View style={[styles.recordItem, { borderBottomColor: theme.accent }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[styles.recordType, { color: theme.text }]}>{item.type}</Text>
        {item.photoUris && item.photoUris.length > 0 && (
          <TouchableOpacity onPress={() => openImageModal(item.photoUris)} style={styles.iconButton}>
            <PaperclipIcon />
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ color: theme.text }}>Date: {item.date}</Text>
      <Text style={{ color: theme.text }}>Mileage: {item.mileage}</Text>
      {item.notes ? <Text style={{ color: theme.text }}>Notes: {item.notes}</Text> : null}
      <View style={{ marginTop: 8 }}>
        <Button
          title="Add Photos"
          onPress={() => addPhotosToRecord(item.id)}
          color={theme.accent}
        />
      </View>
    </View>
  );
  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
  );
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{car.make} {car.model} ({car.year})</Text>
      {/* Vehicle photo preview */}
      {car.photoUri ? (
        <Image source={{ uri: car.photoUri }} style={styles.carPhoto} />
      ) : (
        <Text style={{ fontStyle: 'italic', marginBottom: 12, color: theme.text }}>
          No vehicle photo yet.
        </Text>
      )}
      {/* Buttons to pick or take vehicle photo */}
      <View style={styles.photoButtonsRow}>
        <Button title="Pick Vehicle Photo" onPress={pickCarPhotoFromLibrary} color={theme.accent} />
        <View style={{ width: 16 }} />
        <Button title="Take Vehicle Photo" onPress={takeCarPhotoWithCamera} color={theme.accent} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button
          title="Add Maintenance"
          onPress={() => navigation.navigate('AddMaintenance', { carId })}
          color={theme.accent}
        />
      </View>
      <SortFilterControls
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterType={filterType}
        setFilterType={setFilterType}
        maintenanceTypes={maintenanceTypes}
      />
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Maintenance History:</Text>
      {filteredAndSortedRecords.length === 0 ? (
        <Text style={{ color: theme.text }}>No maintenance records match your criteria.</Text>
      ) : (
        <FlatList
          data={filteredAndSortedRecords}
          keyExtractor={item => item.id}
          renderItem={renderRecordItem}
        />
      )}
      {/* Modal for viewing maintenance images */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeImageModal}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <Button title="Close" onPress={closeImageModal} color={theme.accent} />
          <FlatList
            data={selectedImages}
            horizontal
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={renderImageItem}
            contentContainerStyle={{ paddingVertical: 16 }}
          />
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  carPhoto: {
    width: 200,
    height: 130,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
  photoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, marginTop: 20, marginBottom: 8 },
  recordItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  recordType: { fontWeight: 'bold', fontSize: 16 },
  iconButton: { paddingHorizontal: 8 },
  modalContainer: {
    flex: 1,
    paddingTop: 40,
  },
  image: {
    width: 300,
    height: 300,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  controlsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  controlGroup: {
    marginBottom: 12,
  },
  controlLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  controlButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  controlButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  controlButtonActive: {
    backgroundColor: '#4caf50',
  },
  controlTextActive: {
    color: '#fff',
  },
});