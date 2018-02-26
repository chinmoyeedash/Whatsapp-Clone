import React, { Component } from 'react';
import { Header, Container, Content,  Left, Icon, Right, View, Body, Text, Button, Thumbnail, Card, Form, Label, Item, Input } from 'native-base';

const image1 = require('../images/kingfisher.jpg');

export default class ContactInfoScreen extends Component {

    state = {
        contact: '',
      }
    componentWillMount() {
        this.getContactInfo();
    }

    getContactInfo() {
    console.log(this.props.contactid);
    const contact = { userid: '98765', username: 'Vru26', status: 'team 92', dp: image1 };
    console.log(contact);
    this.setState({ contact });
    
    // return fetch('https://rallycoding.herokuapp.com/api/music_albums')
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   console.log(responseJson);
    //   //let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    //   this.setState({
    //     isLoading: false,
    //     //albums: ds.cloneWithRows(responseJson.albums),
    //     albums: responseJson,

    //   }, function() {
    //     // do something with new state
    //     console.log('do something with new state');
    //   });
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
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
                    onPress={() => this.props.navigation.navigate('ImageScreen', { dp: image1 })}
                    >      
                        <Thumbnail style={{ height: 150, width: 150 }} large source={this.state.contact.dp} />
                    </Button>    
                    </Body>
                    
                    </Card>
                            <Form>
                            <Item stackedLabel>
                                <Label>Username</Label>
                                <Text>{this.state.contact.username}</Text>  
                            </Item>
                            <Item stackedLabel>
                                <Label>Status</Label>
                                <Text>{this.state.contact.status}</Text>  
                            </Item>
                            <Item stackedLabel>
                                <Label>Phone number</Label>
                                <Text>{this.state.contact.userid}</Text>  
                            </Item>
                            </Form>
                            <View style={{ height: 10 }} />
                            {/* <Button block rounded style={{ backgroundColor: 'darkorange' }} onPress={this.handleUpdatePressed} >
                            <Text> Call</Text>
                            </Button> */}
                            
                        </Content>
                </Container>
        ); 
    }
    
}
