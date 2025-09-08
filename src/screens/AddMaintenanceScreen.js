import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCars } from '../context/CarContext';
import { ThemeContext } from '../context/ThemeContext';
export default function AddMaintenanceScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { carId } = route.params;
  const { addMaintenanceRecord } = useCars();
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUris, setPhotoUris] = useState([]);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        try {
          const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (mediaLibraryStatus.status !== 'granted') {
            Alert.alert(
              'Permission required',
              'Permission to access media library is required to select photos.'
            );
          }
          const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
          if (cameraStatus.status !== 'granted') {
            Alert.alert(
              'Permission required',
              'Permission to use camera is required to take photos.'
            );
          }
        } catch (error) {
          console.warn('Permission request error:', error);
          Alert.alert('Error', 'Failed to request permissions.');
        }
      }
    })();
  }, []);
  const addImageUri = (uri) => {
    setPhotoUris((prev) => [...prev, uri]);
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri || result.uri;
        if (uri) addImageUri(uri);
        else Alert.alert('Error', 'Could not get the selected image URI.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick the image. Please try again.');
      console.error('ImagePicker error:', error);
    }
  };
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri || result.uri;
        if (uri) addImageUri(uri);
        else Alert.alert('Error', 'Could not capture the photo URI.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };
  const removeImage = (index) => {
    setPhotoUris((prev) => prev.filter((_, i) => i !== index));
  };
  const onSubmit = () => {
  if (!type.trim() || !date.trim()) {
    Alert.alert('Validation error', 'Please enter maintenance type and date.');
    return;
  }

  const newRecord = {
    id: Date.now().toString(), // unique ID
    type: type.trim(),
    date: date.trim(),
    mileage: Number(mileage) || 0,
    notes: notes.trim(),
    photoUris,
    lastModified: Date.now(), // <-- added timestamp for hybrid sync
  };

  addMaintenanceRecord(carId, newRecord);
  navigation.goBack();
};
  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item }} style={styles.imagePreview} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(index)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[styles.container]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.label, { color: theme.text }]}>Maintenance Type *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.accent, color: theme.text, backgroundColor: theme.mode === 'dark' ? '#222' : '#fff' },
          ]}
          placeholder="Oil Change, Tire Rotation, etc."
          placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
          value={type}
          onChangeText={setType}
        />
        <Text style={[styles.label, { color: theme.text }]}>Date of Service *</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.accent, color: theme.text, backgroundColor: theme.mode === 'dark' ? '#222' : '#fff' },
          ]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
          value={date}
          onChangeText={setDate}
        />
        <Text style={[styles.label, { color: theme.text }]}>Mileage at Service</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.accent, color: theme.text, backgroundColor: theme.mode === 'dark' ? '#222' : '#fff' },
          ]}
          placeholder="e.g. 15000"
          placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
          value={mileage}
          onChangeText={setMileage}
          keyboardType="numeric"
        />
        <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
        <TextInput
          style={[
            styles.input,
            styles.notesInput,
            { borderColor: theme.accent, color: theme.text, backgroundColor: theme.mode === 'dark' ? '#222' : '#fff' },
          ]}
          placeholder="Additional details"
          placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
        <View style={styles.buttonRow}>
          <Button title="Pick Photos" onPress={pickImage} color={theme.accent} />
          <View style={{ width: 16 }} />
          <Button title="Take Photo" onPress={takePhoto} color={theme.accent} />
        </View>
        {photoUris.length > 0 && (
          <>
            <Text style={[styles.label, { marginTop: 16, color: theme.text }]}>Selected Photos:</Text>
            <FlatList
              data={photoUris}
              horizontal
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={renderImageItem}
              style={styles.imageList}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </>
        )}
        <View style={styles.saveButtonContainer}>
          <Button title="Save Maintenance" onPress={onSubmit} color={theme.accent} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40, // Extra bottom padding so content is above nav bar
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  imageList: {
    marginTop: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  saveButtonContainer: {
    marginTop: 24,
  },
});
