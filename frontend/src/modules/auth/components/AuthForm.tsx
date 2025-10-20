import { View, Text } from 'react-native'
import React, { useState } from 'react'
import AppTextInput from '../../../components/ui/AppTextInput'
import AppPressable from '../../../components/ui/AppPressable';
import AppSwitch from '../../../components/ui/AppSwitch';
import { useLogin, useRegister } from '../hooks/useAuth';

function getErrorMessages(error: any): string[] {
  if (!error) return [];

  const msg = error.message ?? '';

  // If it's already an array (strings or objects)
  if (Array.isArray(msg)) {
    return msg;
  }

  // If message is a string
  if (typeof msg === 'string') return [msg];

  return [String(error)];
}

const AuthForm = ({ signUp }: { signUp: boolean }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, error: loginError, isPending: loginLoading, isError: loginIsError } = useLogin();
  const { mutate: register, error: registerError, isPending: registerLoading, isError: registerIsError } = useRegister();

  const handleLogin = () => {
    login({ email, password });
  };
  const handleSignUp = () => {
    register({ email, password, username, firstName, lastName });
  }

  return (
    <View>
      <AppTextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />

      <AppTextInput
        placeholder="password"
        secure={!showPassword}
        value={password}
        onChangeText={setPassword}
        textContentType="password"
        autoComplete="password"
      />

      {signUp && (
        <>
          <AppTextInput
            placeholder="username"
            value={username}
            onChangeText={setUsername}
            textContentType="username"
            autoComplete="username"
          />
          <AppTextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            textContentType="name"
            autoComplete="name"
          />
          <AppTextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastname}
            textContentType="name"
            autoComplete="name"
          />
        </>
      )}

      <AppSwitch value={showPassword}
        onValueChange={() => setShowPassword(previousState => !previousState)}
        rackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={showPassword ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e" />

      <Text>Show password?</Text>

      <AppPressable onPress={signUp ? handleSignUp : handleLogin} disabled={loginLoading || registerLoading}>
        {signUp ? `${registerLoading ? 'Signing up...' : 'Sign up'}` : `${loginLoading ? 'Loging in...' : 'Log in'}`}
      </AppPressable>

      {loginIsError && (
        <View style={{ marginTop: 10 }}>
          {getErrorMessages(loginError).map((msg, i) => (
            <Text key={i} style={{ color: 'red', marginBottom: 4 }}>
              {msg}
            </Text>
          ))}
        </View>
      )}

      {registerIsError && (
        <View style={{ marginTop: 10 }}>
          {getErrorMessages(registerError).map((msg, i) => (
            <Text key={i} style={{ color: 'red', marginBottom: 4 }}>
              {msg}
            </Text>
          ))}
        </View>
      )}

    </View>
  )
}

export default AuthForm