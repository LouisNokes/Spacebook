import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Button,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      userInput: '',
      listData: '',
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  sendPost = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    const post = { text: this.state.userInput };
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },

      body: JSON.stringify(post),
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

  getPost = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userID}/post`, {
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
    const { modalVisible, userInput, listData } = this.state;
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Whats on your mind..."
                onChangeText={(userInput) => this.setState({ userInput })}
                value={userInput}
                style={styles.input}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.sendPost()}
              >
                <Text style={styles.textStyle}>Post</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Pressable
          style={[styles.button, styles.buttonOpen, styles.position]}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Create post</Text>
        </Pressable>
        <Button title="Search:" onPress={() => this.getPost()} />
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row' }}>
              <Text>
                {item.text}
                <Button title="Delete" onPress={() => this.addRequest()} />
              </Text>
            </View>
          )}
        />
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
  position: {
    bottom: 200,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
    width: 170,
  },
  buttonOpen: {
    backgroundColor: '#8b9dc3',
  },
  buttonClose: {
    backgroundColor: '#8b9dc3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 400,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default HomeScreen;
