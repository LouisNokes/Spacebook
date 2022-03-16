import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';

class FriendsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listData: [],
      userInput: '',
      limit: 5,
      offset: 0,
      photo: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getFriends();
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      navigation.navigate('login');
    }
  };

  viewFriend = (friendId) => {
    const { navigation } = this.props;
    navigation.navigate('friendScreen', {
      friendId: friendId,
    });
  };

  getFriends = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
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
          throw new Error('Something went wrong');
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

  searchFriends = async () => {
    const { navigation } = this.props;
    const { userInput } = this.state;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${userInput}&search_in=friends&limit=${this.state.limit}&offset=${this.state.offset}`,
      {
        method: 'GET',
        headers: {
          'X-Authorization': token,
        },
      }
    )
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
    const { listData, userInput } = this.state;
    return (
      <ScrollView style={styles.view}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('add');
          }}
        >
          <Text style={{ color: 'white' }}>Find Friends</Text>
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
          placeholder="Search for friends..."
          onChangeText={(userInput) => this.setState({ userInput })}
          value={userInput}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            this.searchFriends();
          }}
        >
          <Text style={{ color: 'white' }}>Search</Text>
        </TouchableOpacity>
        <Text style={styles.title}> My friends </Text>
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Text>
                {item.user_givenname} {item.user_familyname}
              </Text>
              <Button
                style={styles.addButton}
                title="View"
                onPress={() => {
                  this.viewFriend(item.user_id);
                }}
              />
            </View>
          )}
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
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b9dc3',
    height: 20,
    padding: 10,
    margin: 5,
    borderRadius: 10,
    color: 'white',
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  postContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 30,
    borderWidth: 2,
  },
});

export default FriendsList;
