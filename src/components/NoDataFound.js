import { View, Text } from 'react-native'
import React from 'react'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../config/Screen'
import { Sizes, Fonts } from '../assets/style'

const NoDataFound = ({}) => {
  return (
    <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT*0.6, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={Fonts.primaryLight18RighteousRegular} >No Data Found...</Text>
    </View>
  )
}

export default NoDataFound