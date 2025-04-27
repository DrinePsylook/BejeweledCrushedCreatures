import React from 'react';
import { connect } from "react-redux";
import * as Progress from 'react-native-progress';
import { Dimensions, Modal } from 'react-native';

import { StyleSheet, Text, View, ImageBackground, Button, Image, TouchableOpacity } from "react-native";
import Header from '../components/Header';
import ButtonGame from '../components/ButtonGame';
import DisplayHiddenGrid from '../components/DisplayHiddenGrid';
import { ShieldCard } from '../components/ShieldCard';
import GameGrid from '../components/GameGrid';
import { runHint } from '../actions/gridActions';


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.currentPlayers.name,
            firstname: this.props.currentPlayers.firstname,
            email: this.props.currentPlayers.email,
            id: this.props.currentPlayers.idPlayers,
            isVisible: false,
            running: true,
            lvlChanged: false,
            scoreChanged: false,
            card: '',
            buttonPause: null,
            buttonModal: null,
            shieldCard: null,
            progress: 0.5,
            scores: 0,
            essai: 5,
            niveau: 1,
            scoreSequence: 0
        }

        this.interval = null;
        this.setScore = this.setScore.bind(this);
        this.setTries = this.setTries.bind(this);
        this.setLvl = this.setLvl.bind(this);
        //this.runHint = this.runHint.bind(this);

    }


    componentDidMount() {
        this.begin();
        this.changeProgressBar();
    }



    begin() {
        this.setState({
            isVisible: false,
            buttonPause: <ButtonGame green id="Pause" onPress={() => this.pause()} />
        })

        //console.log("running begin : " + this.state.running);
    }


    pause() {
        this.setState({
            buttonPause: null,
            isVisible: true,
            running: false,
            buttonModal: <ButtonGame green id="Resume" onPress={() => this.resume()} />,
            shieldCard: <DisplayHiddenGrid />
        });
        clearInterval(this.interval);
        //console.log("scoreSequence dans Game : " + this.state.scoreSequence);  
    }

    resume() {
        this.setState({
            isVisible: false,
            running: true,
            buttonPause: <ButtonGame green id="Pause" onPress={() => this.pause()} />
        })
        this.changeProgressBar();
    }

    moveHighScore() {
        this.props.navigation.navigate('HighScorePage');
        // this.setState({scores : 0, niveau : 1, essai : 5, progress : 0.5});
        // this.changeProgressBar();
    }

    //fonction de rappel, arguments passés au component GameGrid vie la méthode setInfo
    setScore(newScore) {
        //console.log("score game : " + newScore)
        this.setState({ scores: newScore, scoreChanged: true });
    }

    setTries(tries) {
        this.setState({ essai: tries });
        if (tries <= 0) {
            this.setState({ essai: 0 });
            this.gameOver();
        }
    }

    gameOver() {
        this.setState({
            buttonPause: null,
            isVisible: true,
            running: false,
            buttonModal: <ButtonGame green id="High Score" onPress={() => this.moveHighScore()} />,
            shieldCard: <ShieldCard />
        });
        clearInterval(this.interval);
        this.saveScore();
        this.insertScore();
    }

    setLvl(newLvl) {
        this.setState({ niveau: newLvl, lvlChanged: true });
    }


    changeProgressBar() {
        this.interval = setInterval(this.calculateProgress.bind(this), 1000);
    }

    saveScore() {
        const formData = new FormData();
        formData.append("score", this.state.scores);
        formData.append("player", this.state.id);

        fetch('http://jdevalik.fr/api/drine/insertScore.php', {
            method: 'POST',
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }).then((response) => response.json())
            .then((json) => {
                if (json == false) {
                    Alert.alert(
                        'Erreur',
                        'Le score n\'a pa pu être enregistré.',
                        [
                            { text: 'OK', onPress: () => console.log('score enregistré') },
                        ],
                        { cancelable: false },
                    );
                }
            });

    }

    insertScore() {
        const formData = new FormData();
        formData.append("score", 1);
        fetch('http://jdevalik.fr/api/drine/getBestScoreBej.php', {
            method: 'POST', //Request Type
            body: formData, //post data
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }).then((response) => response.json())
            .then((json) => {
                const action = { type: "SET_HIGH_SCORES", value: json }
                this.props.dispatch(action)
                //console.log("high Score : " + this.props)

            })
            .catch((error) => {
                console.error(error);
            }
            );
    }

    //calcul de la barre de progression selon les conditions
    calculateProgress() {
        const { progress, niveau, lvlChanged, scoreChanged, scores } = this.state;
        let maxProgress = niveau * 100;
        let newProgress = progress;
        let progressBar = progress * 100;
        let pourcentScore = scores * 100 / maxProgress;

        //si le lvl change, lancement de animatedBar (passe à 100% puis redescend au pourcentage de la barre)
        //sinon décrémentation si le score change
        if (lvlChanged) {
            progressBar = maxProgress;
            this.animatedBar(pourcentScore);
            this.setState({ lvlChanged: false });
        } else if (scoreChanged == true) {
            progressBar = pourcentScore - 1;
            this.setState({ scoreChanged: false })
        }

        //décrémentation de la barre (cf setinterval dans méthode changeProgressBar())
        if (progress > 0) {
            newProgress = progressBar - 1;
        }

        //si arrive à zéro, modal GameOver
        if (progress <= 0) {
            this.gameOver();
        }
        //console.log("progressBar : " + progressBar)
        this.setState({ progress: newProgress / 100 })
    }

    //décrémentation de la barre de progression
    animatedBar() {
        const { progress, scores, niveau } = this.state;
        //Je calcule le max de la barre de progression
        let maxProgress = niveau * 100;
        //Je définis le pourcentage d'augmentation de la barre en fonction du score
        let pourcentScore = scores * 100 / maxProgress;
        //latence pour l'augmentation de lvl : passe à 100% puis baisse
        setTimeout(() => {
            let progressBar = pourcentScore - 1;
            (this.setState({ progress: progressBar / 100 }))
        }, 1);
    }


    render() {
        // console.log("nom Game : "+this.state.name)
        // console.log("id Game : "+this.state.id)

        return (
            <View style={styles.container}>
                <ImageBackground source={require('../images/flyingIsland.png')} resizeMode="cover" style={styles.imgBackGr}>

                    <View style={styles.lineNiveau}>
                        <Text style={styles.niveau}>Niveau : {this.state.niveau} </Text>
                    </View>

                    <View style={styles.lineInfo}>
                        <Text style={styles.infoCard}>Tries Left : {this.state.essai}</Text>
                        <Text style={styles.infoCard}>Score : {this.state.scores}</Text>
                    </View>

                    <View style={styles.lineInfo}>
                        {this.state.buttonPause}
                    </View>

                    <View style={styles.cardContainer}>
                        {/* setScore devient un prop de GameGrid et je l'envoie dans la méthode this.setScore */}
                        {<GameGrid setScore={this.setScore} setTries={this.setTries} setLvl={this.setLvl} />}
                    </View>

                    <View style={styles.lineProgress}>
                        <Progress.Bar color={'#33c479'} progress={this.state.progress} width={300} height={25} borderRadius={20} borderWidth={1} borderColor={'#33c479'} style={styles.progress} />
                    </View>

                    <Modal
                        visible={this.state.isVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => this.setState({ isVisible: false })}
                    >

                        <View style={styles.modalContainer}>
                            <View style={styles.lineButton}>
                                {this.state.buttonModal}

                            </View>
                            <View style={styles.hiddenContainer}>
                                {this.state.shieldCard}
                            </View>

                        </View>
                    </Modal>

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
    },
    imgBackGr: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        width: screenWidth
    },
    lineCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
    },
    lineNiveau: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    lineInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoCard: {
        backgroundColor: 'rgba(252,243,207,0.8)',
        width: 120,
        height: 50,
        borderWidth: 3,
        borderRadius: 5,
        borderColor: '#145a32',
        fontWeight: 'bold',
        padding: 2,
        margin: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    cardContainer: {
        flexDirection: 'row',
        margin: 10,
        width: screenWidth,
        borderWidth: 3,
        borderColor: '#0f7a43',
    },
    progress: {
        backgroundColor: 'rgba(252,243,207,0.7)',
        marginLeft: 5,
    },
    niveau: {
        marginTop: 30,
        color: '#145a32',
        fontWeight: 'bold',
        fontSize: 18,
        backgroundColor: 'rgb(252,243,207)',
        width: 200,
        height: 60,
        textAlignVertical: 'center',
        textAlign: 'center',
        borderRadius: 30,
        borderWidth: 5,
        borderColor: '#33c479',
    },
    lineProgress: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        marginRight: 60,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba( 171, 235, 198 , 0.6)',
    },
    lineButton: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5,
    },
    hiddenContainer: {
        flex: 0.78,
        marginLeft: -10,
        marginBottom: 90,
    }
});

const mapStateToProps = (state) => {
    return {
        players: state.PlayerReducer.players,
        currentPlayers: state.PlayerReducer.currentPlayers,
    }
}
export default connect(mapStateToProps)(Game)