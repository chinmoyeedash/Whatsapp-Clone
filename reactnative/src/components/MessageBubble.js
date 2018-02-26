import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'native-base';

//The bubbles that appear on the left or the right for the messages.
export default class MessageBubble extends Component {
    render() {
       //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
      const leftSpacer = this.props.userid === 'left' ? null : <View style={{ width: 70 }} />;
      const rightSpacer = this.props.userid === 'left' ? 
      <View style={{ width: 70 }} /> : null;
  
      const bubbleStyles = this.props.userid === 'left' ? 
      [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];
  
      const bubbleTextStyle = this.props.userid === 'left' ? 
      styles.messageBubbleTextLeft : styles.messageBubbleTextRight;
  
      return (
          
          <View style={{ flexDirection: 'row' }}>
              {leftSpacer}
              <View style={bubbleStyles}>
           
                <Text style={bubbleTextStyle}>
                  {this.props.text}
                  <Text note style={{ justifyContent: 'flex-end', color: 'green' }}>{'\n'}{this.props.time} </Text>
                </Text> 
                {/* <View style={{ justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 10 }}>  
                 {'\n'} {this.props.time} 
                  </Text>     
                  </View> */}
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
