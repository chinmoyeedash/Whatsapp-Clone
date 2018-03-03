import React, { Component } from 'react';
import { Header, Container, Content,  Left, Icon, Right, View, Body, Text, Button, Thumbnail, Card, Form, Label, Item, Input } from 'native-base';
import { getUserFromId } from '../chatsappapi';

const image1 = require('../images/kingfisher.jpg');

export default class ContactInfoScreen extends Component {

    state = {
        contact: '',
    }

    componentWillMount() {
        this.getContactInfo();
    }

    getContactInfo = async () => {
        console.log('getting contact');
        const contact = await getUserFromId(user_id);
        console.log(contact[0]);
        console.log(JSON.stringify(contact[0]))
        this.setState({contact: JSON.stringify(contact[0])});
    }
   
    render() {
        const contact = this.state.contact;
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
            onPress={() => this.props.navigation.navigate('ImageScreen', { dp: contact.displaypic })}
            >      
                <Thumbnail style={{ height: 150, width: 150 }} large source={contact.displaypic} />
            </Button>    
            </Body>
            
            </Card>
            <Form>
                <Item stackedLabel>
                    <Label>Username</Label>
                    <Text>{contact.displayname}</Text>  
                </Item>
                <Item stackedLabel>
                    <Label>Status</Label>
                    <Text>{contact.status}</Text>  
                </Item>
                <Item stackedLabel>
                    <Label>Phone number</Label>
                    <Text>{contact.mobilenumber}</Text>  
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
