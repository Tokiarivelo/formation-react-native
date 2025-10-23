/**
 * API d'authentification
 * Appels réseau pour login, signup, refresh token
 */

import { axiosInstance } from '../../services/axiosInstance';

// Types pour les requêtes
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Types pour les réponses
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}

// API d'authentification
export const authApi = {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Inscription utilisateur
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/signup', userData);
    return data;
  },

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<MessageResponse> {
    const { data } = await axiosInstance.post<MessageResponse>('/auth/logout');
    return data;
  },

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const { data } = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },

  /**
   * Demander un reset de mot de passe
   */
  async forgotPassword(email: ForgotPasswordRequest): Promise<MessageResponse> {
    const { data } = await axiosInstance.post<MessageResponse>('/auth/forgot-password', email);
    return data;
  },

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(resetData: ResetPasswordRequest): Promise<MessageResponse> {
    const { data } = await axiosInstance.post<MessageResponse>('/auth/reset-password', resetData);
    return data;
  },

  /**
   * Vérifier la validité du token
   */
  async verifyToken(): Promise<{ valid: boolean; user?: any }> {
    const { data } = await axiosInstance.get<{ valid: boolean; user?: any }>('/auth/verify');
    return data;
  },

  /**
   * Obtenir le profil utilisateur actuel
   */
  async getProfile(): Promise<AuthResponse['user']> {
    const { data } = await axiosInstance.get<AuthResponse['user']>('/auth/profile');
    return data;
  },

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(updates: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> {
    const { data } = await axiosInstance.patch<AuthResponse['user']>('/auth/profile', updates);
    return data;
  },

  /**
   * Changer le mot de passe
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    const { data } = await axiosInstance.patch<MessageResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },

  /**
   * Supprimer le compte utilisateur
   */
  async deleteAccount(): Promise<MessageResponse> {
    const { data } = await axiosInstance.delete<MessageResponse>('/auth/account');
    return data;
  },
};

export default authApi;

