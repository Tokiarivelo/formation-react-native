/**
 * Tests unitaires pour l'architecture d'authentification
 * Tests des stores Zustand et des hooks React Query
 */

import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useLogin, useLogout } from '../modules/auth/hooks/useAuth';

// Mock des dépendances
jest.mock('react-native-keychain', () => ({
  setInternetCredentials: jest.fn(),
  getInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn(),
  ACCESS_CONTROL: {
    BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BiometryAnyOrDevicePasscode',
  },
  AUTHENTICATION_TYPE: {
    DEVICE_PASSCODE_OR_BIOMETRICS: 'DevicePasscodeOrBiometrics',
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Wrapper pour React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset du store avant chaque test
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set user correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login correctly', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    await act(async () => {
      await result.current.login(mockUser, mockTokens);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle logout correctly', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    // D'abord connecter l'utilisateur
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    await act(async () => {
      await result.current.login(mockUser, mockTokens);
    });

    // Puis déconnecter
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const errorMessage = 'Test error';

    act(() => {
      result.current.setError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});

describe('Auth Hooks', () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    // Reset du store avant chaque test
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  it('should handle login mutation', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);

    // Note: Pour tester complètement, il faudrait mocker l'API
    // Ici on teste juste que le hook se monte correctement
  });

  it('should handle logout mutation', async () => {
    const { result } = renderHook(() => useLogout(), { wrapper });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);

    // Note: Pour tester complètement, il faudrait mocker l'API
    // Ici on teste juste que le hook se monte correctement
  });
});

describe('Integration Tests', () => {
  it('should integrate store and hooks correctly', () => {
    const { result: storeResult } = renderHook(() => useAuthStore());
    const wrapper = createWrapper();
    const { result: loginResult } = renderHook(() => useLogin(), { wrapper });

    // Vérifier que les deux hooks fonctionnent ensemble
    expect(storeResult.current.isAuthenticated).toBe(false);
    expect(loginResult.current.isPending).toBe(false);
  });
});

