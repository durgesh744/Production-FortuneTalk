import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import VideoPlayer from 'react-native-video-controls';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createThumbnail} from 'react-native-create-thumbnail';
import { Colors, Fonts, Sizes } from '../../assets/style';
import { SCREEN_WIDTH } from '../../config/Screen';

export class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      duration: 0,
      currentTime: 0,
      play: false,
      thumbnailImage: null,
    };
  }

  componentDidMount(){
    this.onLoadiThumbnail()
  }

  onLoadiThumbnail = async () => {
    try {
      createThumbnail({
        url: this.props.uri,
        timeStamp: 10000,
      })
        .then(response => {
          this.setState(prevState=>({thumbnailImage: response.path}))
        })
        .catch(err => console.log({err}));
    } catch (e) {
      console.log(e);
    }
  };

  onBuffer = ({isBuffering}) => {
    if (isBuffering) {
      this.setState({paused: true});
    }
  };

  onLoad = data => {
    this.setState(prevState => ({...prevState, duration: data.duration}));
  };

  onEnd = () => {
    this.setState({paused: true, currentTime: 0});
  };

  onProgress = data => {
    this.setState({currentTime: data.currentTime});
    console.log(data);
  };

  onPlayPausePress = () => {
    this.setState(prevState => ({paused: !prevState.paused}));
  };

  onPlay = () => {
    this.setState(prevState => ({play: true}));
  };

  render() {
    const {uri} = this.props;
    const onPlay = this.onPlay;
    const {thumbnailImage} = this.state
    return (
      <View style={styles.container}>
        {this.state.play ? (
          <VideoPlayer
            source={{uri: uri}}
            ref={ref => {
              this.player = ref;
            }}
            paused={this.state.paused}
            fullscreen={false}
            controls={true}
            videoStyle={styles.video}
            style={{
              width: '100%',
              height: '100%',
              alignSelf: 'center',
            }}
          />
        ) : (
          thumbnailInfo()
        )}
      </View>
    );

    function thumbnailInfo() {
      return (
        <ImageBackground
          source={{uri: thumbnailImage}}
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => onPlay()}
            style={{
              backgroundColor: '#0000004d',
              padding: 5,
              borderRadius: 99,
            }}>
            <Ionicons
              name="play"
              size={SCREEN_WIDTH * 0.08}
              color={Colors.white}
            />
          </TouchableOpacity>
        </ImageBackground>
      );
    }
  }
}

export default Video;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.5,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding,
    overflow: 'hidden',
    marginTop: Sizes.fixPadding,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.black,
  },
  progressContainer: {
    backgroundColor: 'gray',
    height: 10,
  },
  progressBar: {
    backgroundColor: 'red',
    height: 10,
  },
});
