import React from 'react';
import { Image, StyleSheet, View } from 'react-native';


export default class ImageCard extends React.Component {
    render() {
        let { source } = this.props

        source = require('../images/shieldCard.png')

        return (
            <Image
                style={styles.card}
                source={source}
            />
        )
    }
}

const styles = StyleSheet.create({
    card: {
        width: 50,
        height: 50,
        borderWidth:1,
        borderColor: '#a3e4d7',
    },
});