import React, { Component } from 'react';
import { ListItem, Thumbnail, Text, Body, Left, Right, Badge, Icon } from 'native-base';

//The bubbles that appear on the left or the right for the messages.
export default class Row extends Component {

render() {
    const { navigate } = this.props.navigation;
    const { displayname, status, displaypic } = this.props.users;
    console.log(displaypic);
    return (
           <ListItem avatar button onPress={() => navigate('ChatScreen')}>
              <Left>
              <Thumbnail source={{ uri: displaypic }} />
              </Left>
              <Body>
                <Text>{ displayname }</Text>
                <Text note>{ status }</Text>
             </Body>
             </ListItem>
     ); 
    }
}
