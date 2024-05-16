import { View, Text, Modal, ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors } from '../assets/style'

const Loader = ({visible}) => {
  return (
    <Modal visible={visible} transparent >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size='large' color={Colors.primaryLight} />
        </View>
    </Modal>
  )
}

export default Loader