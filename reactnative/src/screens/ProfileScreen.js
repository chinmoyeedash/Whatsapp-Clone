import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, PixelRatio } from 'react-native';
import { Header, Container, Content, View, Body, Left, Right, Icon, Text, Button, Thumbnail, Card, Form, Label, Item, Input } from 'native-base';
import ImagePicker from 'react-native-image-picker';

import { updateUser, getUserFromId } from '../chatsappapi';


const defaultimg = 'https://filestore.defective95.hasura-app.io/v1/file/c6afa506-673c-46b0-bf93-50ed2f18163e';

export default class ProfileScreen extends Component {

    
    constructor(props) {
        super(props);
        this.state = {
            displaypic: '',
            mobilenumber: '',
            status: '',
            displayname: ''
          };  

        this.setUserInfo = this.setUserInfo.bind(this);
        // const { mobilenumber, displayname, status } = JSON.parse(this.props.navigation.state.params.user);
        // let { displaypic } = JSON.parse(this.props.navigation.state.params.user);
         
        
          console.log(this.state.displayname);
    }

    componentWillMount() {
        this.setUserInfo();
    }

    setUserInfo = async () => {
        console.log('setting user info');
        AsyncStorage.getItem('user_id')
        .then(res => { 
          //this.setState({ user_id: res });
          console.log(res);
          return getUserFromId(res);
        }).then(oldUser => {
          console.log(oldUser);
          let dp = oldUser[0].displaypic;
          if (dp == null) {
               dp = defaultimg;
          }
          this.setState({  
            mobilenumber: oldUser[0].mobilenumber, 
            displayname: oldUser[0].displayname,
            status: oldUser[0].status,
            displaypic: dp,
            
          });
          console.log(this.state.displaypic);
          AsyncStorage.setItem('user', JSON.stringify(oldUser[0]));
        })
        .catch(error => console.log(error));
      }

    selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const source = { uri: response.uri };
    
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            console.log('source');
            console.log(source);
            this.setState({
   
              displaypic: source.uri
   
            });
          }
        });
    }

    handleUploadPressed = async () => {

    }

    handleUpdatePressed = async () => {
        //this.setState({ username: user.displayname, status: user.status });
        const { navigate } = this.props.navigation;
        console.log(this.state.mobilenumber, this.state.displayname, this.state.displaypic, this.state.status);
        const updateResponse = await updateUser(this.state.mobilenumber, this.state.displayname, this.state.displaypic, this.state.status);
           
            if (updateResponse.status !== 200) {
              if (updateResponse.status === 504) {
                Alert.alert('Network Error', 'Check your internet connection');
              } else {
                Alert.alert('Error', `Unable to insert ${updateResponse.status}`);      
              }
            } else {
                AsyncStorage.getItem('user')
                .then(oldUser => {
                    console.log('updating async user');
                    const newUser = { 
                        mobilenumber: oldUser.mobilenumber, 
                        user_id: oldUser.user_id, 
                        displayname: this.state.displayname,
                        status: this.state.status,
                        displaypic: this.state.displaypic,
                        lastseen: oldUser.lastseen
                    };
                    AsyncStorage.setItem('user', newUser);
                    Alert.alert('Done', 'Update done', [
                        { text: 'OK', onPress: () => navigate('Home') },
                    ]);
                    });            
            }
          }
    
      handleDisplaynameChange = displayname => {
          this.setState({
              ...this.state,
              displayname
          });
      }
    
      handleStatusChange = status => {
          this.setState({
              ...this.state,
              status
          });
      }
    
    render() {
    return (
        <Container >
        <Header style={{ backgroundColor: '#045e54' }}>
          <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{ color: '#fbebb0' }} />
            </Button>
          </Left>
          <Body />
          <Right />

        </Header>
        <Content style={{ backgroundColor: '#fbebb0' }} contentContainerStyle={{ justifyContent: 'center', margin: 40 }}>
        <Card >
            <Body style={{ padding: 20 }}>
            <Button
                transparent
                style={{ height: 150, width: 150 }}
                onPress={() => this.props.navigation.navigate('ImageScreen', { displaypic: this.state.displaypic })}
            >      
            <Thumbnail 
            style={{ height: 150, width: 150 }} 
            large 
            source={{ uri: this.state.displaypic }}    
            />
            </Button>
            <Button block rounded style={{ backgroundColor: 'darkorange' }} onPress={this.selectPhotoTapped.bind(this)} >
            <Text> Change Picture </Text>
        </Button>
            </Body>    
        </Card>

        <Form>
            <Item stackedLabel>
            <Label>Username</Label>
            {console.log(this.state.displayname)}
            <Input value={this.state.displayname} onChangeText={this.handleDisplaynameChange} />
            </Item>
            <Item stackedLabel>
            <Label>Status</Label>
            <Input value={this.state.status} onChangeText={this.handleStatusChange} />
            </Item>
        </Form>
        <View style={{ height: 10 }} />
        <Button block rounded style={{ backgroundColor: 'darkorange' }} onPress={this.handleUpdatePressed} >
            <Text> Update</Text>
        </Button>
        </Content>
        </Container>
    ); 
}
}
