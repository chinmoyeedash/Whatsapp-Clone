import { StackNavigator } from 'react-navigation';
import LoginScreen from '../LoginScreen';
import HomeScreen from './HomeScreen';
import ChatScreen from '../ChatScreen';
import ProfileScreen from '../ProfileScreen';
import ContactInfoScreen from '../ContactInfoScreen';
import ImageScreen from '../ImageScreen';

const LoginStack = StackNavigator({
    Login: { screen: HomeScreen },
     Home: { screen: HomeScreen },
     ChatScreen: { screen: ChatScreen },
     Profile: { screen: ProfileScreen },
     Contact: { screen: ContactInfoScreen },
     ImageScreen: { screen: ImageScreen }
    },
    {
        headerMode: 'none',
        mode: 'modal'
    });

export default LoginStack;
