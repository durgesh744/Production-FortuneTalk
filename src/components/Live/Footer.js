import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {Component} from 'react';
import {Input} from '@rneui/themed';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import AnimatedHeart from './AnimatedHeart';

export class Footer extends Component {
  constructor(props) {
    super(props);
    this.version = '';
    this.state = {
      message: '',
    };
  }
  render() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Sizes.fixPadding * 1.5,
          paddingVertical: Sizes.fixPadding,
          // backgroundColor: '#7D7973',
        }}>
        <Input
          value={this.state.message}
          placeholder="Say Hii..."
          placeholderTextColor={Colors.white}
          onChangeText={text => this.setState({message: text})}
          containerStyle={{
            height: 45,
            width: '85%',
            backgroundColor: Colors.black + '70',
            borderRadius: 1000,
          }}
          inputContainerStyle={{borderBottomWidth: 0}}
          inputStyle={{...Fonts.white16RobotoMedium}}
          rightIcon={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.setState({message: ''}),
                  this.props.sendMessage(this.state.message);
              }}>
              <Image
                source={require('../../assets/images/icons/send.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          }
        />
        <View style={{flex: 1}}>
          <AnimatedHeart
            addHeart={this.props.addHeart}
            removeHeart={this.props.removeHeart}
            hearts={this.props.hearts}
          />
        </View>
      </View>
    );
  }
}

export default Footer;
