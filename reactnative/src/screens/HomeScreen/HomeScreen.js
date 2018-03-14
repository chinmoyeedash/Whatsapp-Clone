import React, { Component } from 'react';
import { AsyncStorage, Alert, ActivityIndicator, ScrollView, View, YellowBox } from 'react-native';

import { Container, Header, Title, Content, List, 
   Body, Right, Tabs, Tab } from 'native-base';
//import SocketIOClient from 'socket.io-client';
import MorePopupMenu from '../../components/MorePopupMenu';
import { getUserFromId, getLastMessages, getUnreadMessages } from '../../chatsappapi';
import ChatDetails from '../../components/ChatDetails';
import Contacts from '../Contacts';
import SocketIOClient from 'socket.io-client';
// for defective95 const defaultimg = 'https://filestore.defective95.hasura-app.io/v1/file/c6afa506-673c-46b0-bf93-50ed2f18163e';
// const image1 = require('../../images/kingfisher.jpg');
// const image2 = require('../../images/butterfly.jpg');
// const image3 = require('../../images/mushrooms.jpg');
//const USER = 'user';

let show = true;
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
      userMessages: [],
      isLoading: true,
      user: null,
      fabActive: true,
      mobilenumber: '',
    };
    this.socket = SocketIOClient('https://app.crawfish92.hasura-app.io/', { transports: ['websocket'] });
    this.socket.on('message', this.onReceivedMessage);

    this.joinUser = this.joinUser.bind(this);
    this.onReceivedUserMessages = this.onReceivedUserMessages.bind(this);
  }
  

  componentWillMount() {
    //this.setUserInfo();
    this.onReceivedUserMessages();
  }
  componentDidMount() {
    this.joinUser();
  }

  
  componentWillUnmount() {
    this.socket.disconnect();
  }

  onReceivedMessage = (msg) => {
    console.log('received new msg', msg);
    this.onReceivedUserMessages();
  //   const oldMessages = this.state.messages;
  // // React will automatically rerender the component when a new message is added.
  //   if (this.state.friend.user_id === msg.receiver_id) {
  //  this.setState({ messages: oldMessages.concat(msg) });
  //   }
  // updateRecdTime(this.state.user_id, this.state.friend.user_id);
  }

    onReceivedUserMessages = async () => {
      const messages = [];
      console.log("start");
    const user_id = await AsyncStorage.getItem('user_id');
    console.log('user_id', user_id);
    const lastmessages = await getLastMessages(user_id);
    console.log('lastmessages', lastmessages);
    
    //skipping first row 
    console.log('lastmessages', lastmessages);
    console.log('lastmessages-result', lastmessages.result);
    console.log('lastmessages-result-length', lastmessages.result.length);
    for (let i = 1; i < lastmessages.result.length; i++) {
      const friend_id = lastmessages.result[i][2];
       let unreadcount = 0;
       const unreadmessages = await getUnreadMessages(user_id, friend_id);
       console.log('unreadmessages', unreadmessages);
       if (unreadmessages.result.length > 1) {
         unreadcount = unreadmessages.result[1][2];
       }
       console.log('unreadcount=', unreadcount);
      
      const friends = await getUserFromId(friend_id);
      const friend = friends[0];
     
      console.log(friend);
      messages.push({
        user_id,
        friend,
        msg_id: lastmessages.result[i][1],
        msg_text: lastmessages.result[i][3],
        sent_time: lastmessages.result[i][4],
        recd_time: lastmessages.result[i][5],
        unreadcount
      });
    }
    console.log('messages', messages);
    if (messages.length === 0 && show) {
      Alert.alert('Welcome!', 'No current chats available... chose your friends from Contacts tab');
      show = false;
    }
    this.setState({ user_id, isLoading: false, userMessages: messages });
 }

 joinUser = async() => {
  console.log('going to connect');
  const userid = await AsyncStorage.getItem('user_id');
  console.log('userid inside joinuser', userid);
    this.socket.on('connect', () => {
      console.log('in CONNECT');
      
      this.socket.emit('myConnect', {
        msg: 'User has connected',
        fromuserid: userid
      });
    });

    this.socket.on('disconnect', () => {
      console.log('in DISCONNECT');
      const userid = this.state.user_id;
      this.socket.emit('myDisconnect', {
        msg: 'User has disconnected',
        fromuserid: userid
      });
    });

    //updateRecdTime(this.state.user_id, this.state.friend.user_id);
}

 renderContacts() {
  console.log('inside renderContacts, state ');
  return (
    <Contacts user_id={this.state.user_id} navigation={this.props.navigation} />
  );
  }
renderChats() {
  console.log('inside renderChats, state ', this.state.userMessages);
  return this.state.userMessages.map(userMessages =>
      <ChatDetails key={userMessages.msg_id} userMessages={userMessages} socket={this.socket} navigation={this.props.navigation} />);
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
      <Tabs initialPage={0} tabBarUnderlineStyle={{ borderBottomWidth: 1 }} onChangeTab={({i, ref, from }) => this.onReceivedUserMessages()}>
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
