import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppTextInput from '../../../components/ui/AppTextInput';
import AppSwitch from '../../../components/ui/AppSwitch';
import { useAuthForm } from '../hooks/useAuthForm';
import { getErrorMessages } from '../../utils/errorUtils';
import AppText from '../../../components/ui/AppText';
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity';

const AuthForm = ({ signUp }: { signUp: boolean }) => {
  const {
    formData,
    updateField,
    showPassword,
    toggleShowPassword,
    handleSubmit,
    isLoading,
    error,
    isError,
  } = useAuthForm(signUp);

  return (
    <View>
      <AppText style={styles.title}>{signUp ? 'Register' : 'Login'}</AppText>

      <AppTextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => updateField('email', value)}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        style={styles.input}
      />

      <AppTextInput
        placeholder="Password"
        secure={!showPassword}
        value={formData.password}
        onChangeText={(value) => updateField('password', value)}
        textContentType="password"
        autoComplete="password"
        style={styles.input}
      />

      {signUp && (
        <>
          <AppTextInput
            placeholder="Username"
            value={formData.username}
            onChangeText={(value) => updateField('username', value)}
            textContentType="username"
            autoComplete="username"
            style={styles.input}
          />
          <AppTextInput
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            textContentType="name"
            autoComplete="name"
            style={styles.input}
          />
          <AppTextInput
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            textContentType="name"
            autoComplete="name"
            style={styles.input}
          />
        </>
      )}

      <View style={styles.switchContainer}>
        <AppSwitch
          value={showPassword}
          onValueChange={toggleShowPassword}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={showPassword ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
        <AppText style={styles.switchLabel}>Show password?</AppText>
      </View>

      <AppTouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        style={styles.button}
      >
        <AppText style={styles.buttonText}>
          {signUp
            ? isLoading
              ? 'Signing up...'
              : 'Sign Up'
            : isLoading
              ? 'Logging in...'
              : 'Log In'}
        </AppText>
      </AppTouchableOpacity>

      {isError && (
        <View style={styles.errorContainer}>
          {getErrorMessages(error).map((msg, i) => (
            <AppText key={i} style={styles.errorText}>
              {msg}
            </AppText>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default AuthForm;
