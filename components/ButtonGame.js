import React from "react";
import { StyleSheet, Text, TouchableOpacity, } from 'react-native';

export default class ButtonGame extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        const { id } = this.props
        let {appareance} = this.props
        let {green}=this.props
        
        green?appareance=style1:appareance=style2
        return (
            <TouchableOpacity style={appareance.button} onPress={this.props.onPress}>
                <Text style={appareance.textButton}>{id}</Text>
            </TouchableOpacity>
        )
    }
}

const style1 = StyleSheet.create({
    button: {
        justifyContent: 'center',
        backgroundColor: '#33c479',
        borderRadius: 5,
        width: 200,
        height: 40,
        margin: 5,
    },
    textButton: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

const style2 = StyleSheet.create({

    button: {
        justifyContent: 'center',
        backgroundColor: '#bdf0d6',
        borderRadius: 5,
        width: 200,
        height: 40,
        margin: 10,
    },
    textButton: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
});