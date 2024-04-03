import React from 'react';
import { connect } from "react-redux";
import { Dimensions } from 'react-native';
import { View, StyleSheet, Image, TouchableOpacity, Button, Text } from 'react-native';
import { generateGrid, randomCard, isAdjacent, browseGridHz, browseGridVt, isInGridLimit, fallingImgY, fallingImgX, emptyImg, explodeTriplets, clignoteImg, cardTab } from '../actions/gridActions';

class GameGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            imgSelected: [],
            imgSel1: "",
            imgSel2: "",
            imgHint1: "",
            imgHint2: "",
            sourceImg1: null,
            sourceImg2: null,
            scoreSequence: null,
            score: 0,
            tries: 5,
            level: 1,
            hint: 1,
            x1: null,
            x2: null,
            y1: null,
            y2: null
        }

        this.intervalHint = null;
    }

    componentDidMount() {
        this.setState({ grid: generateGrid() }, this.checkBeginning);
        //console.log("grille initiale : " + this.state.grid);    

    }


    imgPressed(x, y) {
        this.selectImg(x, y);
    }


    checkBeginning() {
        const { grid } = this.state;
        //console.log("grille initiale : " + this.state.grid)

        const newGrid = [...grid];
        let newSource = randomCard();

        // J'utilise ma fonction browseGridHz pour parcourir la grille et vérifier les triplets horizontaux
        browseGridHz(grid, function (source, x, y) {
            if (grid[x][y] === grid[x][y + 1] && grid[x][y] === grid[x][y + 2]) {
                newGrid[x][y + 1] = newSource;
                while (newSource === grid[x][y] && newSource === grid[x - 1][y] && newSource === grid[x + 1][y]) {
                    newGrid[x][y + 2] = newSource;
                }
            }
        });

        // J'utilise ma fonction browseGridVt pour parcourir et vérifier les triplets verticaux
        browseGridVt(grid, function (source, x, y) {
            if (grid[x][y] === grid[x + 1][y] && grid[x][y] === grid[x + 2][y]) {
                newGrid[x + 1][y] = newSource;
                while (newSource === grid[x][y] && newSource === grid[x][y - 1] && newSource === grid[x][y + 1]) {
                    newGrid[x][y + 2] = newSource;
                }
            }
        });
        //console.log("grille nouvelle : " + newGrid)
        explodeTriplets(grid);
        this.setState({ grid: newGrid }); // Mettre à jour le state avec la nouvelle grille
    }


    selectImg(x, y) {
        const { imgSelected, imgSel1, imgSel2, grid } = this.state;

        // Si imgSelected contient moins de 2 images, je mets à jour updatedImgSelected sous forme de constante
        if (imgSelected.length < 2) {
            const updatedImgSelected = [...imgSelected, [x, y]];

            if (updatedImgSelected.length === 2 && !isAdjacent(imgSel1, updatedImgSelected[1])) {
                // Si l'image 2 sélectionnée n'est pas adjacente à image 1, imgSel2 est défini sur null
                this.setState({ imgSel2: null });
                //console.log("img non échangeable, essaie encore");
                return;
            }

            //Je récupère l'image 1 et 2 que je mets à jour. Le paramètre prevState me permet de récupérer l'état précédent des images si nécessaire 
            this.setState(function (prevState) {
                return {
                    imgSelected: updatedImgSelected,
                    imgSel1: updatedImgSelected.length === 1 ? updatedImgSelected[0] : prevState.imgSel1,
                    imgSel2: updatedImgSelected.length === 2 ? updatedImgSelected[1] : prevState.imgSel2
                }
            }, function () {
                if (updatedImgSelected.length === 2) { //quand j'ai sélectionné mes deux images, je les échange
                    this.switchImg();
                }
            });
        }
    }

    switchImg() {

        let { imgSel1, imgSel2, grid } = this.state;

        if (!imgSel1 || !imgSel2) {
            //console.log("Switch : Les images sélectionnées ne sont pas valides.");
            return;
        }

        const [x1, y1] = imgSel1;
        const [x2, y2] = imgSel2;

        const sourceImg1 = grid[x1][y1];
        const sourceImg2 = grid[x2][y2];

        const newGrid = [...grid];

        newGrid[x1][y1] = sourceImg2;
        newGrid[x2][y2] = sourceImg1;

        // console.log("switch img1 : " + sourceImg2);
        // console.log("switch img2 : " + sourceImg1);

        this.setState({ grid: newGrid, imgSelected: [] });
        // Après avoir effectué l'échange, je vérifie si les tests sont réussis
        if (this.isSuccess()) {
            // Si c'est un succès, je mets à jour l'état avec la nouvelle grille et je réinitialise les sélections d'images
            this.setState({ imgSel1: null, imgSel2: null });
            //console.log("C'est un succès! " + imgSel1 + " et " + imgSel2);
        } else {
            //console.log("Quel échec ! " + imgSel1 + " et " + imgSel2);
            // Si ce n'est pas un succès, j'appelle la fonction cannotSwitch après un délai
            setTimeout(() => {
                this.cannotSwitch();
            }, 300); // Délai de 3 milisecondes avant de réinitialiser les images

        }

    }

    cannotSwitch() {
        let { imgSel1, imgSel2, grid, tries } = this.state;

        if (!imgSel1 || !imgSel2) {
            console.log("Cannot Switch. Les images sélectionnées ne sont pas valides.");
            return;
        }

        const [x1, y1] = imgSel1;
        const [x2, y2] = imgSel2;

        const sourceImg1 = grid[x1][y1];
        const sourceImg2 = grid[x2][y2];
        const newGrid = [...grid];

        newGrid[x1][y1] = sourceImg2;
        newGrid[x2][y2] = sourceImg1;

        // console.log("not switch img1 : " + sourceImg2);
        // console.log("not switch img2 : " + sourceImg1);
        if (tries >= 0) {
            failure = tries - 1;
        }

        this.setState({ grid: newGrid, imgSelected: [], imgSel1: null, imgSel2: null, tries: failure });

        this.props.setTries(failure);
    }

    isSuccess() {
        const { imgSel1, imgSel2, sequence, grid } = this.state;
        const [x1, y1] = imgSel2;
        const [x2, y2] = imgSel1;
        const sequence1 = this.calculateSequence(grid, x1, y1);
        const sequence2 = this.calculateSequence(grid, x2, y2);

        //console.log("img1 is success :" + imgSel1);
        //console.log("img2 is success :" + imgSel2);

        //console.log("x1-y1 : " + grid[x1][y1])
        //console.log("x2-y2 : " + grid[x2][y2])
        //console.log("taille de grille : "+ grid.length)

        if (sequence1) {
            emptyImg(grid);
            explodeTriplets(grid);

            return true;
        }
        if (sequence2) {
            emptyImg(grid);
            explodeTriplets(grid);
            return true;
        }

    }

    calculateSequence(grid, x, y) {
        let i = 1;
        let j = 1;
        let sequencePos = 0;
        let sequenceNeg = 0;
        let sequenceImg = 1;
        let sequencefinal = null;

        if (isInGridLimit(x, y - 1, grid) && isInGridLimit(x, y + 1, grid) && grid[x][y] === grid[x][y - 1] && grid[x][y] === grid[x][y + 1]) {

            while (isInGridLimit(x, y - j, grid) && grid[x][y] === grid[x][y - j]) {
                grid[x][y - j] = null;
                sequenceNeg++;
                fallingImgY(grid, x, y - j);
                j++;
            }

            while (isInGridLimit(x, y + i, grid) && grid[x][y] === grid[x][y + i]) {
                grid[x][y + i] = null;
                sequencePos++;
                fallingImgY(grid, x, y + i);
                i++;
            }

            grid[x][y] = null;
            fallingImgY(grid, x, y);
            // console.log("sequence négative : " + sequenceNeg)
            // console.log("sequence positive : " + sequencePos)
            sequencefinal = sequencePos + sequenceNeg + sequenceImg;
            // console.log("sequence test : " + sequencefinal)
            this.setState({ sequence: sequencefinal });
            this.calculateSequScore(sequencefinal);

            return true;

        } else if (isInGridLimit(x - 1, y, grid) && isInGridLimit(x + 1, y, grid) && grid[x][y] === grid[x - 1][y] && grid[x][y] === grid[x + 1][y]) {

            while (isInGridLimit(x - j, y, grid) && grid[x][y] === grid[x - j][y]) {
                grid[x - j][y] = null;
                sequenceNeg++;
                j++;
            }
            while (isInGridLimit(x + i, y, grid) && grid[x][y] === grid[x + i][y]) {
                grid[x + i][y] = null;
                sequencePos++;
                i++;
            }
            sequencefinal = sequencePos + sequenceNeg + sequenceImg;
            this.setState({ sequence: sequencefinal });
            grid[x][y] = null;
            fallingImgX(grid, x, y, sequenceNeg, sequencePos);
            this.calculateSequScore(sequencefinal);
            return true;

        } else if (isInGridLimit(x, y + 2, grid) && grid[x][y] === grid[x][y + 1] && grid[x][y] === grid[x][y + 2]) {

            while (isInGridLimit(x, y + i, grid) && grid[x][y] === grid[x][y + i]) {
                grid[x][y + i] = null;
                sequencePos++;
                fallingImgY(grid, x, y + i);
                i++;
            }
            sequencefinal = sequencePos + sequenceImg;
            this.setState({ sequence: sequencefinal });
            grid[x][y] = null;
            fallingImgY(grid, x, y);
            this.calculateSequScore(sequencefinal);
            return true;

        } else if (isInGridLimit(x + 2, y, grid) && grid[x][y] === grid[x + 1][y] && grid[x][y] === grid[x + 2][y]) {

            while (isInGridLimit(x + i, y, grid) && grid[x][y] === grid[x + i][y]) {
                grid[x + i][y] = null;
                sequencePos++;
                i++;
            }
            sequencefinal = sequencePos + sequenceImg;
            this.setState({ sequence: sequencefinal });
            grid[x][y] = null;
            fallingImgX(grid, x, y, sequenceNeg, sequencePos);
            this.calculateSequScore(sequencefinal);
            return true;

        } else if (isInGridLimit(x, y - 2, grid) && grid[x][y] === grid[x][y - 1] && grid[x][y] === grid[x][y - 2]) {

            while (isInGridLimit(x, y - i, grid) && grid[x][y] === grid[x][y - i]) {
                grid[x][y - i] = null;
                sequenceNeg++;
                fallingImgY(grid, x, y - i);
                i++;
            }
            sequencefinal = sequenceNeg + sequenceImg;
            this.setState({ sequence: sequencefinal });
            grid[x][y] = null;
            fallingImgY(grid, x, y);
            this.calculateSequScore(sequencefinal);
            return true;

        } else if (isInGridLimit(x - 2, y, grid) && grid[x][y] === grid[x - 1][y] && grid[x][y] === grid[x - 2][y]) {

            while (isInGridLimit(x - i, y, grid) && grid[x][y] === grid[x - i][y]) {
                grid[x - i][y] = null;
                sequenceNeg++;
                i++;
            }
            sequencefinal = sequenceNeg + sequenceImg;
            this.setState({ sequence: sequencefinal });
            grid[x][y] = null;
            fallingImgX(grid, x, y, sequenceNeg, sequencePos);
            this.calculateSequScore(sequencefinal);
            return true;
        }

    }

    calculateSequScore(sequence) {
        let scoreSequence = null;
        if (sequence === 3) {
            scoreSequence = 50;
        } else if (sequence === 4) {
            scoreSequence = 150;
        } else if (sequence === 5) {
            scoreSequence = 500;
        }
        //this.setScore({ scoreSequence : scoreSequence })
        //console.log("sequence score : " + scoreSequence)
        this.calculateScore(scoreSequence);


    }

    calculateScore(scoreSequence) {
        const { score, level } = this.state;
        //console.log("score dans gamegrid: " + score)
        const updateScore = scoreSequence * level;
        const newScore = score + updateScore;

        this.setState({ score: newScore });
        this.calculateLvl(newScore);
        this.props.setScore(newScore);
        //this.props.setSequence(sequScore);
    }

    calculateLvl(newScore) {
        const { score, level } = this.state;
        let newLvl = level;
        if (newScore >= newLvl * 100) {
            newLvl = Math.floor((newScore / 100) + 1);
            this.setState({ level: newLvl + 1 });
        }

        this.props.setLvl(newLvl);

    }

    //lancement du hint
    runHint() {
        const { hint, tries, grid, imgSel1, imgSel2, imgHint1 } = this.state;
        let essai;
        console.log("cardTab : " + cardTab)
        console.log("le hint est lancé")
        if (hint >= 1) {
            this.canHelp();
            essai = tries - 1;
            this.setState({ hint: 0, tries: essai });
            this.props.setTries(essai);
        }
        console.log("imgSel 1 et 2 hint dans run hint " + imgHint1)
    }

    //test du Hint
    canHelp() {
        const { grid, imgHint1, imgHint2, x1, x2, y1, y2, imgSel1, imgSel2 } = this.state;
        let notTriplets = true;
        let img1 = null;
        let img2 = null;
        let posX1 = null;
        let posX2 = null;
        let posY1 = null;
        let posY2 = null;

        browseGridHz(grid, (source, x, y) => {
            if (!notTriplets) return;
            if (isInGridLimit(x, y + 3, grid) && grid[x][y] === grid[x][y + 2] && grid[x][y] === grid[x][y + 3]
                || isInGridLimit(x + 2, y + 1, grid) && grid[x][y] === grid[x + 1][y + 1] && grid[x][y] === grid[x + 2][y + 1]
                || isInGridLimit(x - 2, y + 1, grid) && grid[x][y] === grid[x - 1][y + 1] && grid[x][y] === grid[x - 2][y + 1]
                || isInGridLimit(x - 1, y + 1, grid) && isInGridLimit(x + 1, y + 1, grid) && grid[x][y] === grid[x - 1][y + 1] && grid[x][y] === grid[x + 1][y + 1]) {
                img1 = grid[x][y];
                img2 = grid[x][y + 1];
                posX1 = [x];
                posY1 = [y];
                posX2 = [x];
                posY2 = [y + 1];
                notTriplets = false;
                //console.log("y + 1 true triplets + x et y : " + x + " " + y + " img1 : " + grid[x][y] + " img2 : " + grid[x][y + 1] + " en " + x + " " + (y + 1))
                // console.log("grid[x]: " + grid[x] + " grid[y]: " + grid[y])
                // console.log("[x]: " + [x])
            } else if (isInGridLimit(x + 3, y, grid) && grid[x][y] === grid[x + 2][y] && grid[x][y] === grid[x + 3][y]
                || isInGridLimit(x + 1, y +2, grid) && grid[x][y] === grid[x + 1][y + 1] && grid[x][y] === grid[x + 1][y +2]
                || isInGridLimit(x + 1, y - 2, grid) && grid[x][y] === grid[x + 1][y - 1] && grid[x][y] === grid[x + 1][y -2]
                || isInGridLimit(x + 1, y - 1, grid) && isInGridLimit(x + 1, y + 1, grid) && grid[x][y] === grid[x + 1][y - 1] && grid[x][y] === grid[x + 1][y + 1]) {
                img1 = grid[x][y];
                img2 = grid[x + 1][y];
                posX1 = [x];
                posY1 = [y];
                posX2 = [x + 1];
                posY2 = [y]
                notTriplets = false;
                // console.log("x + 1 true triplets + x et y : " + x + " " + y + "  img1 : " + grid[x][y] + " img2 : " + grid[x + 1][y] + " en " + (x + 1) + " " + y)
            } else if (isInGridLimit(x, y - 3, grid) && grid[x][y] === grid[x][y - 2] && grid[x][y] === grid[x][y - 3]
                || isInGridLimit(x + 2, y - 1, grid) && grid[x][y] === grid[x + 1][y - 1] && grid[x][y] === grid[x + 2][y - 1]
                || isInGridLimit(x - 2, y - 1, grid) && grid[x][y] === grid[x - 1][y - 1] && grid[x][y] === grid[x - 2][y - 1]
                || isInGridLimit(x - 1, y - 1, grid) && isInGridLimit(x - 1, y + 1, grid) && grid[x][y] === grid[x - 1][y - 1] && grid[x][y] === grid[x - 1][y + 1]) {
                img1 = grid[x][y];
                img2 = grid[x][y - 1];
                posX1 = [x];
                posY1 = [y];
                posX2 = [x];
                posY2 = [y - 1]
                notTriplets = false;
                // console.log("y - 1 true triplets + x et y : " + x + " " + y + "  img1 : " + grid[x][y] + " img2 : " + grid[x][y - 1] + " en " + x + " " + (y - 1))
            } else if (isInGridLimit(x - 3, y, grid) && grid[x][y] === grid[x - 2][y] && grid[x][y] === grid[x - 3][y]
                || isInGridLimit(x - 1, y - 2, grid) && grid[x][y] === grid[x - 1][y - 1] && grid[x][y] === grid[x - 1][y - 2]
                || isInGridLimit(x - 1, y + 2, grid) && grid[x][y] === grid[x - 1][y + 1] && grid[x][y] === grid[x - 1][y + 2]
                || isInGridLimit(x - 1, y - 1, grid) && isInGridLimit(x - 1, y + 1, grid) && grid[x][y] === grid[x - 1][y - 1] && grid[x][y] === grid[x - 1][y + 1]) {
                img1 = grid[x][y];
                img2 = grid[x - 1][y];
                posX1 = [x];
                posY1 = [y];
                posX2 = [x - 1];
                posY2 = [y]
                notTriplets = false;
                // console.log("x - 1 true triplets + x et y : " + x + " " + y + "  img1 : " + grid[x][y] + " img2 : " + grid[x - 1][y] + " en " + (x - 1) + " " + y)
            }
            this.setState({ imgHint1: img1, imgHint2: img2, x1: posX1, y1: posY1, x2: posX2, y2: posY2 });

        })
        if(imgSel1 && imgSel2){
            this.setState({ imgHint1 : null, imgHint2 : null, x1 :null, y1 : null, x2 : null, y2 : null });
        }
    }


    render() {
        const { grid, imgSelected, imgSel1, imgSel2, imgHint1, imgHint2, x1, x2, y1, y2 } = this.state;
        // console.log("rendu imgHint1 : " + imgHint1);
        // console.log("rendu imgHint2 : " + imgHint2);
        // if(imgHint1 && imgHint2){
        //     console.log("grid[x1][y1] : " + grid[x1][y1]);  
        // console.log("grid[x2][y2] : " + grid[x2][y2]);
        // console.log("[x1] et [x2] : " + [x1] + " " + [x2]);
        // }
        

        return (
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    {grid.map((line, x) => (
                        <View key={x} style={styles.line}>
                            {line.map((imageSource, y) => {
                                let isSelected = false;
                                if (imgSel1 && imgSel1[0] === x && imgSel1[1] === y) {
                                    isSelected = true;
                                    // console.log("imgSel 1 selected")
                                }
                                if (imgSel2 && imgSel2[0] === x && imgSel2[1] === y) {
                                    isSelected = true;
                                    // console.log("imgSel 2 selected")
                                }
                                if (imgHint1 && imgHint1 === grid[x1][y1] && x1 == x &&  y1 == y) {
                                    isSelected = true;
                                    // console.log("imgHint1 selected");
                                }
                               
                                if (imgHint2 && imgHint2 === grid[x2][y2] && x2 == x &&  y2 == y) {
                                    isSelected = true;
                                    // console.log("imgHint2 selected");
                                }
                                const imgStyle = isSelected ? styles.touched : styles.image;
                                return (
                                    <TouchableOpacity key={y} style={styles.image} onPress={() => this.imgPressed(x, y)}>
                                        <Image source={imageSource} style={imgStyle} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
                <View style={styles.lineHint}>
                    <TouchableOpacity onPress={() => this.runHint()}>
                        <Image style={styles.help} source={require('../images/help.png')} />
                        <View style={styles.numHelp}>
                            <Text style={styles.textHint}>{this.state.hint}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

const imageMargin = 5;
const imageSize = ((Dimensions.get('screen').width - 5 * imageMargin) / 8);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    line: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        flexDirection: 'column',
        margin: 1,
        width: 50,
        height: 50,
        resizeMode: 'contain',
        backgroundColor: 'rgba(189, 240, 214, 0.4)',
        width: imageSize,
        height: imageSize,
        borderRadius: 5,
    },
    touched: {
        flex: 1,
        flexDirection: 'column',
        margin: 1,
        width: 50,
        height: 50,
        resizeMode: 'contain',
        backgroundColor: 'rgba(251, 255, 0, 0.4)',
        width: imageSize,
        height: imageSize,
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 3,
    },
    lineHint: {
        flex: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'start-end',
        alignItems: 'right',
    },
    help: {
        width: 55,
        height: 55,
        backgroundColor: 'rgb(252,243,207)',
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#33c479',
        marginTop: 10,
        marginRight: 10,
        resizeMode: 'cover',
    },
    numHelp: {
        position: 'absolute',
        width: 30,
        height: 30,
        flexDirection: 'center',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255, 0.9)',
        padding: 5,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#33c479',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHint: {
        color: '#33c479',
        fontWeight: 'bold',
        fontSize: 12,
    },

});


const mapStateToProps = (state) => {
    return {
        players: state.PlayerReducer.players,
        currentPlayer: state.PlayerReducer.currentPlayers,
    };
};
export default connect(mapStateToProps)(GameGrid);