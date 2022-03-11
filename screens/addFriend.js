import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScrollView,
  Text,
  Button,
  TextInput,
  FlatList,
  View,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native-web';

class AddFriend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: '',
      listData: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const { userInput } = this.state;
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${userInput}`, {
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

  addRequest = async (user_id) => {
    const token = await AsyncStorage.getItem('@session_token');
    const { navigation } = this.props;
    fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/friends`, {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    }).then((response) => {
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
    });
  };

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      navigation.navigate('login');
    }
  };

  render() {
    const { userInput, listData } = this.state;
    return (
      <View>
        <ScrollView>
          <TextInput
            placeholder="Search..."
            onChangeText={(userInput) => this.setState({ userInput })}
            value={userInput}
          />
          <Button title="Search:" onPress={() => this.getData()} />
          <FlatList
            data={listData}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/friends.png')} />
                <Text>
                  {item.user_givenname} {item.user_familyname}
                  <Button
                    title="Add"
                    onPress={() => this.addRequest(item.user_id)}
                  />
                </Text>
              </View>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

export default AddFriend;
