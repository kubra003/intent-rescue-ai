/**
 * IntentRescue AI: Principal Geolocation Utility
 * Handles device-aware location discovery for emergency coordination.
 * Features browser-based fallback and privacy-first handling.
 * Focus on Google Services & Real-world Usability.
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation Error:", error);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}
