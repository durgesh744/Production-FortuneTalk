import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {createThumbnail} from 'react-native-create-thumbnail';
import {ActivityIndicator} from 'react-native-paper';
import MyHeader from '../../components/MyHeader';
import MyStatusBar from '../../components/MyStatusBar';
import ImageView from '../../components/ImageView';
import VedioPlayer from '../../components/VedioPlayer';
import {Colors, Fonts, Sizes} from '../../assets/style';
import {SCREEN_WIDTH} from '../../config/Screen';
import {img_url_2} from '../../config/constants';

const VedioComponent = ({item, updateState}) => {
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    try {
      setImageLoading(true);
      createThumbnail({
        url: `http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/${item.video}`,
        timeStamp: 10000,
      })
        .then(response => setImageData(response.path), setImageLoading(false))
        .catch(err => console.log({err}), setImageLoading(false));
    } catch (e) {
      setImageLoading(false);
      console.log(e);
    }
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        updateState({
          vedioUri: `http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/${item.video}`,
          videoVisible: true,
        })
      }
      style={{
        width: SCREEN_WIDTH * 0.4,
        height: SCREEN_WIDTH * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding,
      }}>
      {imageLoading ? (
        <ActivityIndicator size="small" color={Colors.primaryDark} />
      ) : (
        <ImageBackground
          source={{
            uri: imageData,
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/icons/vedio_play.png')}
            style={{width: 40, height: 40}}
          />
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

const PoojaAstroUploads = ({navigation, route}) => {
  const [state, setState] = useState({
    poojaData: route?.params?.poojaData,
    imageVisible: false,
    image: null,
    vedioUri: null,
    videoVisible: false,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const {poojaData, imageVisible, image, vedioUri, videoVisible} = state;

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryDark}
        barStyle={'light-content'}
      />
      <View style={{flex: 1}}>
        {header()}
        <FlatList
          ListHeaderComponent={
            <>
              {topMessageInfo()}
              {astrologerInfo()}
              {photoGallaryInfo()}
              {vedioGallaryInfo()}
              {astroMessageInfo()}
            </>
          }
        />
      </View>
      <ImageView
        updateState={updateState}
        image={image}
        imageVisible={imageVisible}
      />
      <VedioPlayer
        videoVisible={videoVisible}
        updateState={updateState}
        uri={vedioUri}
      />
    </View>
  );

  function astroMessageInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.gray16RobotoMedium, marginBottom: Sizes.fixPadding}}>
          Message received from Astrologer
        </Text>

        <Text style={{...Fonts.gray12RobotoMedium, color: Colors.blackLight}}>
          {poojaData?.desc?.description}
        </Text>
      </View>
    );
  }

  function vedioGallaryInfo() {
    const renderItem = ({item, index}) => {
      return <VedioComponent item={item} updateState={updateState} />;
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.gray16RobotoMedium, marginBottom: Sizes.fixPadding}}>
          Videos
        </Text>
        <FlatList
          data={poojaData?.video}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{justifyContent: 'space-around'}}
        />
      </View>
    );
  }

  function photoGallaryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            updateState({
              image: `http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/${item.image}`,
              imageVisible: true,
            })
          }
          style={{width: SCREEN_WIDTH * 0.3, height: SCREEN_WIDTH * 0.3}}>
          <Image
            source={{
              uri:
                'http://fortunetest.fortunetalk.co.in/api/uploads/pooja_uploads/' +
                item.image,
            }}
            style={{width: '100%', height: '100%'}}
          />
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{...Fonts.gray16RobotoMedium, marginBottom: Sizes.fixPadding}}>
          Photos
        </Text>
        <FlatList
          data={poojaData?.pooja_image}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
        />
      </View>
    );
  }

  function astrologerInfo() {
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 1.5, marginTop: Sizes.fixPadding}}>
        <Text style={{...Fonts.primaryLight15RobotoMedium}}>Pooja Performed by</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
            paddingVertical: Sizes.fixPadding,
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 1000,
              borderWidth: 2,
              borderColor: Colors.white,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowColor: Colors.black,
              overflow: 'hidden',
            }}>
            <Image
              source={{uri: img_url_2 + poojaData?.astrologer?.img_url}}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <Text
            style={{
              ...Fonts.black16RobotoMedium,
              marginLeft: Sizes.fixPadding,
            }}>
            {poojaData?.astrologer?.owner_name}
          </Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.gray,
                paddingHorizontal: Sizes.fixPadding * 1.5,
                paddingVertical: Sizes.fixPadding * 0.5,
                borderRadius: 1000,
              }}>
              <Text style={{...Fonts.white14RobotoMedium}}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function topMessageInfo() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          borderBottomWidth: 1,
          borderColor: Colors.grayLight,
        }}>
        <Text
          style={{
            ...Fonts.white16RobotoMedium,
            textAlign: 'center',
            color: Colors.green_a,
          }}>
          Astro Disha ji has been Uploaded a Photos and Videos !
        </Text>
      </View>
    );
  }

  function header() {
    return <MyHeader navigation={navigation} title={'Details'} />;
  }
};

export default PoojaAstroUploads;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  child: {
    flex: 0.4,
    ...Fonts.black14RobotoRegular,
    fontSize: 13,
  },
  colon: {...Fonts.black16RobotoMedium},
  childValue: {
    flex: 0.6,
    ...Fonts.black14RobotoRegular,
    marginLeft: Sizes.fixPadding,
    fontSize: 13,
  },
});
