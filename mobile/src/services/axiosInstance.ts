/**
 * Instance Axios avec intercepteurs pour l'authentification
 * Gestion automatique des tokens et refresh
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { env } from '../config/env';
import { secureTokenStorage } from '../libs/storage/secureStore';
import { useAuthStore } from '../store/authStore';

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: env.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Intercepteur de requête - Ajouter le token d'accès
    this.instance.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        try {
          const accessToken = secureTokenStorage.getAccessToken();
          
          if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Log en mode debug
          if (env.DEBUG_MODE) {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
          }

          return config;
        } catch (error) {
          console.error('Erreur dans l\'intercepteur de requête:', error);
          return config;
        }
      },
      (error: AxiosError) => {
        console.error('Erreur de configuration de requête:', error);
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse - Gérer les erreurs 401 et refresh token
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log en mode debug
        if (env.DEBUG_MODE) {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Log en mode debug
        if (env.DEBUG_MODE) {
          console.log(`❌ API Error: ${error.response?.status} ${originalRequest.url}`);
        }

        // Si erreur 401 et pas déjà tenté de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Si déjà en cours de refresh, ajouter à la queue
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.instance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = secureTokenStorage.getRefreshToken();
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Tentative de refresh
            const response = await axios.post(
              `${env.API_URL}/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            // Sauvegarder les nouveaux tokens
            await secureTokenStorage.saveTokens({
              accessToken,
              refreshToken: newRefreshToken,
            });

            // Mettre à jour l'en-tête de la requête originale
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            // Traiter la queue des requêtes en attente
            this.processQueue(null);

            // Retry la requête originale
            return this.instance(originalRequest);
          } catch (refreshError) {
            console.error('Erreur lors du refresh token:', refreshError);
            
            // Traiter la queue avec l'erreur
            this.processQueue(refreshError);

            // Déconnecter l'utilisateur
            await this.handleLogout();
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  private async handleLogout(): Promise<void> {
    try {
      const authStore = useAuthStore.getState();
      await authStore.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  // Méthodes publiques
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  // Méthode pour upload de fichiers
  public upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> {
    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  }

  // Méthode pour obtenir l'instance Axios (pour cas spéciaux)
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Instance singleton
export const axiosInstance = new ApiClient();
export default axiosInstance;
