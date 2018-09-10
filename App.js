import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Row from './components/Row';

export default class App extends Component {

  state = {
    columns: 3,
    rows: 2,
    gridArray: [],
  }

  generateEmptyBaseArray = () => {
    return [...Array(parseInt(this.state.columns * this.state.rows / 2)).keys()];
  }

  shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  generateGridArray = () => {
    
    const baseArray = [...this.generateEmptyBaseArray(), ...this.generateEmptyBaseArray()];
    const gridAuxArray = [];
    
    for (let i = 0; i < this.state.columns; i++) {
      const auxArray = [ 
        ...baseArray.slice(i * this.state.rows, (i * this.state.rows) + this.state.rows) 
      ];

      const completeAuxArray = auxArray.map(el => {
        return {
          value: el,
          found: false,
        }
      })

      gridAuxArray.push(this.shuffle(completeAuxArray));
    }

    const gridMixArray = this.shuffle(gridAuxArray);
    console.log('gridMixArray: ', gridMixArray);
    
  }

  render() {

    this.generateGridArray();
    return (
      <View style={styles.container}>
        
        <Row numberCells={3} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
