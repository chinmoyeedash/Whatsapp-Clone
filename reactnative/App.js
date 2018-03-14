import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import LoginScreen from './src/screens/HomeScreen/index.js';


export default class App extends Component {

  async componentWillMount() {
    try {
    console.log('setting-crawfish');
      //await AsyncStorage.setItem('HASURA_AUTH_TOKEN', '1f324240f7496bd4696d741f851cae50b3f6badd890e1b1a');
      //  const userid = 21;
      //  await AsyncStorage.setItem('user_id', userid.toString());
      //  const userid1 = await AsyncStorage.getItem('user_id');
      //  console.log(userid1);
    } catch (error) {
      // Error saving data
      console.log(`error setting ${error}`);
    }
  }
 
  render() {
    return <LoginScreen />;
  }
}
