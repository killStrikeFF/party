import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {io} from "socket.io-client";
import * as Location from "expo-location";
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import './UserAgent'
import {Map} from "./pages/Map";
import {Rooms} from "./pages/Rooms";
import {NavBar} from "./components/NavBar";

export default function App() {
    const Tab = createBottomTabNavigator();
    const socket = io("ws://192.168.1.101:3000", {
        autoConnect: false,
    })
    const [isPermissionsGranted, setIsPermissionsGranted] = useState(false);

    useEffect(() => {
        getPermissions().then(res => {
            setIsPermissionsGranted(res);
        })
    }, [])

    const getPermissions = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync()
        return status === 'granted';
    }


    return (
        <View style={styles.container}>
            <NavigationContainer>
                <Tab.Navigator tabBar={props => <NavBar navigation={props.navigation}/>}>
                    <Tab.Screen name="Map">
                        { props => <Map navigation={props.navigation} socket={socket}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Rooms">
                        { props => <Rooms navigation={props.navigation} socket={socket}/>}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
            <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
