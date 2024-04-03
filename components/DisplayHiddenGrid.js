import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dimensions } from 'react-native';
import ImageHiddenCard from './ImageHiddenCard';

class DisplayHiddenGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridH: null,
      gridHeight: 8,
      gridWidth: 8,
    };
  }


  affichGrilleCachee() {
    let gridH = []
    for (let y = 0; y < this.state.gridHeight; y++) {
      let line = []
      for (let x = 0; x < this.state.gridWidth; x++) {
        line.push(<View style={styles.line}><ImageHiddenCard /></View>)
      }
      gridH.push(<View style={styles.colonne}>{line}</View>);
    }
    return gridH;
  }



  render() {
    return (


      <View style={styles.container}>

        <View style={styles.cardContainer}>
          {this.affichGrilleCachee()}
        </View>

      </View>

    );
  }
}

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'green'
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  colonne: {
    flex: 1,
    flexDirection: 'column',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 18,
    marginBottom: 23,
    width: screenWidth,
    resizeMode: 'contain',
    borderWidth: 3,
    borderColor: '#0f7a43',
},

});

export default DisplayHiddenGrid;