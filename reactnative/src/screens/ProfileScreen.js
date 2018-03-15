import React, { Component } from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { Header, Container, Content, View, Body, Left, Right, Icon, Text, Button, Thumbnail, Card, Form, Label, Item, Input } from 'native-base';
import ImagePicker from 'react-native-image-picker';

import { updateUser, getUserFromId, uploadPicture, getPicture } from '../chatsappapi';

const defaultimgblob = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAB6CAMAAABHh7fWAAAAV1BMVEXp6ekyicju7Oomhccsh8fy7+sfg8bf4+cSgMU2i8nl5+ijwNqyyd3M2OPH1eKIsdVkn8+6zt/V3eRwpdGVuNdXmc2qxNtHkssAfcV9rNN4qNKOtdY9jsmdPwt6AAAEBElEQVRoge2aaZPaMAyGiSwfuUMOQiD//3fWAUop5LAtOzvt8M7szu4HeEaKpMiSD4evvvrqq6+++ur/FAAckkRqJbe/9+Me8lNZdWOs1XfNNasPu+ABjpdYCYZPMaX6Mueh4VxemWIYvQnZeUwTHhJcX8Qn90EX2CahLIdDi2ye+4DHWRg2FJ1YAd/hTR0ADumSq18lxqN3NgxbJv82PPUcbbDp7KdU6ZfdrcXXO3vwyIbKgqzZrbfnDaWxt+8SvpIMTpbkCDH3woYaDbLqjd0lXtCdNVm7/Ooh1CC1dfed7cHlib27J2FHNhtaq7x6Mbugmg3CyWhtdkU02z6xnjrXRLRLeN/FrjSP12dXcoQRCe0cZJPOpPyCytnf1LIiIwIaK4rRuXInRxgTCjkhtSYpQnrxkhBlGk1oEXlDeNQ6zlJ3NCnAdVGhNEpENKU3JaIprem/iyY4/AcjnA8/lteOLeETTXh1QUGp4RFKZ7J+c1Ecjh2BrE+YhDhjA6VVIL0/FOnQB4V7bxYJ4rkrdvY4NrSOFK7OHqdk9U3SNb0wph66nGspI1TRh2q3goYx/ZDrWMe9jFPk6OByVvkYpkBm73KM/cxKTWeULxInT9OrxGZWeCOXvmZ2IO1qmp8H/WDXyoLNep9zaZuxHes9gm/s3jDWBOVoO8+WjQkbRembfF+6bDqdBVq8QN6trz9QNDLQugn4KVqe4KHqi4BLNoBTP7Pcm9Z7qjoG3i0CFMOopo3mk4ooVN/WO2xUAWTRNn0s1E1s7Jq0TsKAP78UAJI6L45aRS2TUBtsSJamy3DTwsfom1WelNG5nDF8VSArVkpSuIMsp3gWfW71NTzTH2LnwR0OkD6Wxqiu5oZzWd2Tn4nW1l2/vyLv/tQPNp7MvgaSlyW3cCsykP1VslF02Tacy7R/rXeILt349b1kangq19IIoG7Ht0+hGKzJl5kDD4p4KObvgUyZnjVspsKLyjLPqvmXM6LCy6nmnD8zWv+h/8vTSiw0UaKzYa8tyqeKrbohzYq81sqPWXvp1XllJ4W9+Uxle12NjAnG9G/9I8RWC4HG3Rq/kKZlMzLtjiElTaxmJYxGlsRZ2YKMRjpOB8ttie3zHxj1vPbant8RdzwrElvbiNp9WLWhrasT/vPqhb2aYVCEI2+MVzhlGrspHFeMPoZI6T9i7WJhgT6k0dNL96eMXkkwwr0EQ2G8QCYtq820UMrhEtroxXJKuhxgqtn9E3GnZSicW3OGD7Ibepzp0/I9yLNrCd7u4e9pGfPh8bDl+wX96fF6F3A0cw/NZd7uiH6/HkTcVFvo4+YfD9OHzqGjt4ed7OVv/db++2FDsR/67QYDnPZ61B/3NghbU2s94+wX3nQ3D88Exh4AAAAASUVORK5CYII='
const imageurl = 'https://filestore.crawfish92.hasura-app.io/v1/file/';

export default class ProfileScreen extends Component {

    
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            displaypic: '',
            mobilenumber: '',
            status: '',
            displayname: '',
            dpBlob: ''
          };  

        this.setUserInfo = this.setUserInfo.bind(this);
    }

    componentWillMount() {
        this.setUserInfo();
    }

    setUserInfo = async () => {
        console.log('setting user info');
        AsyncStorage.getItem('user_id')
        .then(res => { 
          //this.setState({ user_id: res });
          console.log(res);
          return getUserFromId(res);
        }).then(oldUser => {
          console.log(oldUser);
          this.setState({
            user_id: oldUser[0].user_id,  
            mobilenumber: oldUser[0].mobilenumber, 
            displayname: oldUser[0].displayname,
            status: oldUser[0].status,
            displaypic: oldUser[0].displaypic 
          });
          console.log(imageurl + this.state.displaypic);
          AsyncStorage.setItem('user', JSON.stringify(oldUser[0])); 
          return getPicture(oldUser[0].displaypic);
        }).then(img => {
            console.log('imageresp', img);  
            this.setState({
                dpBlob: img
              });
        })
        .catch(error => console.log(error));
    }

    uploadPictureSetState = async (dp) => {
        const uploadResponse = await uploadPicture(dp, this.state.user_id);
        console.log('uploadResponse', uploadResponse); 
        this.setState({
            displaypic: uploadResponse.file_id,
            dpBlob: dp
            
        });
    }

    selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            //const source = { uri: response.uri };
    
            // You can also display the image using data:
            const source = { uri: `data:image/jpeg;base64,${response.data}` };
            console.log('source', source);
            // this.setState({
            //     displaypic: source.uri
            // });
            
            this.uploadPictureSetState(source.uri);
          }
        });
    }

    handleUpdatePressed = async () => {
        //this.setState({ username: user.displayname, status: user.status });
        const { navigate } = this.props.navigation;
        console.log(this.state.mobilenumber, this.state.displayname, this.state.displaypic, this.state.status);
        const updateResponse = await updateUser(this.state.mobilenumber, this.state.displayname, this.state.displaypic, this.state.status);
           
            if (updateResponse.status !== 200) {
              if (updateResponse.status === 504) {
                Alert.alert('Network Error', 'Check your internet connection');
              } else {
                Alert.alert('Error', `Unable to insert ${updateResponse.status}`);      
              }
            } else {
                AsyncStorage.getItem('user')
                .then(oldUser => {
                    console.log('updating async user');
                    const newUser = { 
                        mobilenumber: oldUser.mobilenumber, 
                        user_id: oldUser.user_id, 
                        displayname: this.state.displayname,
                        status: this.state.status,
                        displaypic: this.state.displaypic,
                        lastseen: oldUser.lastseen
                    };
                    AsyncStorage.setItem('user', newUser);
                    Alert.alert('Done', 'Update done', [
                        { text: 'OK', onPress: () => navigate('Home') },
                    ]);
                    });            
            }
          }
    
      handleDisplaynameChange = displayname => {
          this.setState({
              ...this.state,
              displayname
          });
      }
    
      handleStatusChange = status => {
          this.setState({
              ...this.state,
              status
          });
      }
    
    render() {
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
            <Body style={{ padding: 20 }}>
            <Button
                transparent
                style={{ height: 170, width: 170 }}
                onPress={() => this.props.navigation.navigate('ImageScreen', { dp: this.state.dpBlob })}
            >      
            <Thumbnail 
            style={{ height: 170, width: 170 }} 
            large 
            source={{ uri: this.state.dpBlob }}
            />
            </Button>
            <Button block rounded style={{ backgroundColor: 'darkorange' }} onPress={this.selectPhotoTapped.bind(this)} >
            <Text> Change Picture </Text>
        </Button>
            </Body>    
        </Card>

        <Form>
            <Item stackedLabel>
            <Label>Username</Label>
            {console.log(this.state.displayname)}
            <Input value={this.state.displayname} onChangeText={this.handleDisplaynameChange} />
            </Item>
            <Item stackedLabel>
            <Label>Status</Label>
            <Input value={this.state.status} onChangeText={this.handleStatusChange} />
            </Item>
        </Form>
        <View style={{ height: 10 }} />
        <Button block rounded style={{ backgroundColor: 'darkorange' }} onPress={this.handleUpdatePressed} >
            <Text> Update</Text>
        </Button>
        </Content>
        </Container>
    ); 
}
}
