import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  Button,
  StyleSheet,
  View,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listData: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getRequest();
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      navigation.navigate('login');
    }
  };

  // Button/Text box to add a post
  getRequest = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
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

  declineRequest = async (userId) => {
    const token = await AsyncStorage.getItem('@session_token');
    const { navigation } = this.props;
    fetch(`http://localhost:3333/api/1.0.0/friendrequests/${userId}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
      },
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 401) {
        navigation.navigate('login');
      } else if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw 'Something went wrong';
      }
    });
  };

  acceptRequest = async (userId) => {
    const token = await AsyncStorage.getItem('@session_token');
    const { navigation } = this.props;
    fetch(`http://localhost:3333/api/1.0.0/friendrequests/${userId}`, {
      method: 'POST',
      headers: {
        'X-Authorization': token,
      },
    }).then((response) => {
      if (response.status === 200) {
        this.getRequest();
      }
      if (response.status === 401) {
        navigation.navigate('login');
      } else if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw 'Something went wrong';
      }
    });
  };

  render() {
    const { listData } = this.state;
    return (
      <ScrollView style={styles.backgrd}>
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            <View>
              <View style={styles.postContainer}>
                <Text>
                  {item.first_name} {item.last_name}
                </Text>
                <View style={styles.rightButtons}>
                  <Button
                    style={styles.addButton}
                    title="Accept"
                    onPress={() => this.acceptRequest(item.user_id)}
                  />
                  <Button
                    style={styles.addButton}
                    title="Decline"
                    onPress={() => this.declineRequest(item.user_id)}
                  />
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backgrd: {
    backgroundColor: '#3b5998',
  },
  container: {
    flex: 1,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#8b9dc3',
    padding: 10,
    margin: 5,
    borderRadius: 15,
  },
  postContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 30,
    borderWidth: 2,
  },
  rightButtons: {
    marginLeft: 300,
  },
});

export default FriendRequest;
