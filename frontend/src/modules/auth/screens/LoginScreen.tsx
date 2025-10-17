import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AuthForm from '../components/AuthForm'
import { getAccessToken, getRefreshToken } from '../tokenStore';

const LoginScreen = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //JUST FOR TESTING PURPOSE --- REMOVE LATER
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // await the async token getters
        const a = await getAccessToken();
        const r = await getRefreshToken();
        if (!mounted) return;
        setAccessToken(a ?? null);
        setRefreshToken(r ?? null);
      } catch (err) {
        console.error('Failed to read tokens', err);
        if (mounted) {
          setAccessToken(null);
          setRefreshToken(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View>
      <AuthForm signUp={false} />
      <Text>LoginScreen</Text>

      {/*JUST FOR TESTING PURPOSE --- REMOVE LATER*/}
      <Text>AccessToken: {accessToken ?? 'null'}</Text>
      <Text>RefreshToken: {refreshToken ?? 'null'}</Text>
    </View>
  )
}

export default LoginScreen