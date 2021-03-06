/* eslint-disable no-throw-literal */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class SettingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      password: '',
      email: '',
      listData: [],
      firstName: '',
      lastName: '',
    };
  }

  componentDidMount() {
    this.checkLoggedIn();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      navigation.navigate('login');
    }
  };

  logout = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('login');
        } else if (response.status === 401) {
          navigation.navigate('login');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  updateUser = async () => {
    const { navigation } = this.props;
    const { email, password, firstName, lastName } = this.state;
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
      }),
    }).then((response) => {
      if (response.status === 200) {
        navigation.navigate('Login');
      }
      if (response.status === 400) {
        throw new Error('Bad Request');
      } else if (response.status === 401) {
        throw new Error('Unauthorised');
      } else {
        throw 'Something went wrong';
      }
    });
  };

  render() {
    const { email, password, firstName, lastName } = this.state;
    return (
      <View style={styles.centeredView}>
        <TextInput
          placeholder="First name"
          onChangeText={(firstName) => this.setState({ firstName })}
          value={firstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last name"
          onChangeText={(lastName) => this.setState({ lastName })}
          value={lastName}
          style={styles.input}
        />
        <TextInput
          placeholder="New email"
          onChangeText={(email) => this.setState({ email })}
          value={email}
          style={styles.input}
        />
        <TextInput
          placeholder="New password"
          onChangeText={(password) => this.setState({ password })}
          secureTextEntry
          value={password}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.settingPageBtn}
          onPress={() => {
            this.updateUser();
          }}
        >
          <Text style={{ color: 'white' }}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingPageBtn}
          onPress={() => {
            this.logout();
          }}
        >
          <Text style={{ color: 'red' }}>Sign out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#3b5998',
  },
  settingPageBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b9dc3',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
});

export default SettingScreen;
