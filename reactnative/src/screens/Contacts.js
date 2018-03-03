import React, { Component } from 'react';
import { FlatList } from 'react-native';

import { getContacts } from '../chatsappapi';
import { ListItem, Thumbnail, Text, Body, Left, Right, Badge, Icon, List } from 'native-base';
//The bubbles that appear on the left or the right for the messages.

const user_id = 0;
const defaultimg = 'https://filestore.crawfish92.hasura-app.io/v1/file/61316c53-6640-4d9a-a586-3a9c1892716d';

export default class Contacts extends Component {

    constructor(props) {
        super(props);
        user_id = this.props.user_id;
        
        this.updateContacts = this.updateContacts.bind(this);
        this.state = {
            contacts: []
        };
    }

    componentWillMount() {
        this.updateContacts(user_id);
    }

    updateContacts = async () => {
        const contacts = await getContacts(user_id);
        // const contact = [];
        // console.log(contacts);
        // for (let i = 0; i < contacts.length; i++) {
        //     console.log(contact[i]);
        //     contact.push(contacts[i]);
        // }
       
        console.log(contacts);
        
        // React will automatically rerender the component when a new message is added.
        this.setState({ contacts });
    }
    
    handlePress(friend_id) {
        const { navigate } = this.props.navigation;
        console.log(friend_id);
        navigate('ChatScreen', { user_id, friend_id });
    }

render() {
    return (
            //    <ListItem avatar button onPress={() => navigate('ChatScreen', { user_id, friend_id })}>
            //       <Left>
            //       <Thumbnail source={{ uri: displaypic }} />
            //       </Left>
            //       <Body>
            //         <Text>{ displayname }</Text>
            //         <Text note>{ status }</Text>
            //      </Body>
            //      </ListItem>
            <FlatList
            data={this.state.contacts}
            renderItem={({ item }) => 
            (
            //   <ListItem 
            //     roundAvatar
            //     title={item.displayname}
            //     subtitle={item.status}
            //     avatar={{ uri: item.displaypic }}
            //     button onPress={() => this.handlePress(item.user_id)}
            //   />
                <ListItem avatar button onPress={() => this.handlePress(item.user_id)}>
                <Left>
                   <Thumbnail source={{ uri: item.displaypic }} />
                  </Left>
                   <Body>
                    <Text>{ item.displayname }</Text>
                     <Text note>{ item.status }</Text>
                  </Body>
                </ListItem>
            )
        }
            keyExtractor={item => item.user_id}
            />
     
    );
}
}

