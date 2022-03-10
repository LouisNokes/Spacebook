import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image, StyleSheet } from 'react-native';

import login from './screens/LoginScreen';
import signup from './screens/SignupScreen';
import homescreen from './screens/HomeScreen';
import profileScreen from './screens/ProfileScreen';
import settingscreen from './screens/SettingScreen';
import messageScreen from './screens/MessageScreen';
import FriendsList from './screens/FriendsList';
import EditProfile from './screens/EditProfile';
import addFriend from './screens/addFriend';
import FriendRequest from './screens/friendRequestScreen';

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
          headerShown: true,

          headerTitle: () => (
            <Image
              style={{
                width: 200,
                height: 60,
              }}
              source={require('./assets/logo.png')}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('./assets/home.png')}
                resizeMode="contain"
                style={styles.image}
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
                source={require('./assets/user.png')}
                resizeMode="contain"
                style={styles.image}
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
                source={require('./assets/message.png')}
                resizeMode="contain"
                style={styles.image}
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
                source={require('./assets/friends.png')}
                resizeMode="contain"
                style={styles.image}
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
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require('./assets/settings.png')}
                resizeMode="contain"
                style={styles.image}
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
          options={{ headerShown: false }}
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
        <Stack.Screen
          name="edit"
          component={EditProfile}
          options={{ title: 'Edit', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="add"
          component={addFriend}
          options={{ title: 'Add Friend', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="request"
          component={FriendRequest}
          options={{ title: 'Friend Request', headerTitleAlign: 'center' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
  },
});
