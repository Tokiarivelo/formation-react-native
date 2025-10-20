// Environment configuration
export const ENV = {
  API_URL: process.env.API_URL || 'http://localhost:3000',
  JWT_KEY: process.env.JWT_KEY || 'your-secret-key',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
export const validateEnv = () => {
  const required = ['API_URL'];
  
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`Missing environment variable: ${key}`);
    }
  }
};
