import {Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import { View, Text } from 'react-native'
import React, { FC } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Icon } from '@rneui/themed';
import { Colors } from '../../assets/style';

export type IconLibrary = {
  [key: string]: ()=>React.ComponentType<any>
}

const ICON_LIBRARIES: IconLibrary ={
  Feather: ()=>Feather,
  MaterialCommunityIcons: ()=>MaterialCommunityIcons
}

export type IconButtonProps = PressableProps & {
  icon: string;
  iconFamily?: 'Feather' | 'MaterialCommunityIcons';
  variant?: 'text' | 'contained' | 'outline';
  size?: 'small' | 'medium' | 'big';
  iconColor?: string;
  roundness?: 'full' | 'medium' | 'small';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};



const IconButton: FC<IconButtonProps> = ({
  icon,
  iconFamily = 'Feather',
  variant = 'contained',
  size = 'medium',
  iconColor = 'white',
  roundness = 'medium',
  style = {},
  onPress,
  ...rest
}: IconButtonProps) => {
  const Icon = ICON_LIBRARIES[iconFamily]();
  const iconSize = size === 'big' ? 24 : size === 'medium' ? 16 : 12
  const buttonSize = size === 'big' ? 48 : size === 'medium' ? 36 : 24
  const buttonStles = [
    styles.button,
    styles[`${variant}Button`],
    // styles[`${variant}Roundness`],
    // styles[`${variant}Roundness`],
    {width: buttonSize, height: buttonSize},
    style
  ]
  return (
    <Pressable
    {...rest}
    onPress={onPress}
    style={({pressed})=>[buttonStles, pressed && styles.buttonPressed, pressed && styles.shadow]}
    >
      <Icon name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  )
  
}

export default IconButton

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed:{
    opacity: 0.9
  },
  containedButton:{
    backgroundColor: '#2196F3'
  },
  textButton:{
    backgroundColor: 'transparent'
  },
  outlineButton:{
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3'
  },
  fullRoundness:{
    borderRadius: 100,
  },
  mediumRoundness:{
    borderRadius: 20
  },
  smallRoundness:{
    borderRadius: 10
  },
  shadow:{
    elevation: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowColor: Colors.blackLight
  }
})