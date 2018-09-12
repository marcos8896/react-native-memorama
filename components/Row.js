import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert} from 'react-native';

const row = ( props ) => {
  
  const generatedElements = props.rowArray.map((el, cellIndex) => {
    return (
      <TouchableOpacity onPress={() => {
        props.checkCouple({ element: el, cellIndex: cellIndex, arrayRowIndex: props.index })
      }} 
        key={cellIndex} 
        style={
          el.shown ?
          styles.foundNumberContainer :
          styles.numberContainer
        }
      >
        {el.shown ? <Text>{el.value}</Text> : <Text>?</Text>}
      </TouchableOpacity>
    );
  });
  
  return (
    <View style={styles.rowContainer}>
      {generatedElements}
    </View>
  );
}



export default row;

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  numberContainer: {
    backgroundColor: 'grey',
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight:  8,
    borderRadius: 90,
  },
  foundNumberContainer: {
    backgroundColor: 'red',
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight:  8,
    borderRadius: 90,
  }

});
