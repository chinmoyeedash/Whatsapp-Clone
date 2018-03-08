import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import LoginScreen from './src/screens/HomeScreen/index.js';


export default class App extends Component {

  async componentWillMount() {
    try {
      console.log('setting-crawfish');
      //await AsyncStorage.setItem('HASURA_AUTH_TOKEN', 'I like to save it.');
      // const userid = '8';
      // await AsyncStorage.setItem('user_id', userid);
    } catch (error) {
      // Error saving data
      console.log(`error setting ${error}`);
    }
  }
 
  render() {
    return <LoginScreen />;
  }
}
