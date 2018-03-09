import React, { Component } from 'react';
import { AsyncStorage, Alert, ActivityIndicator, ScrollView, View } from 'react-native';
import { Container, Header, Title, Content, List, 
   Body, Right, Tabs, Tab } from 'native-base';
//import SocketIOClient from 'socket.io-client';
import MorePopupMenu from '../../components/MorePopupMenu';
import { getUserFromId, getLastMessages, getUnreadMessages } from '../../chatsappapi';
import ChatDetails from '../../components/ChatDetails';
import Contacts from '../Contacts';

// for defective95 const defaultimg = 'https://filestore.defective95.hasura-app.io/v1/file/c6afa506-673c-46b0-bf93-50ed2f18163e';
// const image1 = require('../../images/kingfisher.jpg');
// const image2 = require('../../images/butterfly.jpg');
// const image3 = require('../../images/mushrooms.jpg');
//const USER = 'user';


export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMessages: [],
      isLoading: true,
      user: null,
      fabActive: true,
      mobilenumber: '',
    };
    
    this.onReceivedUserMessages = this.onReceivedUserMessages.bind(this);
  }
  

  componentWillMount() {
    //this.setUserInfo();
    this.onReceivedUserMessages();
  }

    onReceivedUserMessages = async () => {
      const messages = [];
    const user_id = await AsyncStorage.getItem('user_id');
    const newmessages = await getLastMessages(user_id);
    const unreadmessages = await getUnreadMessages();
    //skipping first row 
    console.log('newmessages', newmessages);
    console.log('newmessages-result', newmessages.result);
    console.log('newmessages-result-length', newmessages.result.length);
    for (let i = 1; i < newmessages.result.length; i++) {
      const friend_id = newmessages.result[i][2];
       let unreadcount = 0;
      console.log('unreadmessages', unreadmessages);
      for (let j = 1; j < unreadmessages.result.length; j++) {
        if (unreadmessages.result[j][0] === friend_id) {
           unreadcount = unreadmessages.result[j][1];
           console.log(unreadmessages.result[j][0] + unreadcount);
        }
      }
      const friends = await getUserFromId(friend_id);
      const friend = friends[0];
     
      console.log(friend);
      messages.push({
        user_id,
        friend,
        msg_id: newmessages.result[i][1],
        msg_text: newmessages.result[i][3],
        sent_time: newmessages.result[i][4],
        recd_time: newmessages.result[i][5],
        unreadcount
      });
    }
    console.log(messages);
    if (messages.length === 0) {
      Alert.alert('Welcome!', 'No current chats available... chose your friends from Contacts tab');
    }
    this.setState({ user_id, isLoading: false, userMessages: messages });
 }

 renderContacts() {
  console.log(`inside renderContacts, state ${this.state.userMessages}`);
  return (
    <Contacts user_id={this.state.user_id} navigation={this.props.navigation} />
  );
  }
renderChats() {
  console.log(`inside renderChats, state ${this.state.userMessages.toString}`);
  return this.state.userMessages.map(userMessages =>
      <ChatDetails key={userMessages.msg_id} userMessages={userMessages} navigation={this.props.navigation} />);
}

render() { 
      if (this.state.isLoading) {
      return (

        <View style={{ flex: 1, paddingTop: 20 }} >
          <ActivityIndicator />
        </View>
      );
    }
    const { navigate } = this.props.navigation;
    return (
      <Container>
      <Header style={{ backgroundColor: '#045e54' }}>
         <Body>
         <Title>ChatsApp</Title>
       </Body>
       <Right>
         { console.log(this.state.user) }
         <MorePopupMenu onPress={() => navigate('Profile', { user: this.state.user })} actions={['Settings']} />
      </Right>
      </Header>
      <Content style={{ backgroundColor: 'white' }}>
      <Tabs initialPage={0} tabBarUnderlineStyle={{ borderBottomWidth: 1 }}>
          <Tab heading="Chats" tabStyle={{ backgroundColor: '#045e54' }} activeTabStyle={{ backgroundColor: '#045e54' }}>
            <List >
            {this.renderChats()}
            </List>
          </Tab>
          <Tab heading="Contacts" tabStyle={{ backgroundColor: '#045e54' }} activeTabStyle={{ backgroundColor: '#045e54' }}>
          <List style={{ backgroundColor: 'white' }}>
            {this.renderContacts()}
            </List>
          </Tab>
        </Tabs>
     
          
      </Content>
      
    </Container>
    );
  } 
}
