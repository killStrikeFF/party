import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {NavBar} from "../components/NavBar";
import axios from "axios";

export function Rooms({socket}) {

    const [allRooms, setAllRooms] = useState([])

    useEffect(() => {
        const getRooms = () => {
            axios.get('http://192.168.0.138:3000/party/all').then(res => {
                setAllRooms(res.data.parties)
            })
        }
        getRooms()
    }, [])

    // const createRoom = () => {
    //     axios.post('http://192.168.0.138:3000/party', {name: "ROOM NAME"}).then(res => {
    //         console.log(res.data);
    //
    //         setRoomId(res.data.uuid)
    //     })
    // }
    //
    // const joinRoom = () => {
    //     axios.post('http://192.168.0.138:3000/party/join', {socketId: socket.id, roomUuid: roomId}).then(res => {
    //         console.log(res.data);
    //     })
    // }
    //
    // const leaveRoom = () => {
    //     axios.post('http://192.168.0.138:3000/party/leave', {socketId: socket.id}).then(res => {
    //         console.log(res.data);
    //     })
    // }


    return (
        <View>
            <View style={styles.roomsList} >
                {allRooms.map(room => {})}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    roomsList : {}
});