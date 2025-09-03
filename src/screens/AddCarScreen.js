import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCars } from '../context/CarContext';
import { ThemeContext } from '../context/ThemeContext';
export default function AddCarScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  // If editing, car object is passed via route params
  const carToEdit = route.params?.car || null;
  const { addCar, updateCar } = useCars();
  // Local form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [nickname, setNickname] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  useEffect(() => {
    if (carToEdit) {
      setMake(carToEdit.make || '');
      setModel(carToEdit.model || '');
      setYear(carToEdit.year?.toString() || '');
      setNickname(carToEdit.nickname || '');
      setPhotoUri(carToEdit.photoUri || null);
    }
  }, [carToEdit]);
  // Request permissions to access media library and camera
  const requestPermissions = async () => {
    if (Platform.OS === 'web') return true;
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaStatus.status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is required.');
      return false;
    }
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus.status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access camera is required.');
      return false;
    }
    return true;
  };
  // Pick image from library
  const pickPhoto = async () => {
    const permission = await requestPermissions();
    if (!permission) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri || result.uri;
        setPhotoUri(uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick a photo. Please try again.');
    }
  };
  // Take photo with camera
  const takePhoto = async () => {
    const permission = await requestPermissions();
    if (!permission) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uri = result.assets?.[0]?.uri || result.uri;
        setPhotoUri(uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to take a photo. Please try again.');
    }
  };
  // Form validation and submit handler
  const validateAndSubmit = () => {
    if (!make.trim()) {
      Alert.alert('Validation error', 'Please enter the car make.');
      return;
    }
    if (!model.trim()) {
      Alert.alert('Validation error', 'Please enter the car model.');
      return;
    }
    const parsedYear = Number(year);
    const currentYear = new Date().getFullYear();
    if (
      !year.trim() ||
      isNaN(parsedYear) ||
      parsedYear < 1886 ||
      parsedYear > currentYear + 1
    ) {
      Alert.alert('Validation error', 'Please enter a valid year.');
      return;
    }
    const carData = {
      id: carToEdit?.id || Date.now().toString(),
      make: make.trim(),
      model: model.trim(),
      year: parsedYear,
      nickname: nickname.trim() || null,
      photoUri: photoUri || null,
      maintenanceRecords: carToEdit?.maintenanceRecords || [],
    };
    if (carToEdit) {
      updateCar(carData);
    } else {
      addCar(carData);
    }
    setMake('');
    setModel('');
    setYear('');
    setNickname('');
    setPhotoUri(null);
    navigation.goBack();
  };
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[styles.heading, { color: theme.text }]}>
            {carToEdit ? 'Edit Car' : 'Add New Car'}
          </Text>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.carPhoto} />
          ) : (
            <View
              style={[
                styles.photoPlaceholder,
                { backgroundColor: theme.mode === 'dark' ? '#333' : '#f0f0f0' },
              ]}
            >
              <Text
                style={[
                  styles.photoPlaceholderText,
                  { color: theme.mode === 'dark' ? '#aaa' : '#888' },
                ]}
              >
                No photo selected
              </Text>
            </View>
          )}
          <View style={styles.photoButtonsContainer}>
            <Button title="Pick a Photo" onPress={pickPhoto} color={theme.accent} />
            <View style={styles.photoButtonSpacer} />
            <Button title="Take a Photo" onPress={takePhoto} color={theme.accent} />
          </View>
          <Text style={[styles.label, { color: theme.text }]}>Make *</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.accent,
                color: theme.text,
                backgroundColor: theme.mode === 'dark' ? '#222' : '#fff',
              },
            ]}
            placeholder="e.g., Ford"
            placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
            value={make}
            onChangeText={setMake}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Text style={[styles.label, { color: theme.text }]}>Model *</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.accent,
                color: theme.text,
                backgroundColor: theme.mode === 'dark' ? '#222' : '#fff',
              },
            ]}
            placeholder="e.g., Mustang"
            placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
            value={model}
            onChangeText={setModel}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Text style={[styles.label, { color: theme.text }]}>Year *</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.accent,
                color: theme.text,
                backgroundColor: theme.mode === 'dark' ? '#222' : '#fff',
              },
            ]}
            placeholder="e.g., 1967"
            placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
          />
          <Text style={[styles.label, { color: theme.text }]}>Nickname (optional)</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.accent,
                color: theme.text,
                backgroundColor: theme.mode === 'dark' ? '#222' : '#fff',
              },
            ]}
            placeholder="Your nickname for this car"
            placeholderTextColor={theme.mode === 'dark' ? '#888' : '#999'}
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={carToEdit ? 'Save Changes' : 'Add Car'}
              onPress={validateAndSubmit}
              color={theme.accent}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40, // extra bottom padding to avoid phone nav bar covering the button
  },
  heading: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  photoPlaceholder: {
    width: 250,
    height: 160,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  photoPlaceholderText: {
    // color replaced inline by theme
  },
  carPhoto: {
    width: 250,
    height: 160,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 16,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  photoButtonSpacer: {
    width: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
