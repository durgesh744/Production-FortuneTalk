import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts, Sizes} from '../../assets/style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MyStatusBar from '../../components/MyStatusBar';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/Screen';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import Carousel from 'react-native-reanimated-carousel';
import {
  api_url,
  img_url,
  get_horoscope,
  free_insight_banner,
  api2_get_vdasha,
  api2_get_sub_vdasha,
  api2_get_sub_sub_vdasha,
  api2_get_sub_sub_sub_vdasha,
  api2_get_sub_sub_sub_sub_vdasha,
  api2_get_current_vdasha,
} from '../../config/constants';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';


const planet = [
  {
    id: 1,
    name: 'Vimshottari Dasha',
  },
  {
    id: 2,
    name: 'Antar Dasha',
  },
  {
    id: 3,
    name: 'PratyantraDasha',
  },
  {
    id: 4,
    name: 'Sookshma Dasha',
  },
  {
    id: 5,
    name: 'Prana',
  },
];

const labels = [
  'Vimshottari Dasha',
  'Antar Dasha',
  'Pratyantar Dasha',
  'Sookshma Dasha',
  'Prana Dasha',
];

const categoryData = [
  {
    id: 1,
    title: 'Current Vimshottari Dasha',
  },
  {
    id: 2,
    title: 'Vimshottari Dasha',
  },
];

const customStyle = {
  stepIndicatorSize: 25,
  stepCount: 5,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013',
};

const VimshottariDasha = (props) => {
  console.log(props.route.pramas)
  const [currentPosition, setCurrentPosition] = useState(0);
  const [show, setShow] = useState(true);
  const [state, setState] = useState({
    showNavigation: false,
    selectedItem: 1,
    isloading: false,
    dasha: 1,
    current_vdasha: null,
    vmahaDasha: null,
    sub_vdasha: null,
    sub_sub_vdasha: null,
    sub_sub_sub_vdasha: null,
    sub_sub_sub_sub_vdasha: null,
    planet1: null,
    planet2: null,
    planet3: null,
    planet4: null,
  });

  const updateState = data => {
    setState(prevState => {
      const newData = {...prevState, ...data};
      return newData;
    });
  };

  const handle1 = planet1 => {
    updateState({planet1: planet1});
    updateState({showNavigation: false});
    updateState({dasha: 2});
    get_antra_dasha(planet1);
  };

  const handle2 = (planet1, planet2) => {
    updateState({planet2: planet2});
    updateState({dasha: 3});
    get_pratyantar_dasha(planet1, planet2);
  };

  const handle3 = (planet1, planet2, planet3) => {
    console.log('asdfas', planet1, planet2, planet3);
    updateState({planet3: planet3});
    updateState({dasha: 4});
    get_sookshma_dasha(planet1, planet2, planet3);
  };

  const handle4 = (planet1, planet2, planet3, planet4) => {
    console.log(planet1, planet2, planet3, planet4);
    updateState({planet4: planet4});
    updateState({dasha: 5});
    get_prana_dasha(planet1, planet2, planet3, planet4);
  };

  useEffect(() => {
    get_vimshottari_mahadasha();
    get_vimshottari_dasha();
  }, []);

  const get_vimshottari_mahadasha = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + api2_get_current_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
      },
    })
      .then(res => {
        console.log('tfhtrd======>', res.data);
        updateState({
          current_vdasha: res.data.current_vdasha,
        });
        updateState({isLoading: false});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const get_vimshottari_dasha = async () => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + api2_get_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id
      },
    })
      .then(res => {
        console.log('vimshottari=======>', res.data);
        updateState({vmahaDasha: res.data.major_vdasha});
        updateState({isLoading: false});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const get_antra_dasha = async planet1 => {
    updateState({isLoading: true});
    console.log('asdf', planet1);
    await axios({
      method: 'post',
      url: api_url + api2_get_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
        planet_name: planet1,
      },
    })
      .then(res => {
        console.log('antra========>', res.data);
        updateState({sub_vdasha: res.data.sub_vdasha});
        updateState({isLoading: false});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const get_pratyantar_dasha = async (planet1, planet2) => {
    updateState({isLoading: true});
    console.log('asffd', planet1, planet2);
    await axios({
      method: 'post',
      url: api_url + api2_get_sub_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
        planet_name1: planet1,
        planet_name2: planet2,
      },
    })
      .then(res => {
        console.log('pratyantar=====>', res.data);
        updateState({sub_sub_vdasha: res.data.sub_sub_vdasha});
        updateState({isLoading: false});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const get_sookshma_dasha = async (planet1, planet2, planet3) => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + api2_get_sub_sub_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
        planet_name1: planet1,
        planet_name2: planet2,
        planet_name3: planet3,
      },
    })
      .then(res => {
        console.log('sookshma=====>', res.data);
        updateState({sub_sub_sub_vdasha: res.data.sub_sub_sub_vdasha});
        updateState({isLoading: false});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const get_prana_dasha = async (planet1, planet2, planet3, planet4) => {
    updateState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + api2_get_sub_sub_sub_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.id,
        planet_name1: planet1,
        planet_name2: planet2,
        planet_name3: planet3,
        planet_name4: planet4,
      },
    })
      .then(res => {
        console.log('prana=====', res.data);
        updateState({sub_sub_sub_sub_vdasha: res.data.sub_sub_sub_sub_vdasha});
        updateState({isLoading: false});
      })
      .catch(err => {
        console.log(err);
        updateState({isLoading: false});
      });
  };

  const {
    showNavigation,
    selectedItem,
    dasha,
    vmahaDasha,
    sub_vdasha,
    sub_sub_vdasha,
    sub_sub_sub_vdasha,
    sub_sub_sub_sub_vdasha,
    planet1,
    planet2,
    planet3,
    planet4,
    isLoading,
    current_vdasha,
  } = state;

  console.log('dsddd', sub_sub_vdasha);

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyColor}}>
      <MyStatusBar
        backgroundColor={Colors.primaryLight}
        barStyle={'light-content'}
      />
      <Loader visible={isLoading} />
      {header()}
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={
            <>
              {vimshottariInfo()}
              {categoryInfo()}
              {dasha != 1 ? showtext() : null}
              {selectedItem == 1
                ? currentVimshottari()
                : dasha == 1
                ? vimshottariData()
                : dasha == 2
                ? antarDasha()
                : dasha == 3
                ? prayantarDasha()
                : dasha == 4
                ? sookshmaDasha()
                : dasha == 5
                ? prana()
                : null}
            </>
          }
        />
      </View>
    </View>
  );

  function showtext() {
    return (
      <ScrollView horizontal={true}>
        <View
          style={{
            width: '100%',
            marginHorizontal: Sizes.fixPadding * 2,
            marginTop: Sizes.fixPadding,
          }}>
          {dasha == 2 ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{...Fonts.gray14RobotoMedium}}>
                Vimshottari Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.primaryLight14RobotoRegular}}>
                {' '}Antar Dasha{' '}
              </Text>
            </View>
          ) : dasha == 3 ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{...Fonts.gray14RobotoMedium}}>
              Vimshottari Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.gray14RobotoMedium}}>
              {' '}Antar Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.primaryLight14RobotoRegular}}>
                {' '}Pratyantar Dasha
              </Text>
            </View>
          ) : dasha == 4 ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{...Fonts.gray14RobotoMedium}}>
              Vimshottari Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.gray14RobotoMedium}}>
              {' '}Antar Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.gray14RobotoMedium}}>
                {' '}Pratyantar Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.primaryLight14RobotoRegular}}>
                {' '}Sookshma Dasha
              </Text>
            </View>
          ) : dasha == 5 ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{...Fonts.gray14RobotoMedium}}>
              Vimshottari Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.gray14RobotoMedium}}>
              {' '}Antar Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.gray14RobotoMedium}}>
                {' '}Pratyantar Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.gray14RobotoMedium}}>
                {' '}Sookshma Dasha{' '}
              </Text>
              <Entypo name="arrow-right" size={20} />
              <Text style={{...Fonts.primaryLight14RobotoRegular}}>
                {' '}Sookshma Dasha
              </Text>
            </View>
          ) : (
            null
          )}
        </View>
      </ScrollView>
    );
  }

  function prana() {
    const renderItem = ({item, index}) => {
      return (
        <View
          key={index}
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: Colors.gray,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 2,
            marginTop: Sizes.fixPadding * 0.25,
          }}>
          <Text style={{...Fonts.gray12RobotoMedium}}>
            {planet1.slice(0, 2).toUpperCase()}-
            {planet2.slice(0, 2).toUpperCase()}-
            {planet3.slice(0, 2).toUpperCase()}-
            {planet4.slice(0, 2).toUpperCase()}-
            {item.planet.slice(0, 2).toUpperCase()}
          </Text>
          <Text style={{...Fonts.gray12RobotoMedium}}>{item.end}</Text>
          <TouchableOpacity
            onPress={() => updateState({showNavigation: true, dasha: 4})}>
            <AntDesign name="left" size={20} style={{alignItems: 'center'}} />
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View>
        <View
          style={{
            marginTop: Sizes.fixPadding,
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            borderTopRightRadius: Sizes.fixPadding * 2,
            borderTopLeftRadius: Sizes.fixPadding * 2,
            borderColor: Colors.grayA,
            borderWidth: 1,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Planet
          </Text>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Date & Time
          </Text>
        </View>
        <FlatList
          data={sub_sub_sub_sub_vdasha}
          renderItem={renderItem}
          key={item => item.id}
        />
      </View>
    );
  }

  function sookshmaDasha() {
    const renderItem = ({item, index}) => {
      return (
        <View
          key={index}
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: Colors.gray,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 2,
            marginTop: Sizes.fixPadding * 0.25,
          }}>
          <Text style={{...Fonts.gray12RobotoMedium}}>
            {planet1.slice(0, 2).toUpperCase()}-
            {planet2.slice(0, 2).toUpperCase()}-
            {planet3.slice(0, 2).toUpperCase()}-
            {item.planet.slice(0, 2).toUpperCase()}
          </Text>
          <Text style={{...Fonts.gray12RobotoMedium}}>{item.end}</Text>
          {showNavigation ? (
            <TouchableOpacity onPress={() => updateState({dasha: 3})}>
              <AntDesign name="left" size={20} style={{alignItems: 'center'}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handle4(planet1, planet2, planet3, item.planet)}>
              <AntDesign
                name="right"
                size={20}
                style={{alignItems: 'center'}}
              />
            </TouchableOpacity>
          )}
        </View>
      );
    };
    return (
      <View>
        <View
          style={{
            marginTop: Sizes.fixPadding,
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            borderTopRightRadius: Sizes.fixPadding * 2,
            borderTopLeftRadius: Sizes.fixPadding * 2,
            borderColor: Colors.grayA,
            borderWidth: 1,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Planet
          </Text>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Date & Time
          </Text>
        </View>
        <FlatList
          data={sub_sub_sub_vdasha}
          renderItem={renderItem}
          key={item => item.id}
        />
      </View>
    );
  }

  function prayantarDasha() {
    const renderItem = ({item, index}) => {
      return (
        <View
          key={index}
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: Colors.gray,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 2,
            marginTop: Sizes.fixPadding * 0.25,
          }}>
          <Text style={{...Fonts.gray12RobotoMedium}}>
            {planet1.slice(0, 2).toUpperCase()}-
            {planet2.slice(0, 2).toUpperCase()}-
            {item.planet.slice(0, 2).toUpperCase()}
          </Text>
          <Text style={{...Fonts.gray12RobotoMedium}}>{item.end}</Text>
          {showNavigation ? (
            <TouchableOpacity onPress={() => updateState({dasha: 2})}>
              <AntDesign name="left" size={20} style={{alignItems: 'center'}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handle3(planet1, planet2, item.planet)}>
              <AntDesign
                name="right"
                size={20}
                style={{alignItems: 'center'}}
              />
            </TouchableOpacity>
          )}
        </View>
      );
    };
    return (
      <View>
        <View
          style={{
            marginTop: Sizes.fixPadding,
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            borderTopRightRadius: Sizes.fixPadding * 2,
            borderTopLeftRadius: Sizes.fixPadding * 2,
            borderColor: Colors.grayA,
            borderWidth: 1,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Planet
          </Text>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Date & Time
          </Text>
        </View>
        <FlatList
          data={sub_sub_vdasha}
          renderItem={renderItem}
          key={item => item.id}
        />
      </View>
    );
  }

  function antarDasha() {
    const renderItem = ({item, index}) => {
      return (
        <View
          key={index}
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: Colors.gray,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 2,
            marginTop: Sizes.fixPadding * 0.25,
          }}>
          <Text style={{...Fonts.gray12RobotoMedium}}>
            {planet1.substring(0, 2).toUpperCase()}-
            {item.planet.substring(0, 2).toUpperCase()}
          </Text>
          <Text style={{...Fonts.gray12RobotoMedium}}>{item.end}</Text>
          {showNavigation ? (
            <TouchableOpacity onPress={() => updateState({dasha: 1})}>
              <AntDesign name="left" size={20} style={{alignItems: 'center'}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handle2(planet1, item.planet)}>
              <AntDesign
                name="right"
                size={20}
                style={{alignItems: 'center'}}
              />
            </TouchableOpacity>
          )}
        </View>
      );
    };
    return (
      <View>
        <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            flexDirection: 'row',
            borderTopRightRadius: Sizes.fixPadding * 2,
            borderTopLeftRadius: Sizes.fixPadding * 2,
            borderColor: Colors.grayA,
            borderWidth: 1,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 1.5,
            marginTop: Sizes.fixPadding,
          }}>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Planet
          </Text>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Date & Time
          </Text>
        </View>
        <FlatList
          data={sub_vdasha}
          renderItem={renderItem}
          key={item => item.id}
        />
      </View>
    );
  }

  function vimshottariData() {
    const renderItem = ({item, index}) => {
      return (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: Colors.gray,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 2,
            marginTop: Sizes.fixPadding * 0.25,
          }}>
          <Text style={{...Fonts.gray12RobotoMedium}}>
            {item.planet.slice(0, 2)}
          </Text>
          <Text style={{...Fonts.gray12RobotoMedium}}>{item.end}</Text>
          <TouchableOpacity onPress={() => handle1(item.planet)}>
            <AntDesign name="right" size={20} style={{alignItems: 'center'}} />
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <View
          style={{
            flexDirection: 'row',
            borderTopRightRadius: Sizes.fixPadding * 2,
            borderTopLeftRadius: Sizes.fixPadding * 2,
            borderColor: Colors.grayA,
            borderWidth: 1,
            paddingVertical: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding * 1.5,
          }}>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Planet
          </Text>
          <Text style={{...Fonts.primaryLight14RobotoMedium, width: '50%'}}>
            Date & Time
          </Text>
        </View>
        <FlatList
          data={vmahaDasha}
          renderItem={renderItem}
          key={item => item.id}
        />
      </View>
    );
  }

  function currentVimshottari() {
    // const renderItem = ({item, index}) => {
      return (
        current_vdasha && (
          <View>
        <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black14InterMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Vimshottari Mahadasha
          </Text>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: Sizes.fixPadding * 2,
              borderWidth: 1,
              borderColor: Colors.grayA,
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{textAlignVertical: 'center', width: '50%'}}>
              {current_vdasha.major.planet}
            </Text>
            <View style={{width: '48%', alignItems: 'flex-end'}}>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.major.start}</Text>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.major.end}</Text>
            </View>
          </View>
        </View>
        <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{
            ...Fonts.black14InterMedium,
            marginBottom: Sizes.fixPadding,
          }}>
          Antar Dasha
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: Sizes.fixPadding * 2,
            borderWidth: 1,
            borderColor: Colors.grayA,
            paddingHorizontal: Sizes.fixPadding * 1.5,
            paddingVertical: Sizes.fixPadding * 0.5,
          }}>
          <Text style={{textAlignVertical: 'center', width: '50%'}}>
            {current_vdasha.minor.planet}
          </Text>
          <View style={{width: '48%', alignItems: 'flex-end'}}>
            <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.minor.start}</Text>
            <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.minor.end}</Text>
          </View>
        </View>
      </View>
      <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black14InterMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Pratyantar Dasha
          </Text>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: Sizes.fixPadding * 2,
              borderWidth: 1,
              borderColor: Colors.grayA,
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{textAlignVertical: 'center', width: '50%'}}>
              {current_vdasha.sub_minor.planet}
            </Text>
            <View style={{width: '48%', alignItems: 'flex-end'}}>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.sub_minor.start}</Text>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.sub_minor.end}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black14InterMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Sookshma Dasha
          </Text>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: Sizes.fixPadding * 2,
              borderWidth: 1,
              borderColor: Colors.grayA,
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{textAlignVertical: 'center', width: '50%'}}>
              {current_vdasha.sub_sub_minor.planet}
            </Text>
            <View style={{width: '48%', alignItems: 'flex-end'}}>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.sub_sub_minor.start}</Text>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.sub_sub_minor.end}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            marginHorizontal: Sizes.fixPadding * 2,
            marginVertical: Sizes.fixPadding,
          }}>
          <Text
            style={{
              ...Fonts.black14InterMedium,
              marginBottom: Sizes.fixPadding,
            }}>
            Prana Dasha
          </Text>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: Sizes.fixPadding * 2,
              borderWidth: 1,
              borderColor: Colors.grayA,
              paddingHorizontal: Sizes.fixPadding * 1.5,
              paddingVertical: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{textAlignVertical: 'center', width: '50%'}}>
              {current_vdasha.sub_sub_sub_minor.planet}
            </Text>
            <View style={{width: '48%', alignItems: 'flex-end'}}>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.sub_sub_sub_minor.start}</Text>
              <Text style={{...Fonts.gray12RobotoMedium}}>{current_vdasha.sub_sub_sub_minor.end}</Text>
            </View>
          </View>
        </View>
      </View>
        )
      );
    // };
    // return (
    //   <View>
    //     <FlatList
    //       data={current_vdasha}
    //       renderItem={renderItem}
    //       key={item => item.id}
    //     />
    //   </View>
    // );
  }

  function categoryInfo() {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({selectedItem: item.id})}>
          <LinearGradient
            colors={
              selectedItem == item.id
                ? [Colors.primaryLight, Colors.primaryDark]
                : [Colors.grayLight, Colors.whiteDark]
            }
            style={{
              width: SCREEN_WIDTH * 0.5,
              paddingVertical: Sizes.fixPadding * 0.8,
              marginRight: Sizes.fixPadding * 2,
              borderRadius: 1000,
            }}>
            <Text
              style={
                selectedItem == item.id
                  ? {...Fonts.white14RobotoRegular, textAlign: 'center'}
                  : {...Fonts.black14RobotoRegular, textAlign: 'center'}
              }>
              {item.title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          paddingVertical: Sizes.fixPadding,
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <FlatList
          data={categoryData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: Sizes.fixPadding * 2}}
        />
      </View>
    );
  }

  function vimshottariInfo() {
    return (
      <View
        style={{
          width: SCREEN_WIDTH * 0.9,
          marginHorizontal: Sizes.fixPadding * 2,
          marginVertical: Sizes.fixPadding,
        }}>
        <Text
          style={{
            ...Fonts.gray16RobotoMedium,
            color: Colors.grayA,
            marginBottom: Sizes.fixPadding * 0.5,
          }}>
          Vimshottari Dash
        </Text>
        <Text style={{...Fonts.gray14RobotoMedium, color: Colors.grayMedium}}>
          Vimshottari dasha is Moon based dasha cycle with 120 years time period. It has 5 levels starting with major dasha and ending with Pran Dasha.
        </Text>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          padding: Sizes.fixPadding * 1.5,
          ...styles.row,
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.grayLight,
        }}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={{
            position: 'absolute',
            zIndex: 99,
            padding: Sizes.fixPadding * 1.5,
          }}>
          <AntDesign
            name="leftcircleo"
            color={Colors.primaryLight}
            size={Sizes.fixPadding * 2.2}
          />
        </TouchableOpacity>
        <Text
          style={{
            ...Fonts.primaryLight15RobotoMedium,
            textAlign: 'center',
            flex: 1,
          }}>
          Vimshottari Dasha
        </Text>
      </View>
    );
  }
};

export default VimshottariDasha;

const styles = StyleSheet.create({
  row: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
