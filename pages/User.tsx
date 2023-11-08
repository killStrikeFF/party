import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, ROUTES,} from '../types/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, View,} from 'react-native';
import React, {useEffect} from 'react';
import {ProfilePicture} from '../components/ProfilePicture';
import {Button, Icon, Text,} from '@rneui/themed';

interface UserProps {
    route: RouteProp<RootStackParamList, ROUTES.USER>;
    navigation: NativeStackNavigationProp<RootStackParamList, ROUTES.USER>;
}

export function User({
                         route,
                         navigation,
                     }: UserProps) {
    const userData = route.params.user;

    const showUserOnMap = (): void => {
        navigation.navigate(ROUTES.MAP, {mapCenter: userData.coords});
    };

    const whisperToUser = (): void => {
        navigation.navigate(ROUTES.MAP, {whisperUserName: userData.name});
    };

    useEffect((): void => {
        navigation.setOptions({title: userData.name});
    }, []);

    return (
        <View style={styles.userContainer}>
            <View style={styles.userImageContainer}>
                <ProfilePicture
                    size={0.3}
                    image={userData.image}
                    text={userData.name}
                    borderColor={userData.color}
                ></ProfilePicture>
            </View>

            <View style={styles.userNameContainer}>
                <Text style={{fontSize: 25}}>{userData.name}</Text>
            </View>

            <View style={styles.userActionContainer}>
                <Button
                    radius={'sm'}
                    type="outline"
                    buttonStyle={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                    }}
                    onPress={showUserOnMap}
                >
                    <Icon
                        name="near-me"
                        color="black"
                    />
                </Button>

                <Button
                    radius={'sm'}
                    type="outline"
                    buttonStyle={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                    }}
                >
                    <Icon
                        name="explore"
                        color="black"
                    />
                </Button>

                <Button
                    radius={'sm'}
                    type="outline"
                    buttonStyle={{
                        backgroundColor: 'white',
                        borderColor: 'black',
                    }}
                    onPress={whisperToUser}
                >
                    <Icon
                        name="mail"
                        color="black"
                    />
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        flex: 1,
        rowGap: 10,
        padding: 30,
    },

    userImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    userNameContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
    },

    userActionContainer: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
});
