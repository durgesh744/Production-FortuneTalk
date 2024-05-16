import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {FlatList} from 'react-native';

const Gallary = ({gallaryData, updateState}) => {
  const [isLoading, setIsLoading] = useState(false);
  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            updateState({
              imageVisible: true,
              imageURI: item[0],
            })
          }>
          <Image
            source={{uri: item[0]}}
            style={{
              width: 70,
              height: 70,
              margin: 5,
              borderRadius: Sizes.fixPadding,
            }}
          />
        </TouchableOpacity>
        {item.length > 0 && (
          <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            updateState({
              imageVisible: true,
              imageURI: item[1],
            })
          }
          >
                <Image
            source={{uri: item[1]}}
            style={{
              width: 70,
              height: 70,
              margin: 5,
              borderRadius: Sizes.fixPadding,
            }}
          />
          </TouchableOpacity>
      
        )}
      </View>
    );
  };
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayLight,
      }}>
      <Text
        style={{
          ...Fonts.black16RobotoMedium,
          paddingHorizontal: Sizes.fixPadding * 1.5,
          paddingTop: Sizes.fixPadding * 1.5,
        }}>
        Gallery
      </Text>
      <FlatList
        data={gallaryData}
        renderItem={renderItem}
        // keyExtractor={item => item.id}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: Sizes.fixPadding * 1.5,
          paddingBottom: Sizes.fixPadding * 1.5,
        }}
      />
    </View>
  );
};

export default Gallary;
