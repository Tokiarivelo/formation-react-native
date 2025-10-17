// Lightweight navigation/logout notifier for non-navigation-aware modules
// App code (where navigation exists) should register a handler via `setOnLogout`.

type LogoutHandler = () => void;

let onLogout: LogoutHandler | null = null;

export const setOnLogout = (handler: LogoutHandler) => {
    onLogout = handler;
};

export const clearOnLogout = () => {
    onLogout = null;
};

export const triggerLogout = () => {
    if (onLogout) {
        try {
            onLogout();
        } catch (e) {
            console.warn('onLogout handler threw an error', e);
        }
    } else {
        // No handler registered — it's fine; app can still react by observing tokens cleared.
        console.info('triggerLogout called but no onLogout handler registered');
    }
};

export default {
    setOnLogout,
    clearOnLogout,
    triggerLogout,
};
