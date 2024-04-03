import React, { memo } from 'react';
import { Text } from 'react-native';

import { StyleSheet } from 'react-native';


const Header = ({ children }) => <Text style={styles.header}>{children}</Text>;

const styles = StyleSheet.create({
    header: {
        fontSize: 26,
        color: '#0f7a43',
        fontWeight: 'bold',
        paddingVertical: 14,
        textShadowColor: 'white',
        textShadowOffset:{width: 1, height: 1},
        textShadowRadius:10,
    },
});

export default memo(Header);