import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'native-base';

let direction = 'right';
//The bubbles that appear on the left or the right for the messages.
export default class MessageBubble extends Component {
    render() {
      const { msg_text, sent_time, sender_id, receiver_id } = this.props.message;
      if (this.props.user_id === sender_id) {
        direction = 'right';
      } else {
        direction = 'left';
      }
      
      //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
      const leftSpacer = direction === 'left' ? null : <View style={{ width: 70 }} />;
      const rightSpacer = direction === 'left' ? 
      <View style={{ width: 70 }} /> : null;
  
      const bubbleStyles = direction === 'left' ? 
      [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];
  
      const bubbleTextStyle = this.props.direction === 'left' ? 
      styles.messageBubbleTextLeft : styles.messageBubbleTextRight;
      const postDate = new Date(sent_time).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3');
      return (
        
          <View style={{ flexDirection: 'row' }}>
              {leftSpacer}
              <View style={bubbleStyles}>
           
                <Text style={bubbleTextStyle}>
                  {msg_text}
                  <Text note style={{ justifyContent: 'flex-end', color: 'green' }}>{'\n'}{postDate} </Text>
                </Text> 
                </View>
                {rightSpacer}
            </View>
                );
    }
  }

  const styles = StyleSheet.create({
  //MessageBubble

  messageBubble: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    flex: 1
},

messageBubbleLeft: {
  backgroundColor: '#d5d8d4',
},

messageBubbleTextLeft: {
  color: 'black'
},

messageBubbleRight: {
  backgroundColor: 'darkorange'
},

messageBubbleTextRight: {
  color: 'white'
},

});
