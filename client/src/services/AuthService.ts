// PWA "INVISIBLE" AUTHENTICATION
// Uses LocalStorage to persist session (Simulating Device ID)

const DEVICE_KEY = 'navrit_device_id';

export const checkDevice = () => {
    const deviceId = localStorage.getItem(DEVICE_KEY);
    if (deviceId) return true; // Known device
    return false; // Unknown device
};

export const registerDevice = () => {
    // In real life, this would happen after OTP verification
    const newId = 'DEV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem(DEVICE_KEY, newId);
    return newId;
};

export const getSession = () => {
    return {
        user: 'Alex Sales',
        role: 'Elite',
        branch: 'Delhi West'
    };
};
