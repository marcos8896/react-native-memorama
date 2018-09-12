import React, {Component} from 'react';
import { Dimensions, StyleSheet, Button, View, Text } from 'react-native';

import Row from './components/Row';

const { width, height } = Dimensions.get('window');


export default class App extends Component {

  state = {
    rows: 4,
    columns: 4,
    gridArray: [],
    previousPressed: null,
  }

  componentDidMount() {
    this.generateGridArray();
  }

  componentDidUpdate(prevProps, prevState) {

    if(prevState.columns !== this.state.columns || prevState.rows !== this.state.rows)
      this.generateGridArray();

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
    const cont = parseInt(this.state.rows * this.state.columns / 2);
    
    const auxArray = [];

    for (let i = 0; i < cont; i++)
      auxArray.push(i);

    return auxArray;
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
    
    console.log('gridAuxArray: ', gridAuxArray);
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
      <View style={styles.outerContainer}>
        
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              if(this.state.columns <= 8) 
                this.setState((prevState) => {
                  return {
                    columns: prevState.columns + 2,
                  }
                })
            }}
            title="Más columnas"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
          <Text>{this.state.columns}</Text>
          <Button
            onPress={() => {
              if(this.state.columns >= 4) 
                this.setState((prevState) => {
                  return {
                    columns: prevState.columns - 2,
                  }
                })
            }}
            title="Menos columnas"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              if(this.state.rows <= 8) 
                this.setState((prevState) => {
                  return {
                    rows: prevState.rows + 2,
                  }
                })
            }}
            title="Más filas"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
          <Text>{this.state.rows}</Text>
          <Button
            onPress={() => {
              if(this.state.rows >= 4) 
                this.setState((prevState) => {
                  return {
                    rows: prevState.rows - 2,
                  }
                })
            }}
            title="Menos filas"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        
        <View style={styles.container}>
          {this.renderGrid()}
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F5FCFF',
    height: 20,
  },
  outerContainer: {
    flex: 1,
    width: width,
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  }
});
