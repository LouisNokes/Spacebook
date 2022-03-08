/* eslint-disable no-throw-literal */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
    };
  }

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

  render() {
    return (
      <ScrollView>
        <TouchableOpacity
          style={styles.otherBtns}
          onPress={() => {
            this.updateUser();
          }}
        >
          <Text style={{ color: 'white' }}>Change email/password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            this.logout();
          }}
        >
          <Text style={{ color: 'red' }}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  logoutBtn: {
    alignItems: 'center',
    backgroundColor: 'grey',
    padding: 10,
    margin: 5,
    borderWidth: 2,
  },
  otherBtns: {
    alignItems: 'center',
    backgroundColor: 'grey',
    padding: 10,
    margin: 5,
    borderWidth: 2,
  },
});

export default SettingScreen;
