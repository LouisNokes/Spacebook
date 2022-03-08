import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import homeScreen from './HomeScreen';
import profileScreen from './ProfileScreen';
import messageScreen from './MessageScreen';
import friendListScreen from './FriendsList';
import settingScreen from './SettingScreen';

const Tab = createBottomTabNavigator();

class MainScreen extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="homeScreen"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'homeScreen') {
                iconName = focused ? 'HomeScreen' : 'HomeScreen-outline';
              } else if (route.name === 'profileScreen') {
                iconName = focused ? 'ProfileScreen' : 'ProfileScreen-outline';
              } else if (route.name === 'settingScreen') {
                iconName = focused ? 'SettingScreen' : 'SettingScreen-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={homeScreen} />
          <Tab.Screen name="Profile" component={profileScreen} />
          <Tab.Screen name="Settings" component={settingScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default MainScreen;
