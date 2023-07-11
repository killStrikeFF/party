import React from "react";
import {View} from "react-native";


export function Room({
    name,
    count,
    address
}: any) {
    return (
        <View>
            // @ts-expect-error TS(2693): 'Text' only refers to a type, but is being used as... Remove this comment to see the full error message
            <Text>{name}</Text>
            // @ts-expect-error TS(2693): 'Text' only refers to a type, but is being used as... Remove this comment to see the full error message
            <Text>{count}</Text>
            // @ts-expect-error TS(2693): 'Text' only refers to a type, but is being used as... Remove this comment to see the full error message
            <Text>{address}</Text>
        </View>
    )
}