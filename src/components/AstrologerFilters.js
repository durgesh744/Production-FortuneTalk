import {
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../config/Screen';
import { Colors, Fonts, Sizes } from '../assets/style';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import {
  api_url,
  get_Offers,
  get_countries,
  get_language,
  get_skills,
} from '../config/constants';
import LinearGradient from 'react-native-linear-gradient';

const filtersTypes = [
  { id: 1, name: 'Sort & Filter', value: 'sort' },
  { id: 2, name: 'Skill', value: 'skill' },
  { id: 3, name: 'Language', value: 'language' },
  { id: 4, name: 'Gender', value: 'gender' },
  { id: 5, name: 'Country', value: 'country' },
  { id: 6, name: 'Offer', value: 'offer' },
];

const sortFiltersData = [
  { id: 1, name: 'Experience: High to Low', value: 'heigh_to_low_experience' },
  { id: 2, name: 'Experience: Low to High', value: 'low_to_high_experience' },
  { id: 3, name: 'Follower: High to Low', value: 'heigh_to_low_follower' },
  { id: 4, name: 'Follower: Low to High', value: 'low_to_high_follower' },
  { id: 5, name: 'Price: High to Low', value: 'heigh_to_low_price' },
  { id: 6, name: 'Price: Low to High', value: 'low_to_high_price' },
];

const genderData = [
  { id: 1, name: 'Male', value: 'Male' },
  { id: 2, name: 'Female', value: 'Female' },
];

const SortFilters = ({ selectedSortFilters, data, updateState }) => {
  const is_checked = value => {
    const checked = selectedSortFilters == value;
    return checked;
  };

  const on_select = value => {
    if (is_checked(value)) {
      updateState({ selectedSortFilters: '' });
    } else {
      updateState({ selectedSortFilters: value });
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => on_select(item?.value)}
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RadioButton
          value={is_checked(item?.value)}
          onPress={() => on_select(item?.value)}
          status={is_checked(item?.value) ? 'checked' : 'unchecked'}
        />
        <Text style={{ ...Fonts.gray14RobotoRegular }}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList data={sortFiltersData} renderItem={renderItem} />
    </View>
  );
};

const SkillFilters = ({ data, selectedSkillFilters, updateState }) => {
  const is_checked = id => {
    const checked = selectedSkillFilters.includes(id);
    return checked;
  };

  const on_select = id => {
    if (is_checked(id)) {
      let new_arr = selectedSkillFilters.filter(item => item != id);
      updateState({ selectedSkillFilters: new_arr });
    } else {
      updateState({ selectedSkillFilters: [...selectedSkillFilters, id] });
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => on_select(item?.id)}
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RadioButton
          value={is_checked(item?.id)}
          onPress={() => on_select(item?.id)}
          status={is_checked(item?.id) ? 'checked' : 'unchecked'}
        />
        <Text style={{ ...Fonts.gray14RobotoRegular }}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

const LanguageFilters = ({ data, selectedLangaugeFilters, updateState }) => {
  const is_checked = id => {
    const checked = selectedLangaugeFilters.includes(id);
    return checked;
  };

  const on_select = id => {
    if (is_checked(id)) {
      let new_arr = selectedLangaugeFilters.filter(item => item != id);
      console.log(new_arr);
      updateState({ selectedLangaugeFilters: new_arr });
    } else {
      updateState({ selectedLangaugeFilters: [...selectedLangaugeFilters, id] });
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => on_select(item?.name)}
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RadioButton
          value={is_checked(item?.name)}
          onPress={() => on_select(item?.name)}
          status={is_checked(item?.name) ? 'checked' : 'unchecked'}
        />
        <Text style={{ ...Fonts.gray14RobotoRegular }}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

const GenderFilter = ({ data, selectedGenderFilters, updateState }) => {
  const is_checked = value => {
    const checked = selectedGenderFilters == value;
    return checked;
  };

  const on_select = value => {
    if (is_checked(value)) {
      updateState({ selectedGenderFilters: '' });
    } else {
      updateState({ selectedGenderFilters: value });
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => on_select(item?.value)}
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RadioButton
          value={is_checked(item?.value)}
          onPress={() => on_select(item?.value)}
          status={is_checked(item?.value) ? 'checked' : 'unchecked'}
        />
        <Text style={{ ...Fonts.gray14RobotoRegular }}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

const CountryFilters = ({ data, selectedCountryFilters, updateState }) => {
  const is_checked = id => {
    const checked = selectedCountryFilters.includes(id);
    return checked;
  };

  const on_select = id => {
    if (is_checked(id)) {
      let new_arr = selectedCountryFilters.filter(item => item != id);
      console.log(new_arr);
      updateState({ selectedCountryFilters: new_arr });
    } else {
      updateState({ selectedCountryFilters: [...selectedCountryFilters, id] });
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => on_select(item?.id)}
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RadioButton
          value={is_checked(item?.id)}
          onPress={() => on_select(item?.id)}
          status={is_checked(item?.id) ? 'checked' : 'unchecked'}
        />
        <Text style={{ ...Fonts.gray14RobotoRegular }}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

const OfferFilters = ({ data, selectedOfferFilters, updateState }) => {
  const is_checked = id => {
    const checked = selectedOfferFilters.includes(id);
    return checked;
  };

  const on_select = id => {
    if (is_checked(id)) {
      let new_arr = selectedOfferFilters.filter(item => item != id);
      console.log(new_arr);
      updateState({ selectedOfferFilters: new_arr });
    } else {
      updateState({ selectedOfferFilters: [...selectedOfferFilters, id] });
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => on_select(item?.id)}
        style={{
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <RadioButton
          value={is_checked(item?.id)}
          onPress={() => on_select(item?.id)}
          status={is_checked(item?.id) ? 'checked' : 'unchecked'}
        />
        <Text style={{ ...Fonts.gray14RobotoRegular }}>{item?.offer_name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

const AstrologerFilters = ({
  filterVisible,
  updateState,
  selectedSkillFilters,
  selectedLangaugeFilters,
  selectedCountryFilters,
  selectedOfferFilters,
  selectedSortFilters,
  selectedGenderFilters,
  get_astrologer,
  activeFilter
}) => {
  const [state, setState] = useState({
    skillData: null,
    countryData: null,
    offersData: null,
    languageData: null,
    selectedFilter: 'sort',
  });

  useEffect(() => {
    get_astrologer_filters();
  }, []);

  const get_astrologer_filters = async () => {
    try {
      const skill_data = await axios.get(api_url + get_skills);
      const country_data = await axios.get(api_url + get_countries);
      const offers_data = await axios.get(api_url + get_Offers);
      const language_data = await axios.get(api_url + get_language);

      updateFiltersState({
        skillData: skill_data.data.data,
        countryData: country_data.data.data,
        offersData: offers_data.data.data,
        languageData: language_data.data.data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const on_reset = () => {
    updateState({
      selectedCountryFilters: [],
      selectedLangaugeFilters: [],
      selectedOfferFilters: [],
      selectedSkillFilters: [],
      selectedGenderFilters: '',
      selectedSortFilters: '',
    });
  };

  const on_apply = () => {
    updateState({ filterVisible: false });
    get_astrologer(activeFilter)
  };

  const active_filtes = type => {
    switch (type) {
      case 'sort': {
        return (
          <SortFilters
            data={sortFiltersData}
            updateState={updateState}
            selectedSortFilters={selectedSortFilters}
          />
        );
      }
      case 'skill': {
        return (
          <SkillFilters
            data={skillData}
            updateFiltersState={updateFiltersState}
            updateState={updateState}
            selectedSkillFilters={selectedSkillFilters}
          />
        );
      }
      case 'language': {
        return (
          <LanguageFilters
            data={languageData}
            updateState={updateState}
            selectedLangaugeFilters={selectedLangaugeFilters}
          />
        );
      }
      case 'gender': {
        return (
          <GenderFilter
            selectedGenderFilters={selectedGenderFilters}
            updateState={updateState}
            data={genderData}
          />
        );
      }
      case 'country': {
        return (
          <CountryFilters
            data={countryData}
            selectedCountryFilters={selectedCountryFilters}
            updateState={updateState}
          />
        );
      }
      case 'offer': {
        return (
          <OfferFilters
            data={offersData}
            updateState={updateState}
            selectedOfferFilters={selectedOfferFilters}
          />
        );
      }
    }
  };

  const updateFiltersState = data => {
    setState(prevState => {
      const newData = { ...prevState, ...data };
      return newData;
    });
  };

  const { skillData, countryData, offersData, selectedFilter, languageData } =
    state;

  return (
    <Modal
      visible={filterVisible}
      transparent
      onRequestClose={() => updateState({ filterVisible: false })}
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
      <TouchableWithoutFeedback
        onPress={() => updateState({ filterVisible: false })}>
        <View
          style={{
            position: 'absolute',
            width: SCREEN_WIDTH * 0.85,
            height: SCREEN_HEIGHT * 0.7,
            backgroundColor: Colors.white,
            top: Sizes.fixPadding * 5,
            right: Sizes.fixPadding * 2,
            borderRadius: Sizes.fixPadding,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowColor: Colors.blackLight,
          }}>
          <View
            style={{
              paddingVertical: Sizes.fixPadding,
              borderBottomWidth: 1,
              borderBottomColor: Colors.grayLight,
            }}>
            <Text style={{ ...Fonts.black18RobotoRegular, textAlign: 'center' }}>
              Sort & Filter
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                flex: 0.3,
                borderRightWidth: 1,
                borderRightColor: Colors.grayLight,
              }}>
              {filtersInfo()}
            </View>
            <View style={{ flex: 0.7 }}>{active_filtes(selectedFilter)}</View>
          </View>
          {buttonsInfo()}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  function buttonsInfo() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: Sizes.fixPadding,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => on_reset()}
          style={{ width: '30%' }}>
          <LinearGradient
            colors={[Colors.gray, Colors.gray]}
            style={{
              width: '100%',
              paddingVertical: Sizes.fixPadding * 0.6,
              borderRadius: 1000,
            }}>
            <Text style={{ ...Fonts.white16RobotoMedium, textAlign: 'center' }}>
              Reset
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => on_apply()}
          style={{ width: '30%' }}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primaryDark]}
            style={{
              width: '100%',
              paddingVertical: Sizes.fixPadding * 0.6,
              borderRadius: 1000,
            }}>
            <Text style={{ ...Fonts.white16RobotoMedium, textAlign: 'center' }}>
              Apply
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  function filtersInfo() {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={() => updateFiltersState({ selectedFilter: item.value })}
          style={{
            paddingHorizontal: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding * 1.5,
            borderBottomWidth: 1,
            borderBottomColor: Colors.grayLight,
          }}>
          <Text
            style={{
              ...Fonts.gray14RobotoRegular,
              color:
                selectedFilter == item.value
                  ? Colors.primaryLight
                  : Colors.gray,
            }}>
            {item?.name}
          </Text>
        </TouchableOpacity>
      );
    };

    return <FlatList data={filtersTypes} renderItem={renderItem} />;
  }
};

export default AstrologerFilters;
