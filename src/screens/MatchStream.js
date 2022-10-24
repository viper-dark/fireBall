import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar,
  Button,
  Alert,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import SelectList from 'react-native-dropdown-select-list';
import Dialog from 'react-native-dialog';

const Vi = ({navigation, referer, source}) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isFullScreen, setFullScreen] = useState(false);

  const [dimention, setDimention] = useState({
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  });

  const flipDimentions = () => {
    setDimention({
      height: Dimensions.get('screen').width,
      width: Dimensions.get('screen').height,
    });
  };
  function handleOrientation(orientation) {
    flipDimentions();
  }

  useEffect(() => {
    // This would be inside componentDidMount()
    Orientation.addOrientationListener(handleOrientation);

    return () => {
      // This would be inside componentWillUnmount()
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  return (
    <View
      style={[
        isFullScreen
          ? {
              width: dimention.width,
              height: dimention.height,
              backgroundColor: 'black',
              position: 'absolute',
              zIndex: 3, // works on ios
              elevation: 3, // works on android
            }
          : styles.video,
      ]}>
      <VideoPlayer
        source={{
          uri: source,
          headers: {referer},
          overrideFileExtensionAndroid: 'm3u8',
        }}
        onPlaybackStatusUpdate={status => {
          setStatus(status);
        }}
        ref={ref => (video.current = ref)}
        toggleResizeModeOnFullscreen={false}
        navigator={navigation}
        resizeMode={'contain'}
        onError={error => {
          console.log(error);
        }}
        onEnterFullscreen={() => {
          setFullScreen(true);
          StatusBar.setHidden(true);
          navigation.setOptions({headerShown: false});
        }}
        onExitFullscreen={() => {
          setFullScreen(false);
          StatusBar.setHidden(false);
          navigation.setOptions({headerShown: true});
        }}
      />
    </View>
  );
};

const Stream = ({source, referer, children}) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isFullScreen, setFullScreen] = useState(false);
  console.log('width and height screen:');
  console.log(Dimensions.get('screen'));
  console.log('width and height window:');
  console.log(Dimensions.get('window'));

  return (
    <View>
      <View
        style={[
          isFullScreen
            ? {
                height: Dimensions.get('screen').height,
                width: Dimensions.get('screen').width,
                position: 'absolute',
                backgroundColor: 'green',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }
            : styles.video,
        ]}>
        <VideoPlayer
          source={{
            uri: 'https://a-c-1.dayimage.net/_v5/95f871c87d40acb41481349bf935b1e5768bf71fc48ac5680bd412cdc7d012c3fea73a04f669830b2cfb7921aa86c24f0992375ea5b2d69f9ceabfbe792d336f82bc760bb9fa14441259cfc6d354fe8218e15ba7190da213b4adfe868cb1aa92feb86b762008f8988c83fa6013467c805060cec1510baad36565cba32dcc5219/index-f3-v1-a1.m3u8',
            // headers: {referer: referer},
            overrideFileExtensionAndroid: 'm3u8',
          }}
          onPlaybackStatusUpdate={status => {
            setStatus(status);
          }}
          ref={video}
          toggleResizeModeOnFullscreen={false}
          //navigator={this.props.navigator}
          resizeMode={'contain'}
          onError={error => console.log(error)}
          onEnterFullscreen={() => {
            setFullScreen(true);
            StatusBar.setHidden(true);

            console.log('full screeeeeen');
          }}
          onExitFullscreen={() => {
            setFullScreen(false);
            StatusBar.setHidden(false);
            console.log('exit  the full screeeeeen');
          }}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        />
        {children}
      </View>
    </View>
  );
};

const MatchStream = ({navigation, route}) => {
  const {matchDescription, logoUrl1, logoUrl2} = route.params;
  const [selected, setSelected] = React.useState('');
  const [selectedServer, setSelectedServer] = React.useState(0);
  //modal/alert state
  const [visible, setVisible] = useState(false);

  const data = useRef(null);
  const [loaded, setLoaded] = useState(null);
  const [server, setServer] = useState('server1');
  const [vedioData, setvedioData] = useState(null);

  const server_data = [
    {key: 0, value: 'server1'},
    {key: 1, value: 'server2'},
  ];

  useEffect(() => {
    setLoaded(false);
    fetch(
      `${'https://stream-scraper.vercel.app/'}matchLink?server=${server}&teams=${matchDescription.replace(
        'VS',
        ',',
      )}`,
    )
      .then(res => {
        if (!res.ok) {
          //trying the second server if the user haven't
          if (server == 'server1') {
            setServer('server2');
            return;
          }
          //alerting the user that the game hasn't started yet
          setVisible(true);
          throw new Error('no match link found for ' + matchDescription);
        }
        return res.json();
      })
      .then(Data => {
        data.current = Data.m3u8Data;

        setvedioData(data.current[0]);
        setLoaded(true);
      })
      .catch(error => {
        console.log(error);
      });
    return () => {
      (data.current = null), setvedioData(null);
      setLoaded(false);
    };
  }, [server]);

  const btnHandeler = index => {
    setvedioData(data.current[index]);
  };

  const dropDownData = () =>
    data.current.map((el, index) => {
      return {key: index, value: el.quality};
    });

  return (
    <View style={styles.container}>
      <View style={styles.matchdescContainer}>
        <Image
          style={[styles.team_logo]}
          source={{
            uri: logoUrl1,
          }}
        />
        <Text style={styles.matchdesc}>
          {matchDescription.replace('VS', ' VS ')}
        </Text>
        <Image
          style={[styles.team_logo]}
          source={{
            uri: logoUrl2,
          }}
        />
      </View>

      {!loaded ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <Vi
          navigation={navigation}
          source={vedioData.m3u8Link}
          referer={vedioData.referer}></Vi>
      )}
      {loaded && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',

            marginTop: 10,
          }}>
          <SelectList
            onSelect={() => btnHandeler(selected)}
            setSelected={setSelected}
            data={dropDownData()}
            /* arrowicon={
              <FontAwesome name="chevron-down" size={12} color={'black'} />
            } */
            //searchicon={<FontAwesome name="search" size={12} color={'black'} />}
            search={false}
            boxStyles={{
              borderRadius: 4,
              //width: 130,
              // alignSelf: 'center',
              margin: 10,
            }}
            dropdownStyles={{
              width: 130,
              //  alignSelf: 'center'
            }}
            //override default styles
            defaultOption={dropDownData()[0]} //default selected option
          />
          <SelectList
            onSelect={() =>
              setServer(selectedServer === 0 ? 'server1' : 'server2')
            }
            setSelected={setSelectedServer}
            data={server_data}
            /* arrowicon={
              <FontAwesome name="chevron-down" size={12} color={'black'} />
            } */
            //searchicon={<FontAwesome name="search" size={12} color={'black'} />}
            search={false}
            boxStyles={{
              borderRadius: 4,

              margin: 10,
            }}
            dropdownStyles={{
              width: 130,
              //  alignSelf: 'center'
            }}
            //override default styles
            defaultOption={server_data.find(e => e.value == server)} //default selected option
          />
        </View>
      )}
      <Dialog.Container visible={visible} contentStyle={{borderRadius: 10}}>
        <Dialog.Title>No stream urls found!</Dialog.Title>
        <Dialog.Description>
          `لم يتم العثور على بث مباراة [{matchDescription}] الرجاء المحاولة مرة
          أخرى في وقت لاحق
        </Dialog.Description>
        <Dialog.Button
          label="OK"
          bold={true}
          onPress={() => navigation.navigate('Home')}
        />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  matchdescContainer: {
    height: 100,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
    flexDirection: 'row-reverse',
  },
  matchdesc: {
    textAlign: 'center',
    color: 'white',
  },

  container: {
    // flex: 1,
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    width: 320,
    height: 280,

    marginTop: 10,

    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  fullscreenVideo: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: 'black',
  },
  team_logo: {
    height: '70%',
    resizeMode: 'contain',
    flex: 1,
  },
});
export default MatchStream;
