import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export const SCHOOL_LOCATION = {
  latitude: 21.4997135,
  longitude: 73.0131412,
};

// Calculate distance between two coordinates (Haversine formula)
export function getDistanceFromSchool(
  userLat: number,
  userLon: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(userLat - SCHOOL_LOCATION.latitude);
  const dLon = toRad(userLon - SCHOOL_LOCATION.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(SCHOOL_LOCATION.latitude)) *
      Math.cos(toRad(userLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function useAttendanceTracking() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isBunking, setIsBunking] = useState(false);
  const [bunkHistory, setBunkHistory] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        const dist = getDistanceFromSchool(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        setDistance(dist);
        setIsBunking(dist > 2); // More than 2km → bunking
      } catch (err) {
        console.error('Location error:', err);
        setErrorMsg('Error getting location');
      }
    })();
  }, []);

  return {
    location,
    distance,
    errorMsg,
    isBunking,
    bunkHistory,
    setBunkHistory,
  };
}
