import React from 'react';
import { connect } from "react-redux";
import { Dimensions } from 'react-native';
import { View, StyleSheet, Text, Button, ImageBackground } from 'react-native';
import Header from '../components/Header';
import ButtonGame from '../components/ButtonGame';;

class HighScore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.scoreList.name,
            firstname: this.props.scoreList.firstname,
            score: this.props.scoreList.meilleurScore,
        };
    }

    newGame() {
        this.props.navigation.navigate('HomePage');
    }


    render() {
        const { scoreList } = this.props;
        // console.log("score liste : "+ scoreList)
        // console.log("name : " + scoreList[1].name);
        // console.log("firstname : " + scoreList[1].firstname);
        // console.log("score : " + scoreList[1].meilleurScore);

        

        return (
            <View style={styles.container}>
                <ImageBackground source={require('../images/imgHighScore.jpg')} resizeMode="cover" style={styles.imgBackGr}>
                    <View style={styles.headBG}>
                        <Header>Meilleurs scores</Header>
                    </View> 
                    <View style={styles.tabHead}>
                            <Text style={styles.headerTab}>Nom</Text>
                            <Text style={styles.headerTab}>Prénom</Text>
                            <Text style={styles.headerTab}>Score</Text>
                        </View>
                    {scoreList.map((scoreItem, index) => (
                        <View key={index} style={styles.scoreTab}>
                            {/* {console.log("nom : " + scoreItem.name)}
                            {console.log("prénom : " + scoreItem.firstname)}
                            {console.log("score : " + scoreItem.meilleurScore)} */}
                            <Text style={styles.colScore}>{scoreItem.name}</Text>
                            <Text style={styles.colScore}>{scoreItem.firstname}</Text>
                            <Text style={styles.colScore}>{scoreItem.meilleurScore}</Text>
                        </View>
                        ))}

                    <ButtonGame green id="New Game" onPress={() => this.newGame()} />

                </ImageBackground>
            </View>
        )
    }
}

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        direction: 'row'
    },
    imgBackGr: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        width: screenWidth,
    },
    headBG: {
        backgroundColor: 'white',
        opacity: 0.7,
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 50,
    },
    tabHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderBottomWidth: 1,
        paddingVertical: 10,
        backgroundColor: 'white',
        opacity: 0.7,
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerTab: {
        flex: 1,
        textAlign: 'center',
        color: '#0f7a43',
        fontWeight: 'bold',
    },
    scoreTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingVertical: 10,
        backgroundColor: 'white',
        opacity: 0.7,
        paddingLeft: 10,
        paddingRight: 10,
      },
      colScore: {
        flex: 1,
        textAlign: 'center',
      },
});

const mapStateToProps = (state) => {
    return {
        players: state.PlayerReducer.players,
        currentPlayers: state.PlayerReducer.currentPlayers,
        scoreList: state.ScoreReducer.scoreList
    }
}
export default connect(mapStateToProps)(HighScore)