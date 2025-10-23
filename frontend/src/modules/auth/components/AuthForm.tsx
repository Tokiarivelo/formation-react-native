import { View } from 'react-native';
import React from 'react';
import AppTextInput from '../../../components/ui/AppTextInput';
import AppPressable from '../../../components/ui/AppPressable';
import AppSwitch from '../../../components/ui/AppSwitch';
import { useAuthForm } from '../hooks/useAuthForm';
import { getErrorMessages } from '../../utils/errorUtils';
import AppText from '../../../components/ui/AppText';

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
      <AppTextInput
        placeholder="email"
        value={formData.email}
        onChangeText={(value) => updateField('email', value)}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />

      <AppTextInput
        placeholder="password"
        secure={!showPassword}
        value={formData.password}
        onChangeText={(value) => updateField('password', value)}
        textContentType="password"
        autoComplete="password"
      />

      {signUp && (
        <>
          <AppTextInput
            placeholder="username"
            value={formData.username}
            onChangeText={(value) => updateField('username', value)}
            textContentType="username"
            autoComplete="username"
          />
          <AppTextInput
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            textContentType="name"
            autoComplete="name"
          />
          <AppTextInput
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            textContentType="name"
            autoComplete="name"
          />
        </>
      )}

      <AppSwitch
        value={showPassword}
        onValueChange={toggleShowPassword}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={showPassword ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
      />

      <AppText>Show password?</AppText>

      <AppPressable onPress={handleSubmit} disabled={isLoading}>
        <AppText>
          {signUp ? `${isLoading ? 'Signing up...' : 'Sign up'}` : `${isLoading ? 'Logging in...' : 'Log in'}`}
        </AppText>
      </AppPressable>

      {isError && (
        <View style={{ marginTop: 10 }}>
          {getErrorMessages(error).map((msg, i) => (
            <AppText key={i} style={{ color: 'red', marginBottom: 4 }}>
              {msg}
            </AppText>
          ))}
        </View>
      )}
    </View>
  );
};

export default AuthForm;