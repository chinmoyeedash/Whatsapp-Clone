import React, { Component } from 'react';
import { ListItem, Thumbnail, Text, Body, Left, Right, Badge } from 'native-base';


//The bubbles that appear on the left or the right for the messages.
export default class ChatDetails extends Component {

render() {
    const { navigate } = this.props.navigation;
    const { msg_text, sent_time, user_id, friend, unreadcount } = this.props.userMessages;
    const imageurl = 'https://filestore.crawfish92.hasura-app.io/v1/file/' + friend.displaypic;

    console.log(`inside chatdetials ${friend.displaypic}`);
    
  const postDate = new Date(sent_time).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
   //const postDate = sent_time; 
   return (
          
           <ListItem avatar button onPress={() => navigate('ChatScreen', { user_id, friend })}>
              <Left>
              <Thumbnail source={{ uri: imageurl }} />
              </Left>
              <Body>
                <Text>{ friend.displayname }</Text>
                <Text note>{ msg_text }</Text>
              </Body>
              <Right >
              <Text note style={{ color: 'green' }}>{ postDate }</Text>
              { 
                unreadcount !== 0 ?
                <Badge success> 
                <Text>{ unreadcount }</Text>
                </Badge>
                :
                <Text />
              }
              </Right>
            </ListItem>
     ); 
    }
}
