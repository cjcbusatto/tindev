import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import logo from '../assets/logo.png';
import dislike from '../assets/dislike.png';
import like from '../assets/like.png';
import matchImage from '../assets/itsamatch.png';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        marginTop: 20,
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 20,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    avatar: {
        flex: 1,
        height: 300,
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bio: {
        fontSize: 14,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 20,
    },
    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain',
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    closeMatch: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 20,
        fontWeight: 'bold',
    },
});

export default function Main({ navigation }) {
    const user = navigation.getParam('user');
    const [developers, setDevelopers] = useState([]);
    const [matchBetweenDevelopers, setMatchBetweenDevelopers] = useState(null);

    async function handleLike() {
        const [likedDeveloper, ...others] = developers;

        await api.post(`/developers/${likedDeveloper._id}/likes`, null, {
            headers: {
                user,
            },
        });

        setDevelopers(others);
    }
    async function handleDislike(id) {
        const [dislikedDeveloper, ...others] = developers;
        await api.post(`/developers/${dislikedDeveloper._id}/dislikes`, null, {
            headers: {
                user,
            },
        });
        setDevelopers(others);
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    useEffect(() => {
        (async function loadUsers() {
            const response = await api.get('/developers', {
                headers: { user },
            });
            setDevelopers(response.data);
        })();
    }, [user]);

    // Match event
    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: id },
        });

        socket.on('match', (developer) => {
            setMatchBetweenDevelopers(developer);
        });
    }, [id]);
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                {developers.length === 0 ? (
                    <Text style={styles.empty}>No more developers around</Text>
                ) : (
                    developers.map((developer, index) => (
                        <View
                            key={developer._id}
                            style={[
                                styles.card,
                                { zIndex: developers.length - index },
                            ]}
                        >
                            <Image
                                style={styles.avatar}
                                source={{ uri: developer.avatar }}
                            />

                            <View style={styles.footer}>
                                <Text style={styles.name}>
                                    {developer.name}
                                </Text>
                                <Text numberOfLines={3} style={styles.bio}>
                                    {developer.bio}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
            {developers.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleDislike}
                    >
                        <Image source={dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLike}
                    >
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            )}
            {matchBetweenDevelopers && (
                <View style={styles.matchContainer}>
                    <Image source={matchImage} />
                    <Image
                        style={styles.matchAvatar}
                        source={{ uri: matchBetweenDevelopers.avatar }}
                    />
                    <Text style={styles.matchName}>
                        {matchBetweenDevelopers.name}
                    </Text>

                    <Text style={styles.matchBio}>
                        {matchBetweenDevelopers.bio}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}
