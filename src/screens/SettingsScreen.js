import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Switch,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import UpdateChecker from '../services/UpdateChecker';
const ACCENT_COLORS = [
  '#FF6F61',
  '#6B5B95',
  '#88B04B',
  '#F7CAC9',
  '#92A8D1',
  '#955251',
  '#B565A7',
  '#009B77',
  '#DD4124',
  '#45B8AC',
];
export default function SettingsScreen() {
  const { theme, toggleThemeMode, accentColor, setAccentColor } = useContext(ThemeContext);
  const { user, login, logout } = useContext(AuthContext);
  const [emailInput, setEmailInput] = useState('');
const [passwordInput, setPasswordInput] = useState('');
const [showLoginForm, setShowLoginForm] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const checkForUpdates = async () => {
    setUpdateStatus('Checking for updates...');
    try {
      const result = await UpdateChecker.checkForUpdate();
      if (result.available) {
        setUpdateStatus('Update available! Starting download...');
        await UpdateChecker.startUpdate(result.type);
        setUpdateStatus('Update downloaded. Restart app to install.');
      } else {
        setUpdateStatus('App is up to date.');
      }
    } catch (error) {
      setUpdateStatus(`Error checking updates: ${error.message}`);
    }
    setTimeout(() => setUpdateStatus(''), 5000);
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* GearSmith name and logo placeholder */}
      <View style={styles.gearSmithContainer}>
        
       <Image
  source={require('../../assets/GearSmithLogo.png')}
  style={styles.profileImage}
  resizeMode="contain"
/>
<Text style={[styles.gearSmithText, { color: theme.text }]}>  GearSmith</Text>
      </View>
      {/* User Profile Section */}
      <View style={styles.section}>
  <Text style={[styles.heading, { color: theme.text }]}>User Profile</Text>
  {user ? (
    <>
      <Text style={{ color: theme.text, marginBottom: 8 }}>
        Logged in as: {user.email}
      </Text>
      <TouchableOpacity
        onPress={logout}
        style={[styles.authButton, { backgroundColor: theme.accent }]}
        accessibilityRole="button"
        accessibilityLabel="Logout button"
      >
        <Text style={[styles.authButtonText, { color: theme.text }]}>Logout</Text>
      </TouchableOpacity>
    </>
  ) : (
    <>
      {!showLoginForm ? (
        <TouchableOpacity
          onPress={() => setShowLoginForm(true)}
          style={[styles.authButton, { backgroundColor: theme.accent }]}
          accessibilityRole="button"
          accessibilityLabel="Login button"
        >
          <Text style={[styles.authButtonText, { color: theme.text }]}>
            Login / Sign Up
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ marginTop: 10 }}>
          <TextInput
            placeholder="Email"
            value={emailInput}
            onChangeText={setEmailInput}
            style={[styles.input, { color: theme.text, borderColor: theme.text }]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={passwordInput}
            onChangeText={setPasswordInput}
            style={[styles.input, { color: theme.text, borderColor: theme.text }]}
          />
          <TouchableOpacity
            onPress={() => login(emailInput, passwordInput)}
            style={[styles.authButton, { backgroundColor: theme.accent, marginBottom: 8 }]}
          >
            <Text style={[styles.authButtonText, { color: theme.text }]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => signup(emailInput, passwordInput)}
            style={[styles.authButton, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.authButtonText, { color: theme.text }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )}
</View>
      {/* App Update Section */}
      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.text }]}>App Updates</Text>
        <TouchableOpacity
          onPress={checkForUpdates}
          style={[styles.updateButton, { backgroundColor: theme.accent }]}
          accessibilityRole="button"
          accessibilityLabel="Check for app updates"
        >
          <Text style={[styles.updateButtonText, { color: theme.text }]}>
            Check for App Updates
          </Text>
        </TouchableOpacity>
        {updateStatus ? (
          <Text style={{ color: theme.text, marginTop: 8 }}>{updateStatus}</Text>
        ) : null}
      </View>
      {/* Theme Customization Section */}
      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.text }]}>Theme</Text>
        <View style={styles.row}>
          <Text style={{ color: theme.text }}>Dark Mode</Text>
          <Switch value={theme.mode === 'dark'} onValueChange={toggleThemeMode} />
        </View>
        <Text style={{ color: theme.text, marginTop: 10 }}>Accent Color</Text>
        <FlatList
          horizontal
          data={ACCENT_COLORS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              accessibilityLabel={`Select accent color ${item}`}
              accessibilityRole="button"
              style={[
                styles.colorCircle,
                { backgroundColor: item },
                item === accentColor && {
                  borderColor: theme.accent,
                  borderWidth: 3,
                },
              ]}
              onPress={() => setAccentColor(item)}
            />
          )}
          contentContainerStyle={{ marginTop: 8 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* About Section */}
      <View style={styles.section}>
        <Text style={{ color: theme.text }}>App Version: 1.0.0</Text>
        <Text style={{ color: theme.text }}>Data Forge Apps LLC   *   GetDataForge.com</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  gearSmithContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gearSmithText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  authButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 100,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 150,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});