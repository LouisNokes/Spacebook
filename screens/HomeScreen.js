import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      userInput: '',
      listData: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getPost();
    });
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
        navigation.navigate('home');
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

  sendLike = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    const postId = await AsyncStorage.getItem('@postId');
    fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}/post/${postId}/like`,
      {
        method: 'POST',
        headers: {
          'X-Authorization': token,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        navigation.navigate('home');
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

  deletePost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');

    const { navigation } = this.props;
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${postId}`, {
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
        <Button
          style={[styles.button, styles.buttonOpen]}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Create post</Text>
        </Button>
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Image
                style={styles.profileImg}
                source={require('../assets/nopic.png')}
              />
              <Text style={styles.nameTxt}>
                {item.author.first_name} {item.author.last_name}
              </Text>
              <Text style={styles.contentSection}> {item.text} </Text>
              <View style={styles.buttonContainer}>
                <Button
                  icon={
                    <Icon
                      name="thumbs-o-up"
                      size={15}
                      color="white"
                      onPress={async () => {
                        this.sendLike();
                      }}
                    />
                  }
                />
                <Text> {item.numLikes} </Text>
                <Button
                  icon={<Icon name="thumbs-o-down" size={15} color="white" />}
                />
                <Button icon={<Icon name="edit" size={15} color="white" />} />
                <Button
                  icon={<Icon name="trash" size={15} color="white" />}
                  onPress={() => {
                    this.deletePost();
                  }}
                />
                <Button
                  icon={<Icon name="eye" size={15} color="white" />}
                  onPress={() => {}}
                />
              </View>
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
    backgroundColor: '#3b5998',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  postContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 300,
    width: 400,
    marginTop: 30,
    borderWidth: 2,
  },
  profileImg: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  position: {
    bottom: 200,
  },
  nameTxt: {
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
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
  contentSection: {
    marginTop: 10,
    marginBottom: 15,
  },
});

export default HomeScreen;
