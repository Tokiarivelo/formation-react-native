import { View, Text } from 'react-native'
import React, { useState } from 'react'
import AppTextInput from '../../../components/ui/AppTextInput'
import AppPressable from '../../../components/ui/AppPressable';
import AppSwitch from '../../../components/ui/AppSwitch';
import { useLogin } from '../hooks/useAuth';

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
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <View>
      <AppTextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="username"
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
        <AppTextInput
          placeholder="confirm password"
          secure={!showPassword}
          value={confirm}
          onChangeText={setConfirm}
          textContentType="password"
          autoComplete="password"
        />
      )}

      <AppSwitch value={showPassword}
        onValueChange={() => setShowPassword(previousState => !previousState)}
        rackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={showPassword ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e" />

      <Text>Show password?</Text>

      <AppPressable onPress={handleLogin} disabled={loginMutation.isPending}>
        {signUp ? `Sign in` : `${loginMutation.isPending ? 'Loging in...' : 'Log in'}`}
      </AppPressable>

      {loginMutation.isError && (
        <View style={{ marginTop: 10 }}>
          {getErrorMessages(loginMutation.error).map((msg, i) => (
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