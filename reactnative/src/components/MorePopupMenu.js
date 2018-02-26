import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, UIManager, findNodeHandle, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

const ICON_SIZE = 24;

export default class PopupMenu extends Component {
  static propTypes = {
    // array of strings, will be list items of Menu
    actions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onPress: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      icon: null
    };
  }

  onError() {
    console.log('Popup Error');
  }

  onPress = () => {
    if (this.state.icon) {
      UIManager.showPopupMenu(
        findNodeHandle(this.state.icon),
        this.props.actions,
        this.onError,
        this.props.onPress
      );
    }
  }
  onRef = icon => {
    if (!this.state.icon) {
      this.setState({ icon });
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <Icon
            name='more'
            size={ICON_SIZE}
            color={'white'}
            ref={this.onRef}
          />
        </TouchableOpacity>
      </View>
    );
  }

  
}
