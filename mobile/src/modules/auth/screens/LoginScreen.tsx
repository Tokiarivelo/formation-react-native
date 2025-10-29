import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { theme } from '../../../config/theme';
import { useLogin } from '../hooks/useAuth';
import { useAuth } from '../../../store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../types/models';
import { useForm, Controller } from 'react-hook-form';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Hooks d'authentification
  const loginMutation = useLogin();
  const { isLoading, error, clearError } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = async ({ email, password }: LoginFormValues) => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      // La navigation sera gérée automatiquement par AppNavigator
      // grâce à la mise à jour du store Zustand
    } catch (error) {
      // L'erreur est déjà gérée par le hook useLogin
      console.error('Erreur de connexion:', error);
    }
  };

  // Afficher les erreurs du store
  React.useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Accédez à votre compte</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email requis',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email invalide',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
          {errors.email && (
            <Text style={[styles.label, { color: theme.colors.danger }]}>
              {errors.email.message}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: 'Mot de passe requis' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password"
              />
            )}
          />
          {errors.password && (
            <Text style={[styles.label, { color: theme.colors.danger }]}>
              {errors.password.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (isLoading || loginMutation.isPending) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(handleLogin)}
          disabled={isLoading || loginMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {isLoading || loginMutation.isPending
              ? 'Connexion...'
              : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.forgotPasswordText}>
            Pas de compte ? Créez-en un
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.gray[400],
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  container: {
    backgroundColor: theme.colors.background.secondary,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    marginTop: theme.spacing.sm,
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
  },
  input: {
    backgroundColor: theme.colors.background.tertiary,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    fontSize: theme.fontSizes.md,
    padding: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default LoginScreen;
