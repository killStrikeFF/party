import * as Location from 'expo-location';
import { regionFrom } from './calculateRegion';

export const getUserLocation = async () => {
  return Location.getCurrentPositionAsync({});
};

export const getUserPosition = async () => {
  return getUserLocation().then(loc => ({
    longitude: loc.coords.longitude,
    latitude: loc.coords.latitude,
  }));
};

export const getUserRegion = async (distance = 500) => {
  return getUserPosition().then(pos => regionFrom(pos.latitude, pos.longitude, distance));
};
