import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');

const row = props => {
  
  /*const generatedElements = props.basedArray.map((el, index) => {
    return (
      <View 
        key={index} 
        style={styles.numberContainer}
      >
        <Text>{el}</Text>
      </View>
    );
  });*/
  
  return (
    <View style={styles.rowContainer}>

      <Text>Ya se genera el gridArray</Text>
      {/*generatedElements*/}

    </View>
  );
}



export default row;

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  numberContainer: {
    backgroundColor: 'red',
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight:  5,
  }

});
