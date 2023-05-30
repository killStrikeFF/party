import {ActivityIndicator, StyleSheet, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import React, {useEffect, useState} from "react";
import * as Location from "expo-location";
import {regionFrom} from "../utils/calculateRegion";

export function Map({socket}) {
    const [clients, setClients] = useState([]);
    const [initialRegion, setInitialRegion] = useState();
    const [updateTimeout, setUpdateTimeout] = useState();
    const getUserLocation = async () => {
        return Location.getCurrentPositionAsync({})
    }

    const updateUserLocation = () => {
        getUserLocation().then((loc) => {
            const pos = {
                longitude: loc.coords.longitude,
                latitude: loc.coords.latitude,
            }

            socket.emit("updateClientCoordinates", pos);

            if (!initialRegion) {
                const region = regionFrom(pos.latitude, pos.longitude, 500)

                setInitialRegion(region);
            }
        })

        setUpdateTimeout(setTimeout(updateUserLocation, 2500))
    }

    useEffect(() => {
        socket.connect()
        socket.emit('updateName', {name: "Vitaly"})
        socket.on("clientsCoordinates", (array) => setClients(array))
        updateUserLocation();
        return () => {
            clearTimeout(updateTimeout);
            socket.disconnect();
        }
    }, [])
    return (
        <View style={styles.container} >
            {initialRegion ? <MapView style={styles.map} initialRegion={initialRegion}>
                {clients.map(client => (
                    <Marker
                        key={client.id}
                        title={client.name}
                        coordinate={{
                            latitude: client.coordinates.latitude,
                            longitude: client.coordinates.longitude
                        }}
                    />
                ))}
            </MapView> : <ActivityIndicator size={"large"}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    map: {
        flex: 1,
        width: "auto",
        height: "auto",
    },
});
