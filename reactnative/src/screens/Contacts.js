import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem, Thumbnail, Text, Body, Left } from 'native-base';
import { getContacts } from '../chatsappapi';

//The bubbles that appear on the left or the right for the messages.

const user_id = 0;

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
        console.log(contacts);
        
        // React will automatically rerender the component when a new message is added.
        this.setState({ contacts });
    }
    
    handlePress(item) {
        const { navigate } = this.props.navigation;
        console.log(item.friend_id);
        user_id = this.props.user_id;
        console.log(user_id);
        const friend = item;
        navigate('ChatScreen', { user_id, friend });
    }

render() {
    const imageurl = 'https://filestore.crawfish92.hasura-app.io/v1/file/';
    return (
            <FlatList
            data={this.state.contacts}
            renderItem={({ item }) => 
            (
                <ListItem avatar button onPress={() => this.handlePress(item)}>
                <Left>
                   <Thumbnail source={{ uri: imageurl + item.displaypic }} />
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

