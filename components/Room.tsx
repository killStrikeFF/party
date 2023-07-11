import React from "react";
import {View} from "react-native";


export function Room({name, count, address}) {
    return (
        <View>
            <Text>{name}</Text>
            <Text>{count}</Text>
            <Text>{address}</Text>
        </View>
    )
}