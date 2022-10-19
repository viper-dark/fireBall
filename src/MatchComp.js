//require('dotenv').config();

import React, {useState, useEffect} from 'react';
import Timer from './componants/Timer';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import Dialog from 'react-native-dialog';

const Match = ({game, day, navigation}) => {
  const tomorrow = day === 'tomorrow';
  const [visible, setVisible] = useState(false);

  const handleModal = () => {
    setVisible(false);
  };
  const onMatchClick = () => {
    if (day === 'tomorrow') {
      //alerting the user that the game hasn't started yet
      setVisible(true);

      return;
    }
    navigation.navigate('Match', {
      matchDescription: game.firstTeam + 'VS' + game.secondTeam,
      logoUrl1: game.firstTeamLogo,
      logoUrl2: game.secondTeamLogo,
    });
  };
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('#21325E', false)}
      onPress={onMatchClick}>
      <View style={[styles.match_event]}>
        <View style={styles.teamsContainer}>
          <View style={styles.box}>
            <Image
              style={[styles.team_logo]}
              source={{
                uri: game.firstTeamLogo,
              }}
            />
            <Text style={[styles.box_children, styles.team_name]}>
              {game.firstTeam}
            </Text>
          </View>
          <View style={[styles.match_time]}>
            <Text style={styles.time_children}>
              {game.started ? game.result : game.time}
            </Text>

            {game.hasEnded ? (
              <Text style={styles.time_children}>إنتهت المباراة</Text>
            ) : game.started ? (
              <Text style={(styles.time_children, styles.starting)}>
                {' '}
                جارية الآن{' '}
              </Text>
            ) : (
              tomorrow || (
                <Timer
                  gameTime={game.time}
                  style={[
                    styles.time_children,
                    {backgroundColor: 'blue', borderRadius: 2},
                  ]}
                />
              )
            )}
          </View>
          <View style={[styles.box, styles.left_team]}>
            <Text style={[styles.box_children, styles.team_name]}>
              {game.secondTeam}
            </Text>
            <Image
              style={[styles.team_logo]}
              source={{
                uri: game.secondTeamLogo,
              }}
            />
          </View>
        </View>
        <View style={styles.match_info}>
          <Text style={styles.info_children}>{game.channels}</Text>
          <Text style={styles.info_children}>{game.comentator}</Text>
          <Text style={styles.info_children}>{game.championship}</Text>
        </View>
        <Dialog.Container visible={visible} contentStyle={{borderRadius: 10}}>
          <Dialog.Title>match has not yet started </Dialog.Title>
          <Dialog.Description>
            المباراة لم تبدأ بعد الرجاء الانتظار
          </Dialog.Description>
          <Dialog.Button label="OK" bold={true} onPress={handleModal} />
        </Dialog.Container>
      </View>
    </TouchableNativeFeedback>
  );
};

const Matches = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [day, setday] = useState('');

  const getGames = async (day = '') => {
    try {
      // console.log('zabi' + process.env.REACT_APP_BASE_URL);
      const response = await fetch('https://stream-scraper.vercel.app/' + day);
      //testing

      const data = await response.json();
      setGames(data.games);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGames(day);
    setLoading(true);
  }, [day]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={{flexDirection: 'row'}}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('#21325E', false)}
          onPress={event => {
            setday('yesterday');
          }}>
          <Text style={styles.dayBtn}>مباريات الأمس</Text>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('#21325E', false)}
          onPress={event => setday('')}>
          <Text style={styles.dayBtn}>مباريات اليوم</Text>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('#21325E', false)}
          onPress={event => setday('tomorrow')}>
          <Text style={styles.dayBtn}>مباريات الغد</Text>
        </TouchableNativeFeedback>
      </View>
      {isLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <View style={{marginBottom: 25}}>
          {games.map((game, i) => (
            <Match game={game} key={i} day={day} navigation={navigation} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  //main flex container
  match_event: {
    borderWidth: 2,
    borderColor: 'darkgray',
    borderStyle: 'solid',
    borderRadius: 8,

    height: 140,
    backgroundColor: 'rgb(25, 34, 31)',

    margin: 2,
    flexWrap: 'wrap',
  },
  teamsContainer: {
    flex: 2.5,
    flexDirection: 'row',
  },
  match_info: {
    flex: 1,

    FontName: 'Cairo',
    fontFamily: 'Cairo',
    lineHeight: 35,
    fontSize: 16,
    color: 'rgb(200, 200, 200)',

    listStyle: 'none',
    outlineColor: 'initial',
    listStyleImage: 'initial',

    borderTopColor: '#ddd',
    borderTopWidth: 1,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },

  box: {
    alignItems: 'center',

    flex: 2,
    margin: 4,

    flexDirection: 'row',
  },

  info_children: {
    textAlign: 'center',
    flex: 1,
    color: 'white',
  },
  info_text: {},
  match_time: {
    flexDirection: 'column',
    justifyContent: 'space-around',

    flex: 1,
  },
  team_logo: {
    height: '70%',
    resizeMode: 'contain',
    flex: 1,
  },
  box_children: {
    flex: 1,

    color: 'white',
    textAlign: 'center',
  },
  time_children: {
    color: 'white',
    textAlign: 'center',
  },
  //blinking starting text
  starting: {
    borderRadius: 3,
    backgroundColor: 'red',
  },
  scrollView: {
    backgroundColor: 'aliceblue',
    padding: 10,
    paddingLeft: 3,
    paddingRight: 3,
  },
  dayBtn: {
    flex: 1,
    backgroundColor: 'dodgerblue',
    margin: 3.5,
    borderRadius: 3,
    height: 40,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: 'white',
  },
});

export default Matches;
