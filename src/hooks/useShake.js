import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Hook to detect device shakes.
 * Useful for mobile interactions (e.g., "Shake to send a hug!").
 * 
 * @param {Function} onShake - Callback triggered when a shake is detected
 * @param {Object} options - threshold (gravity force), timeout (ms between shakes)
 */
export default function useShake(onShake, options = {}) {
  const { threshold = 15, timeout = 1000 } = options;
  
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const lastTime = useRef(new Date().getTime());
  const lastCoords = useRef({ x: null, y: null, z: null });

  // Handle requesting iOS 13+ permission for DeviceMotion if applicable
  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
        }
      } catch (e) {
        console.warn('DeviceMotion permission flow failed', e);
      }
    } else {
      // Non-iOS 13+ devices don't require this explicit permission flow
      setPermissionGranted(true);
    }
  }, []);

  const handleMotion = useCallback((e) => {
    const current = e.accelerationIncludingGravity;
    if (!current || current.x === null) return;

    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastTime.current;

    // Only process every 100ms to save performance
    if (timeDifference > 100) {
      if (lastCoords.current.x !== null) {
        const deltaX = Math.abs(lastCoords.current.x - current.x);
        const deltaY = Math.abs(lastCoords.current.y - current.y);
        const deltaZ = Math.abs(lastCoords.current.z - current.z);

        // Calculate total movement magnitude
        const speed = (deltaX + deltaY + deltaZ) / timeDifference * 10000;

        if (speed > threshold) {
          // Prevent multiple triggers in rapid succession
          if (currentTime - lastTime.current > timeout) {
            onShake();
            // Reset timer after a confirmed shake
            lastTime.current = currentTime;
          }
        }
      }

      // Store current coordinates
      lastCoords.current = { x: current.x, y: current.y, z: current.z };
      
      // Update time if we didn't just trigger a shake
      if (currentTime - lastTime.current <= timeout) {
         lastTime.current = currentTime;
      }
    }
  }, [onShake, threshold, timeout]);

  useEffect(() => {
    // Check if the API exists first
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      setIsSupported(true);
      
      // If permission is already granted (or not needed), start listening
      if (permissionGranted) {
        window.addEventListener('devicemotion', handleMotion, false);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleMotion, permissionGranted]);

  return { isSupported, permissionGranted, requestPermission };
}
