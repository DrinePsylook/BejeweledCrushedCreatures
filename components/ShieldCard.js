import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import gameOverImage from '../images/gameOver.png';

export class ShieldCard extends React.Component {
    render() {

        return (
            <View style={styles.container}>

                <View style={styles.cardContainer}>
                    <Image
                        style={styles.card}
                        source={gameOverImage}
                    />
                </View>

            </View>

        )
    }
}

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'green'
    },
    card: {
        width: "100%",
        borderWidth: 2,
        borderColor: '#a3e4d7',
    },
    cardContainer: {
        margin: 10,
        marginTop: 20,
        width: screenWidth,
        borderWidth: 3,
        borderColor: '#0f7a43',
    },
});