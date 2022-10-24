/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect} from 'react';
import type {Node} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  ScrollView,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import SplashScreen from 'react-native-splash-screen';

import Matches from './src/screens/MatchComp';
import MatchStream from './src/screens/MatchStream';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    primary: `#1200d3`,
  },
};

const App = () => {
  //hiiding the splasch screen
  useEffect(() => SplashScreen.hide());

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Matches}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Match" component={MatchStream} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
