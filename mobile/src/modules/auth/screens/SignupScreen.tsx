import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { theme } from '../../../config/theme';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../types/models';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignup } from '../hooks/useAuth';

type SignupFormValues = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignupNavigation = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupNavigation>();
  const [loading, setLoading] = useState(false);
  const signupMutation = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      // Simulation d'inscription
      await signupMutation.mutateAsync(values);
      Alert.alert('Succès', 'Inscription réussie !');
      reset();
    } catch (error) {
      console.log("❌ Erreur d'inscription:", error);
      Alert.alert('Erreur', "Erreur lors de l'inscription");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Créez votre compte</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prénom</Text>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: 'Prénom requis' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="John"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                autoComplete="name-given"
              />
            )}
          />
          {errors.firstName && (
            <Text style={[styles.label, { color: theme.colors.danger }]}>
              {errors.firstName.message}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <Controller
            control={control}
            name="lastName"
            rules={{ required: 'Nom requis' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Doe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                autoComplete="name-family"
              />
            )}
          />
          {errors.lastName && (
            <Text style={[styles.label, { color: theme.colors.danger }]}>
              {errors.lastName.message}
            </Text>
          )}
        </View>

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
          <Text style={styles.label}>Nom d'utilisateur</Text>
          <Controller
            control={control}
            name="username"
            rules={{ required: "Nom d'utilisateur requis" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="johndoe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoComplete="username"
              />
            )}
          />
          {errors.username && (
            <Text style={[styles.label, { color: theme.colors.danger }]}>
              {errors.username.message}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Mot de passe requis',
              minLength: { value: 6, message: '6 caractères minimum' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password-new"
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
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            Déjà un compte ? Se connecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
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
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
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

export default SignupScreen;
