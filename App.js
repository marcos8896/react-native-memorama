import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Row from './components/Row';

export default class App extends Component {

  state = {
    rows: 2,
    columns: 4,
    gridArray: [],
    previousPressed: null,
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
            
        if(index === pressed.arrayRowIndex) {
          return arrayRow.map( (cell, cellIndex) => {
          
            if(pressed.cellIndex === cellIndex) {
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

    if(this.state.previousPressed === null) {
      //If there is not previous pressed, set it and show the 
      //selected card.
      this.setState((prevState) => {
        return { 
          previousPressed: pressed,
          gridArray: this.changePressElementState(
            prevState.gridArray, 
            pressed, 
            { property: 'shown', value: true }
          ),
        }
      }, () => console.log("No había prev", this.state));

    } else if(this.state.previousPressed.element.value === pressed.element.value) {
      //If there is a previous pressed and the next pressed have the same value
      //Then, show both cards.
      this.setState((prevState) => {
        return { 
          previousPressed: null,
          gridArray: this.changePressElementState(
            prevState.gridArray, 
            pressed,
            { property: 'shown', value: true }
          ),
        }
      }, () => console.log("le atino", this.state));
    } else if(this.state.previousPressed.element.value !== pressed.element.value) {
      //If there is a previous pressed and the next pressed have not the same value
      //Then, hide both.
      this.setState((prevState) => {
        return { 
          previousPressed: null,
          gridArray: this.changePressElementState(
            prevState.gridArray, 
            prevState.previousPressed, 
            { property: 'shown', value: false }
          ),
        }
      }, () => console.log("no le atino", this.state));
    }   
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

  renderGrid = () => {
    return this.state.gridArray.map( (rowArray, index) => {
      return <Row checkCouple={this.checkCouple} rowArray={rowArray} key={index} index={index} />;
    })
  }

  render() {
    
    return (
      <View style={styles.container}>
        
        {this.renderGrid()}

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
