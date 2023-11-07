import { UserMap } from '../types/user-map';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Icon } from '@rneui/themed';
import React from 'react';
import { ProfilePicture } from './ProfilePicture';

interface MapMarkerProps {
  user: UserMap;
  size?: number;
}

export function MapMarker({
                            user,
                            size = 65,
                          }: MapMarkerProps) {
  const styles = StyleSheet.create({
    markerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    markerImage: {
      width: size * 0.5,
      height: size * 0.5,
      borderRadius: size * 0.25,

      position: 'absolute',
      top: size * 0.37,
      left: size * 0.25,
      transform: [{ translateY: -(size * 0.25) }],

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.markerContainer}>
      <Icon
        name="location-on"
        color="#22bfd4"
        size={size}
      />

      <View style={styles.markerImage}>
        <ProfilePicture
          size={size * 0.0006}
          text={user?.name}
          image={user?.image}
        ></ProfilePicture>
      </View>
    </View>
  );
}
