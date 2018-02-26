import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { Header, Container, Content, View, Body, Left, Right, Icon, Title, Text, Button, Thumbnail, Card, Form, Label, Item, Input } from 'native-base';
import { updateUser } from '../chatsappapi';


const defaultimg = 'https://filestore.defective95.hasura-app.io/v1/file/c6afa506-673c-46b0-bf93-50ed2f18163e';


export default class ProfileScreen extends Component {

    
    constructor(props) {
        super(props);
        console.log('user');
        console.log(this.props.navigation.state.params.user);
        
        const { mobilenumber, displayname, status, displaypic } = JSON.parse(this.props.navigation.state.params.user);
        
        this.state = {
            mobilenumber,
              displayname,
              status,     
              displaypic
          };  
          
          console.log(this.state.displayname);
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
                    // let newdp = oldUser.displaypic;
                    // if ((oldUser.displaypic) == null) {
                    //     console.log('null');
                    //     newdp = defaultimg;
                    // }
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
        {/* <CardItem cardbody>
            <Image source={image1}/> 
        </CardItem> */}
            <Body style={{ padding: 20 }}>
            <Button
                transparent
                style={{ height: 150, width: 150 }}
                onPress={() => this.props.navigation.navigate('ImageScreen', { displaypic: this.state.dp })}
            >      
            <Thumbnail 
            style={{ height: 150, width: 150 }} 
            large 
            source={{ uri: this.state.displaypic }}    
            />
            </Button>
            </Body>    
        </Card>

        {/* <Content contentContainerStyle={{ justifyContent: 'center', margin: 40 }}> */}
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
