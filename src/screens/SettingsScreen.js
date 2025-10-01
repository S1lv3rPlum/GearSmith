import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
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
  const { user, login, signup, logout, authError } = useContext(AuthContext);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear inputs and auth form when user logs in or out
  useEffect(() => {
    if (user) {
      setEmailInput('');
      setPasswordInput('');
      setConfirmPasswordInput('');
      setShowAuthForm(false);
    }
  }, [user]);

  // Password validation
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    return {
      isValid: hasMinLength && hasNumber,
      hasMinLength,
      hasNumber,
    };
  };

  const passwordValidation = validatePassword(passwordInput);

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

  const handleLogin = async () => {
    if (!emailInput.trim() || !passwordInput) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(emailInput.trim(), passwordInput);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!emailInput.trim() || !passwordInput || !confirmPasswordInput) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!passwordValidation.isValid) {
      Alert.alert('Error', 'Password does not meet requirements');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(emailInput.trim(), passwordInput);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Sign Up failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  const openAuthForm = (mode) => {
    setAuthMode(mode);
    setShowAuthForm(true);
    setEmailInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* GearSmith name and logo */}
      <View style={styles.gearSmithContainer}>
        <Image
          source={require('../../assets/GearSmithLogo.png')}
          style={styles.profileImage}
          resizeMode="contain"
        />
        <Text style={[styles.gearSmithText, { color: theme.text }]}>GearSmith</Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.text }]}>User Profile</Text>
        {user ? (
          <>
            <Text style={{ color: theme.text, marginBottom: 8 }}>Logged in as: {user.email}</Text>
            <TouchableOpacity
              onPress={logout}
              style={[styles.authButton, { backgroundColor: theme.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Logout button"
            >
              <Text style={[styles.authButtonText, { color: theme.text }]}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : !showAuthForm ? (
          <View style={styles.authOptionsContainer}>
            <TouchableOpacity
              onPress={() => openAuthForm('login')}
              style={[styles.authOptionButton, { backgroundColor: theme.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Open login form"
            >
              <Text style={[styles.authButtonText, { color: theme.text }]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openAuthForm('signup')}
              style={[styles.authOptionButton, { backgroundColor: theme.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Open sign up form"
            >
              <Text style={[styles.authButtonText, { color: theme.text }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginCard}>
            <Text style={[styles.formTitle, { color: theme.text }]}>
              {authMode === 'login' ? 'Login to Your Account' : 'Create New Account'}
            </Text>

            <Text style={[styles.inputLabel, { color: theme.text }]}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={emailInput}
              onChangeText={setEmailInput}
              style={[styles.input, { color: theme.text, borderColor: theme.text }]}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={passwordInput}
                onChangeText={setPasswordInput}
                style={[styles.input, styles.passwordInput, { color: theme.text, borderColor: theme.text }]}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Text style={{ color: theme.accent, fontSize: 18 }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            {authMode === 'signup' && (
              <>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Confirm your password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPasswordInput}
                    onChangeText={setConfirmPasswordInput}
                    style={[styles.input, styles.passwordInput, { color: theme.text, borderColor: theme.text }]}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                    accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <Text style={{ color: theme.accent, fontSize: 18 }}>
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Password Requirements */}
                <View style={styles.passwordRequirements}>
                  <Text style={[styles.requirementsTitle, { color: theme.text }]}>
                    Password Requirements:
                  </Text>
                  <View style={styles.requirementRow}>
                    <Text style={{ color: passwordValidation.hasMinLength ? '#4CAF50' : '#888' }}>
                      {passwordValidation.hasMinLength ? '✓' : '○'}
                    </Text>
                    <Text style={[styles.requirementText, { 
                      color: passwordValidation.hasMinLength ? '#4CAF50' : theme.text 
                    }]}>
                      At least 8 characters
                    </Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Text style={{ color: passwordValidation.hasNumber ? '#4CAF50' : '#888' }}>
                      {passwordValidation.hasNumber ? '✓' : '○'}
                    </Text>
                    <Text style={[styles.requirementText, { 
                      color: passwordValidation.hasNumber ? '#4CAF50' : theme.text 
                    }]}>
                      At least one number
                    </Text>
                  </View>
                </View>
              </>
            )}

            {loading && <ActivityIndicator size="small" color={theme.accent} style={{ marginVertical: 12 }} />}

            <TouchableOpacity
              onPress={authMode === 'login' ? handleLogin : handleSignup}
              style={[styles.authButton, { backgroundColor: theme.accent, opacity: loading ? 0.6 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel={authMode === 'login' ? "Login button" : "Sign up button"}
              disabled={loading}
            >
              <Text style={[styles.authButtonText, { color: theme.text }]}>
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {authMode === 'login' && (
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={{ marginTop: 12, alignItems: 'center' }}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                disabled={loading}
              >
                <Text style={{ color: theme.accent, fontSize: 14 }}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <View style={styles.switchModeContainer}>
              <Text style={{ color: theme.text }}>
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                disabled={loading}
              >
                <Text style={{ color: theme.accent, fontWeight: '600' }}>
                  {authMode === 'login' ? 'Sign Up' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowAuthForm(false)}
              style={{ marginTop: 12, alignItems: 'center' }}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              disabled={loading}
            >
              <Text style={{ color: theme.accent }}>Cancel</Text>
            </TouchableOpacity>

            {authError ? (
              <Text style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{authError}</Text>
            ) : null}
          </View>
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
          <Text style={[styles.updateButtonText, { color: theme.text }]}>Check for App Updates</Text>
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
                item === accentColor && { borderColor: theme.accent, borderWidth: 3 },
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
        <Text style={{ color: theme.text }}>Data Forge Apps LLC   *   GetDataForge.com</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  gearSmithContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  gearSmithText: { fontSize: 28, fontWeight: 'bold', marginLeft: 8 },
  profileImage: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ccc' },
  section: { marginBottom: 24 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  colorCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  authOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  authOptionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  authButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: { fontSize: 16, fontWeight: '600' },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: { fontSize: 16, fontWeight: '600' },
  loginCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 45,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  passwordRequirements: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  requirementText: {
    fontSize: 13,
    marginLeft: 8,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});