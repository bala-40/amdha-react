import MobileDetect from "mobile-detect";
import { useEffect, useState } from "react";

export const useIsMobile = (): boolean => {
    // Whenever the sample is changed from desktop -> mobile using the emulator, make sure we update the formFactor.
    const [isMobileSession, setIsMobileSession] = useState<boolean>(detectMobileSession());
    useEffect(() => {
        const updateIsMobile = (): void => {
            // The userAgent string is sometimes not updated synchronously when the `resize` event fires.
            setTimeout(() => {
                setIsMobileSession(detectMobileSession());
            });
        };
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    return isMobileSession;
};

export const isLandscape = (): boolean => window.innerWidth < window.innerHeight;

const detectMobileSession = (): boolean => !!new MobileDetect(window.navigator.userAgent).mobile();

export const isOnIphoneAndNotSafari = (): boolean => {
    const userAgent = navigator.userAgent;

    // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
    return userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'));
};

export const isIOS = (): boolean =>
    /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);