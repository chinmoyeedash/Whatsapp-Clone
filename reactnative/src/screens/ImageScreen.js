import React, { Component } from 'react';
import { Text } from 'native-base';
 import { StyleSheet, View, Image } from 'react-native';


  export default class ImageScreen extends Component {
    render() {
          
      return (
        <Image
        source={{ uri: this.props.navigation.state.params.dp }}
        style={styles.container}
        />
    
 //<View><Text>Hello !!</Text></View>
        );
    }

    
    }
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          width: undefined,
          height: undefined,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          resizeMode: 'contain'
        },
      });

