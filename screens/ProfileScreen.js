/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  ToastAndroid,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      friendCount: '',
      userId: '',
      token: '',
    };
  }

  componentDidMount() {
    this.getProfileData();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.setState({ token: value });
    } else {
      navigation.navigate('login');
    }
  };

  getProfilePicture() {} // Display in circle

  getUserPost() {} // get and display users post

  // Button/Text box to add a post

  getProfileData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const uID = await AsyncStorage.getItem('@user_id');

    return fetch(`http://localhost:3333/api/1.0.0/user/${uID}`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          Alert.alert('nope');
        }
        if (response.status === 404) {
          Alert.alert('m');
        }
        return response.blob();
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          user_id: responseJson.user_id,
          first_name: responseJson.first_name,
          last_name: responseJson.last_name,
          friend_count: responseJson.friend_count,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { firstName, lastName, friendCount } = this.state;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 50,
        }}
      >
        <Image
          source={{ uri: 'https://reactjs.org/logo-og.png' }}
          style={styles.profileImg}
        />

        <Text style={styles.txt}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.txt}>Friends: {friendCount}</Text>
        <Button title="Edit Profile" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 80,
    borderColor: 'black',
    borderWidth: 1,
  },
  txt: {
    fontWeight: 'bold',
    color: 'black',
    margin: 2,
  },
});

export default ProfileScreen;
