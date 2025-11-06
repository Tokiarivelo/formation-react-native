// src/context/NetInfoProvider.tsx
import React, { createContext, useEffect, useState, useContext } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type NetInfoContextType = {
    isConnected: boolean | null;
    details: NetInfoState | null;
};

const NetInfoContext = createContext<NetInfoContextType>({
    isConnected: null,
    details: null,
});

export const NetInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [details, setDetails] = useState<NetInfoState | null>(null);

    useEffect(() => {
        // Subscribe to connection updates
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
            setDetails(state);
        });

        // Fetch initial state immediately
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected);
            setDetails(state);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <NetInfoContext.Provider value={{ isConnected, details }}>
            {children}
        </NetInfoContext.Provider>
    );
};

// Custom hook for easy access
export const useNetInfo = () => useContext(NetInfoContext);
