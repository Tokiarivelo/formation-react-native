/**
 * Configuration des variables d'environnement
 * Gestion centralisée des URLs et clés API
 */

interface EnvConfig {
  API_URL: string;
  JWT_KEY: string;
  REFRESH_TOKEN_KEY: string;
  APP_NAME: string;
  DEBUG_MODE: boolean;
}

const getEnvConfig = (): EnvConfig => {
  // En développement, utilise les valeurs par défaut
  const defaultConfig: EnvConfig = {
    API_URL: 'http://192.168.88.250:3000',
    JWT_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    APP_NAME: 'FormationReactNative',
    DEBUG_MODE: __DEV__,
  };

  // En production, charge depuis les variables d'environnement
  if (!__DEV__) {
    return {
      API_URL: process.env.API_URL || defaultConfig.API_URL,
      JWT_KEY: process.env.JWT_KEY || defaultConfig.JWT_KEY,
      REFRESH_TOKEN_KEY:
        process.env.REFRESH_TOKEN_KEY || defaultConfig.REFRESH_TOKEN_KEY,
      APP_NAME: process.env.APP_NAME || defaultConfig.APP_NAME,
      DEBUG_MODE: process.env.DEBUG_MODE === 'true',
    };
  }

  return defaultConfig;
};

export const env = getEnvConfig();

// Validation des variables critiques
if (!env.API_URL) {
  throw new Error('API_URL is required');
}

export default env;
