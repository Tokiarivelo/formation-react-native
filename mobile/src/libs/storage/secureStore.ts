/**
 * Stockage sécurisé des tokens JWT
 * Utilise react-native-keychain pour la sécurité maximale
 */

import * as Keychain from 'react-native-keychain';
import { env } from '../../config/env';

export interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
}

class SecureTokenStorage {
  private static instance: SecureTokenStorage;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  static getInstance(): SecureTokenStorage {
    if (!SecureTokenStorage.instance) {
      SecureTokenStorage.instance = new SecureTokenStorage();
    }
    return SecureTokenStorage.instance;
  }

  /**
   * Sauvegarde les tokens de manière sécurisée
   */
  async saveTokens(tokens: TokenStorage): Promise<void> {
    try {
      const { accessToken, refreshToken } = tokens;

      if (accessToken) {
        await Keychain.setInternetCredentials(
          `${env.JWT_KEY}_access`,
          'access_token',
          accessToken,
          {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
            accessGroup: env.APP_NAME,
            authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
            showPrompt: 'Authentifiez-vous pour sauvegarder vos tokens',
          }
        );
        this.accessToken = accessToken;
      }

      if (refreshToken) {
        await Keychain.setInternetCredentials(
          `${env.JWT_KEY}_refresh`,
          'refresh_token',
          refreshToken,
          {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
            accessGroup: env.APP_NAME,
            authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
            showPrompt: 'Authentifiez-vous pour sauvegarder vos tokens',
          }
        );
        this.refreshToken = refreshToken;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tokens:', error);
      throw new Error('Impossible de sauvegarder les tokens de manière sécurisée');
    }
  }

  /**
   * Récupère les tokens stockés
   */
  async getTokens(): Promise<TokenStorage> {
    try {
      const accessCredentials = await Keychain.getInternetCredentials(`${env.JWT_KEY}_access`);
      const refreshCredentials = await Keychain.getInternetCredentials(`${env.JWT_KEY}_refresh`);

      const accessToken = accessCredentials ? accessCredentials.password : null;
      const refreshToken = refreshCredentials ? refreshCredentials.password : null;

      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Erreur lors de la récupération des tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  /**
   * Supprime tous les tokens stockés
   */
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        Keychain.resetInternetCredentials(`${env.JWT_KEY}_access`),
        Keychain.resetInternetCredentials(`${env.JWT_KEY}_refresh`),
      ]);

      this.accessToken = null;
      this.refreshToken = null;
    } catch (error) {
      console.error('Erreur lors de la suppression des tokens:', error);
    }
  }

  /**
   * Vérifie si des tokens sont disponibles
   */
  async hasTokens(): Promise<boolean> {
    const tokens = await this.getTokens();
    return !!(tokens.accessToken && tokens.refreshToken);
  }

  /**
   * Récupère le token d'accès en mémoire (plus rapide)
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Récupère le refresh token en mémoire (plus rapide)
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

export const secureTokenStorage = SecureTokenStorage.getInstance();
export default secureTokenStorage;

