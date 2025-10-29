import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import { Auth } from '../constants';

const rnBiometrics = new ReactNativeBiometrics();

export class BiometricAuthService {
    // Vérifier disponibilité biométrie
    static async isAvailable(): Promise<{
        available: boolean;
        type: BiometryType | undefined;
    }> {
        try {
            const { available, biometryType } =
                await rnBiometrics.isSensorAvailable();
            return { available, type: biometryType };
        } catch {
            return { available: false, type: undefined };
        }
    }

    // Activer protection biométrique après login
    static async enableBiometric(userId: string): Promise<boolean> {
        try {
            const { available } = await this.isAvailable();
            if (!available) return false;

            //get the user credentials from secure store
            const credentials = await Keychain.getGenericPassword(
                { service: Auth.KEYCHAIN_SERVICE_CREDENTIALS }
            );
            if (!credentials) {
                console.error('No credentials stored for biometric enable');
                return false;
            }

            // Stocker l'activation dans les préférences
            await Keychain.setInternetCredentials(
                `biometric_${userId}`,
                credentials.username,
                credentials.password,
                {
                    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
                }
            );

            return true;
        } catch (error) {
            console.error('Biometric enable failed:', error);
            return false;
        }
    }

    // Authentification biométrique
    static async authenticate(userId: string): Promise<{
        success: boolean;
        credentials?: { username: string; password: string };
        cancelled?: boolean;
        error?: string;
    }> {
        try {
            // Vérifier si biométrie activée pour cet utilisateur
            const credentials = await Keychain.getInternetCredentials(
                `biometric_${userId}`
            );
            if (!credentials) {
                return { success: false, error: 'Biometric not enabled' };
            }

            // Demander authentification biométrique
            const { success, error } = await rnBiometrics.simplePrompt({
                promptMessage: 'Authenticate with your biometrics',
                cancelButtonText: 'Cancel',
            });

            if (success) {
                return { success: true, credentials: credentials };
            } else {
                return {
                    success: false,
                    cancelled: error === 'User cancellation',
                    error,
                };
            }
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    // Désactiver biométrie
    static async disableBiometric(userId: string): Promise<void> {
        try {
            await Keychain.resetInternetCredentials({ server: `biometric_${userId}` });
        } catch (error) {
            console.error('Disable biometric failed:', error);
        }
    }
}