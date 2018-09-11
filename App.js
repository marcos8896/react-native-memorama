import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Row from './components/Row';

export default class App extends Component {

  state = {
    rows: 2,
    columns: 4,
    gridArray: [],
    auxElement: null,
  }

  componentDidMount() {
    this.generateGridArray();
  }

  showPressElement = ( pressed ) => {
    
    const gridArray = [ ...this.state.gridArray ];
    const pressedElementArrayRow = [ ...gridArray[pressed.arrayRowIndex] ];
    console.log('pressedElementArrayRow: ', pressedElementArrayRow);
    const pressedElement = { ...pressedElementArrayRow[pressed.cellIndex] };
    
    const updatedElement = { ...pressedElement, shown: true };
    console.log('updatedElement: ', updatedElement);
    const pressedElementUpdatedArrayRow = 
    pressedElementArrayRow.slice(0, pressed.cellIndex)
    .concat([updatedElement])
    .concat(pressedElementArrayRow.slice(pressed.cellIndex + 1))
    /*[
      ...pressedElementArrayRow.slice(0, pressed.cellIndex),
      updatedElement,
      ...pressedElementArrayRow.slice(pressed.cellIndex + 1),
    ]
    */
   const updatedGridArray = 
   gridArray.slice(0, pressed.arrayRowIndex)
   .concat([pressedElementUpdatedArrayRow])
   .concat(gridArray.slice(pressed.cellIndex + 1))
   /*[
     ...gridArray.slice(0, pressed.arrayRowIndex),
     pressedElementUpdatedArrayRow,
     ...gridArray.slice(pressed.cellIndex + 1),
    ]*/
    console.log('gridArray: ', gridArray);
    console.log('updatedGridArray', updatedGridArray)
    return updatedGridArray;

  }

  changePressElementState = ( prevStateGridArray, pressed, propertyToChange ) => {

    return prevStateGridArray.map( (arrayRow, index) => {
            
      if(pressed.arrayRowIndex === index) {
        return arrayRow.map( (cell, cellIndex) => {
          
          if(pressed.cellIndex === cellIndex) {
            console.log("cell", cell)
            return {...cell, [propertyToChange.property]: propertyToChange.value }
          } else {
            return cell;
          }

        })
      } else {
        return arrayRow;
      }

    })

  }

  checkCouple = ( pressed ) => {
    
    console.log("Ah perro", pressed);
    //if(this.state.auxElement === null) {
      this.setState((prevState) => {

        return { 
          auxElement: pressed.element,
          gridArray: this.changePressElementState(
            prevState.gridArray, 
            pressed, 
            { property: 'shown', value: true }
          ),
        }
      });
    //} else {
     // console.log("en el else", this.state.auxElement)
    //}
  }

  generateEmptyBaseArray = () => {
    return [...Array(parseInt(this.state.rows * this.state.columns / 2)).keys()];
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
    
    for (let i = 0; i < this.state.rows; i++) {
      const auxArray = [ 
        ...baseArray.slice(i * this.state.columns, (i * this.state.columns) + this.state.columns) 
      ];

      const completeAuxArray = auxArray.map(el => {
        return {
          value: el,
          shown: false,
          found: false,
        }
      })

      gridAuxArray.push(this.shuffle(completeAuxArray));
    }

    const gridMixArray = this.shuffle(gridAuxArray);
    console.log('gridMixArray: ', gridMixArray);

    this.setState({ gridArray: gridMixArray, });
    
  }

  render() {
    
    return (
      <View style={styles.container}>
        
        {this.state.gridArray.map( (rowArray, index) => {
        return <Row checkCouple={this.checkCouple} rowArray={rowArray} key={index} index={index} />;
        })}


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
