import React, { Component } from 'react';
import { Dropdown } from 'react-native-material-dropdown';
import Prompt from 'react-native-prompt';
import { Keyboard, AsyncStorage, Alert } from 'react-native';
import { Container, Item, Input, Header, Title, Content, Card, Button, CardItem, Body, View, Text } from 'native-base';
import { trySignupAndInsert, sendOtpUser, getUser, insertUser, updateUser } from '../chatsappapi';
import HomeScreen from '../screens/HomeScreen/HomeScreen';

  let country = 'India';

  
  export default class LoginScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        phone: '',
        otp: '',
        promptShow: false,
        user: null,
        auth: null
      };
    }
    async componentWillMount() {
      //  AsyncStorage.getItem('userid').then((value) => { 
      //      this.setState({ userid: value });
      //  }).done();
      console.log('getting');
      AsyncStorage.getItem('HASURA_AUTH_TOKEN').then((value) => {
        console.log(value);
        this.setState({ auth: value });
      }).done();
      console.log('mounting');
     }

    onChangeCountry(countryvalue) {
      if (countryvalue !== 'India') {
        console.log(`countryvalue =${countryvalue}`);
        Alert.alert('Register', 'Currently only supported in India');
      } 
        country = countryvalue;
    }

    async onPressOTPButton(value) {
      console.log(value);
    if (value === '') {
        Alert.alert('Register', 'Please enter valid otp');
    } else {
      const { navigate } = this.props.navigation;
      this.setState({ promptShow: false, otp: value });
      const response = await trySignupAndInsert(this.state.phone, value);
      Alert.alert('Response', response);
      if (response.status !== 200) {
        if (response.status === 504) {
          Alert.alert('Network Error', 'Check your internet connection');
        } else {
          Alert.alert('Error', `Signup Unsuccessful, Pl.Try Again!  ${response.status}`);      
        }
      } else {         
        navigate('Home');
     }
    }
  }

   handleSignupPressed = async () => {     
      const responseSendOtp = await sendOtpUser(this.state.phone);
      console.log(responseSendOtp);
      if (responseSendOtp.status !== 200) {
        if (responseSendOtp.status === 504) {
          Alert.alert('Network Error', 'Check your internet connection');
        } else {
          Alert.alert('Error', `Unable to send OTP ${responseSendOtp.status}`);      
        }
      } else {
        this.setState({ promptShow: true });
      }
    }

  
    signUpUser() {
      if (this.state.phone === '') {
          Alert.alert('Register', 'Please enter your phone number to register');
      } 
      console.log(`country =${country}`);
      if (country !== 'India') {
        console.log(`country =${country}`);
        Alert.alert('Register', 'Currently only supported in India');
      } 
      if (this.state.phone !== '' && country === 'India') {
        console.log('log in');
        Keyboard.dismiss();
        this.handleSignupPressed();
      }
    }

    logInUser = async () => {
      // const response = await tryLogin('trial', 'trial#user');
      // if (response.status !== 200) {
      //   if (response.status === 504) {
      //     Alert.alert('Network Error', 'Check your internet connection');
      //   } else {
      //     Alert.alert('Error', 'Unauthorized, Invalid username or password');      
      //   }
      // } else {
      //   this.setState({ isLoggedIn: true });  
      // }
      //const insertResponse = await insertUser(899924244, 5);
      const insertResponse = await getUser(939484432);
      if (insertResponse.status !== 200) {
        if (insertResponse.status === 504) {
          Alert.alert('Network Error', 'Check your internet connection');
        } else {
          Alert.alert('Error', `Unable to insert ${insertResponse.status}`);   
          console.log(insertResponse.statusText);   
        }
      } else {
        //AsyncStorage.setItem('userid', 3);
      }
    }

    saveData = phone => {
     console.log(`mob=${phone}`);
     this.setState({ phone });
  }

  render() {
    const data = [{
      value: 'India',
    }, {
      value: 'ABC',
    }, {
      value: 'DEF',
    }];

    console.log('auth');
    console.log(this.state.auth);
   
    return (
      
        (this.state.auth !== null) 
        ?
        <HomeScreen navigation={this.props.navigation} />
        :       
      <Container>
        <Header style={{ backgroundColor: '#045e54' }}>
            <Body>
            <Title>Verify Your Phone Number</Title>
          </Body>
        </Header>
        <Content>
        <Prompt
            title="Please enter OTP below to verify your phone number"
            visible={this.state.promptShow}
            onCancel={() => this.setState({ promptShow: false, otp: '' })}
            onSubmit={(otp) => this.onPressOTPButton(otp)}
            
        />
       
          <Card>
            <CardItem>
              <Body>
                <Text>
                 WhatsApp Messenger will send a one time SMS message to verify your phone number.
                 Carrier SMS charges may apply.
                </Text>
              </Body>
            </CardItem>
            </Card>
            <Card>
            <CardItem>
              <Body>
                <Text>
                Please confirm your country code and enter your phone number
                </Text>
                
                </Body>
            </CardItem>   
            <View style={{ flex: 1, margin: 10 }}>
                <Dropdown
                  baseColor='#045e54'
                  label=''  
                  onChangeText={this.onChangeCountry}             
                  style={{ paddingBottom: 5, textAlign: 'center' }}
                  data={data} 
                  value='India'
                  
                /> 
                </View>
            <CardItem>
            {/* passing reference of this as this method will be called at runtime */}
            <Text>+</Text>
            <Item style={{ flex: 1 }}>
           
            <Input placeholder="91" style={{ flex: 2 }} />
            
            <Input 
            placeholder='Phone Number' 
            style={{ textAlign: 'left', flex: 6 }}
            value={this.state.phone} 
            onChangeText={(phone) => this.saveData(phone)}
            />
          
            <Button bordered dark onPress={this.signUpUser.bind(this)}>
                <Text>OK</Text>
            </Button>
            </Item>
            </CardItem>
            <CardItem>
              <Button bordered dark onPress={this.logInUser.bind(this)}>
                <Text>Login</Text>
            </Button>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
}
}

