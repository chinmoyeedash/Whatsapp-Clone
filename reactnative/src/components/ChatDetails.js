import React, { Component } from 'react';
import { ListItem, Thumbnail, Text, Body, Left, Right, Badge, Icon } from 'native-base';


//The bubbles that appear on the left or the right for the messages.
export default class ChatDetails extends Component {

render() {
    const { navigate } = this.props.navigation;
    const { msg_text, sent_time, displayname, displaypic, user_id, friend_id } = this.props.userMessages;
    console.log(displaypic);
    
  const postDate = new Date(sent_time).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
   //const postDate = sent_time; 
   return (
          
           <ListItem avatar button onPress={() => navigate('ChatScreen', { user_id, friend_id })}>
            {console.log(friend_id)}
              <Left>
              <Thumbnail source={{ uri: displaypic }} />
              </Left>
              <Body>
                <Text>{ displayname }</Text>
                <Text note>{ msg_text }</Text>
              </Body>
              <Right >
              <Text note style={{ color: 'green' }}>{ postDate }</Text>
              <Badge success>
                <Text>2</Text>
              </Badge>
              </Right>
            </ListItem>
     ); 
    }
}
