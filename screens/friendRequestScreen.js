import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  Button,
  StyleSheet,
  View,
  FlatList,
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
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getRequest();
    });
  }

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
      if (response.status === 400) {
        console.log('Bad Request');
      } else if (response.status === 401) {
        navigation.navigate('login');
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
        return response.json();
      }
      if (response.status === 400) {
        console.log('Bad Request');
      } else if (response.status === 401) {
        navigation.navigate('login');
      } else {
        throw 'Something went wrong';
      }
    });
  };

  render() {
    const { listData } = this.state;
    return (
      <ScrollView>
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row' }}>
              <Text>
                {item.first_name} {item.last_name}
                <Button
                  title="Accept"
                  onPress={() => this.acceptRequest(item.user_id)}
                />
                <Button
                  title="Decline"
                  onPress={() => this.declineRequest(item.user_id)}
                />
              </Text>
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
});

export default FriendRequest;
