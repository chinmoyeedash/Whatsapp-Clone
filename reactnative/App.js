import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import LoginScreen from './src/screens/HomeScreen/index.js';


export default class App extends Component {

  async componentWillMount() {
    try {
      console.log('setting-crawfish');
      await AsyncStorage.setItem('HASURA_AUTH_TOKEN', '6080aa12c20685b9fbacf12c7390f8b27cc3a307999cf67b');
       const userid = '8';
       await AsyncStorage.setItem('user_id', userid);
    } catch (error) {
      // Error saving data
      console.log(`error setting ${error}`);
    }
  }
 
  render() {
    return <LoginScreen />;
  }
}
