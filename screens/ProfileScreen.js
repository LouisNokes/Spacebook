/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-web';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      friendCount: '',
      photo: null,
      isLoading: true,
      userId: '',
    };
  }

  componentDidMount() {
    this.getProfileData();
    this.get_profile_image();
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

  get_profile_image = () => {
    fetch('http://localhost:3333/api/1.0.0/user/${userId}/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': 'a3b0601e54775e60b01664b1a5273d54',
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  getUserPost() {} // get and display users post

  // Button/Text box to add a post

  getProfileData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const uID = await AsyncStorage.getItem('@user_id');
    const { navigation } = this.props;
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
          navigation.navigate('login');
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
          userId: responseJson.user_id,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          friendCount: responseJson.friend_count,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { firstName, lastName, friendCount } = this.state;
    const { navigation } = this.props;
    return (
      <ScrollView style={styles.backgrd}>
        <Image
          source={{ uri: 'https://reactjs.org/logo-og.png' }}
          style={styles.profileImg}
        />

        <Text style={styles.txtName}>
          {firstName} {lastName}
        </Text>

        <TouchableOpacity
          style={styles.editbtn}
          onPress={() => {
            navigation.navigate('edit'); // Nav to edit page
          }}
        >
          <Text style={{ color: 'white' }}>Edit Profile</Text>
        </TouchableOpacity>
        <Text style={styles.txt}>Friends: {friendCount}</Text>
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  txt: {
    fontWeight: 'bold',
    color: 'black',
    margin: 2,
  },
  txtName: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
  editbtn: {
    alignItems: 'center',
    backgroundColor: '#8b9dc3',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    borderWidth: 2,
  },
  backgrd: {
    backgroundColor: '#3b5998',
  },
});

export default ProfileScreen;
