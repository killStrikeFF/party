import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { regionFrom } from './calculateRegion';
import { Coordinates } from '../types/coordinates';
import { UserRegion } from '../types/user-region';

export const getUserLocation = async (): Promise<LocationObject> => {
  return Location.getCurrentPositionAsync();
};

export const getUserCoordinates = async (): Promise<Coordinates> => {
  return getUserLocation().then(loc => ({
    longitude: loc.coords.longitude,
    latitude: loc.coords.latitude,
  }));
};

export const getUserRegion = async (distance = 500): Promise<UserRegion> => {
  return getUserCoordinates().then(pos => regionFrom(pos.latitude, pos.longitude, distance));
};
