import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {} from 'react-native';

import login from './screens/LoginScreen';
import signup from './screens/SignupScreen';
import home from './screens/HomeScreen';
import profileScreen from './screens/ProfileScreen';
import settingscreen from './screens/SettingScreen';
import messageScreen from './screens/MessageScreen';
import FriendsList from './screens/FriendsList';

const Stack = createNativeStackNavigator();

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
          component={home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyStack;
