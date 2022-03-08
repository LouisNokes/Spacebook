import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image } from 'react-native'; //Clean up this section

import login from './screens/LoginScreen';
import signup from './screens/SignupScreen';
import homescreen from './screens/HomeScreen';
import profileScreen from './screens/ProfileScreen';
import settingscreen from './screens/SettingScreen';
import messageScreen from './screens/MessageScreen';
import FriendsList from './screens/FriendsList';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={homescreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('./assets/icon.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#660094' : '#748c94',
                }}
              />
              <Text
                style={{ color: focused ? '#660094' : '#748c94', fontSize: 10 }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={profileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('./assets/icon.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#660094' : '#748c94',
                }}
              />
              <Text
                style={{ color: focused ? '#660094' : '#748c94', fontSize: 10 }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Messages"
        component={messageScreen}
        options={{
          title: 'Messages',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('./assets/icon.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#660094' : '#748c94',
                }}
              />
              <Text
                style={{ color: focused ? '#660094' : '#748c94', fontSize: 10 }}
              >
                Messages
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsList}
        options={{
          title: 'Friends',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('./assets/icon.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#660094' : '#748c94',
                }}
              />
              <Text
                style={{ color: focused ? '#660094' : '#748c94', fontSize: 10 }}
              >
                Friends
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={settingscreen}
        options={{
          title: 'Settings',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('./assets/icon.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#660094' : '#748c94',
                }}
              />
              <Text
                style={{ color: focused ? '#660094' : '#748c94', fontSize: 10 }}
              >
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={login}
          options={{ title: 'Login', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="signup"
          component={signup}
          options={{ title: 'Sign up', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
