import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: '',
      listData: [],
    };
  }

  getData = async (userId) => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          console.log('Bad Request');
        } else if (response.status === 401) {
          navigation.navigate('login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          listData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { navigation } = this.props;
    const { userInput } = this.state;
    return (
      <ScrollView style={styles.view}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('add');
          }}
        >
          <Text style={{ color: 'white' }}>Add Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('request');
          }}
        >
          <Text style={{ color: 'white' }}>Friend Request</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Search friends list"
          onChangeText={(userInput) => this.setState({ userInput })}
          value={userInput}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#3b5998',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b9dc3',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
});

export default FriendsList;
