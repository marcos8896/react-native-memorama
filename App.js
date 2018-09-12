import React, {Component} from 'react';
import { Dimensions, StyleSheet, Button, View, Text } from 'react-native';

import Row from './components/Row';

export default class App extends Component {

  state = {
    rows: 4,
    columns: 4,
    gridArray: [],
    previousPressed: null,
    waitingForHideIncorrectCards: false,
    points: 0,
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

  setFirstSelection = ( pressed ) => {
    this.setState((prevState) => {
      return { 
        previousPressed: pressed,
        gridArray: this.changePressElementState(
          prevState.gridArray, 
          pressed, 
          { property: 'shown', value: true }
        ),
      }
    });
  }

  showBothCards = ( pressed ) => {
    this.setState((prevState) => {
      return {
        points: prevState.points + 1, 
        previousPressed: null,
        gridArray: this.changePressElementState(
          prevState.gridArray, 
          pressed,
          { property: 'shown', value: true }
        ),
      }
    });
  }

  resetSelectedCards = ( pressed ) => {
    this.setState((prevState) => {
      return {
        waitingForHideIncorrectCards: true, 
        gridArray: this.changePressElementState(
          prevState.gridArray, 
          pressed, 
          { property: 'shown', value: true }
        ),
      }
    }, () => {

      setTimeout( () => {
        this.setState((prevState) => {
          return { 
            previousPressed: null,
            gridArray: this.changePressElementState(
              prevState.gridArray, 
              prevState.previousPressed, 
              { property: 'shown', value: false }
            ),
          }
        }, () => {
          this.setState((prevState) => {
            return {
              waitingForHideIncorrectCards: false, 
              previousPressed: null,
              gridArray: this.changePressElementState(
                prevState.gridArray, 
                pressed, 
                { property: 'shown', value: false }
              ),
            }
          })
        })
      }, 600)

    })
  }


  checkCouple = ( pressed ) => {

    if( !this.state.waitingForHideIncorrectCards ) {

      if(this.state.previousPressed === null) {
        //If there is not previous pressed, set it and show the 
        //selected card.
        this.setFirstSelection( pressed );
  
      } else if(this.state.previousPressed.element.value === pressed.element.value) {
        //If there is a previous pressed and the next pressed have the same value
        //Then, show both cards.
        this.showBothCards( pressed );
      } else if(this.state.previousPressed.element.value !== pressed.element.value) {
        //If there is a previous pressed and the next pressed have not the same value
        //Then, hide both.
        this.resetSelectedCards( pressed );
      }

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
    
    const gridMixArray = this.shuffle(gridAuxArray);

    this.setState({ gridArray: gridMixArray, points: 0 });
    
  }

  renderGrid = () => {
    return this.state.gridArray.map( (rowArray, index) => {
      return <Row checkCouple={this.checkCouple} rowArray={rowArray} key={index} index={index} />;
    })
  }

  isValidGrid = () => {
    const { rows, columns } = this.state;
    const total = rows + columns;
    return total > 3;
  }

  render() {
    
    return (
      <View style={styles.outerContainer}>
        
        <View style={styles.buttonContainer}>
          
          <Button
            onPress={() => {
              if(this.state.columns >= 2 && 
                !this.state.waitingForHideIncorrectCards &&
                this.isValidGrid()) 
                this.setState((prevState) => {
                  return {
                    columns: prevState.columns - 1,
                  }
                })
            }}
            title="Menos columnas"
            color="#2196f3"
            accessibilityLabel="Learn more about this purple button"
          />
          <Text>{this.state.columns}</Text>
          <Button
            onPress={() => {
              if(this.state.columns <= 9 && 
                !this.state.waitingForHideIncorrectCards
              ) 
                this.setState((prevState) => {
                  return {
                    columns: prevState.columns + 1,
                  }
                })
            }}
            title="Más columnas"
            color="#2196f3"
            accessibilityLabel="Learn more about this purple button"
          />

        </View>
        
        <View style={styles.buttonContainer}>
          
          <Button
            onPress={() => {
              if(
                this.state.rows >= 2 && 
                !this.state.waitingForHideIncorrectCards &&
                this.isValidGrid()
              ) 
                this.setState((prevState) => {
                  return {
                    rows: prevState.rows - 1,
                    previousPressed: null,
                  }
                })
            }}
            title="Menos filas"
            color="#2196f3"
            accessibilityLabel="Learn more about this purple button"
          />
          <Text>{this.state.rows}</Text>
          <Button
            onPress={() => {
              if(
                this.state.rows <= 9 && 
                !this.state.waitingForHideIncorrectCards
              ) 
                this.setState((prevState) => {
                  return {
                    rows: prevState.rows + 1,
                    previousPressed: null,
                  }
                })
            }}
            title="Más filas"
            color="#2196f3"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>

        { 
          parseInt(this.state.rows * this.state.columns / 2) === this.state.points ?
          <Text style={{ alignSelf: 'center' }}>¡GANASTE con {this.state.points} puntos!</Text> :
          <Text style={{ alignSelf: 'center' }}>Llevas {this.state.points} puntos - Marcos Barrera del Río</Text>
        }
        
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F5FCFF',
    height: 20,
  },
  outerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  }
});
