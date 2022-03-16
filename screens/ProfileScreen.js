import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      friendCount: '',
      photo: null,
      isLoading: true,
      listData: [],
      userInput: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getPost();
      this.getProfileData();
      this.get_profile_image();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  viewPost = (postId) => {
    const { navigation } = this.props;
    navigation.navigate('viewPost', {
      postID: postId,
    });
  };

  editPost = (postId) => {
    const { navigation } = this.props;
    navigation.navigate('editPost', {
      postID: postId,
    });
  };

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      navigation.navigate('login');
    }
  };

  get_profile_image = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  sendPost = async () => {
    const { navigation } = this.props;
    const { userInput } = this.state;
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    const post = { text: userInput };
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(post),
    }).then((response) => {
      if (response.status === 201) {
        this.getPost();
      }
      if (response.status === 401) {
        navigation.navigate('login');
      } else if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw new Error('Something went wrong');
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
        if (response.status === 401) {
          navigation.navigate('login');
        } else if (response.status === 403) {
          throw new Error('Can only view the post of yourself of your friends');
        }
        throw new Error('Something went wrong');
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

  deletePost = async (postId) => {
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
        this.getPost();
      }
      if (response.status === 401) {
        navigation.navigate('login');
      } else if (response.status === 403) {
        throw new Error('You can only delete your own post');
      }
      throw new Error('Something went wrong');
    });
  };

  getProfileData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    const { navigation } = this.props;
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
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
        } else if (response.status === 404) {
          throw new Error('Not found');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
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
    const { firstName, lastName, friendCount, listData, userInput, photo } =
      this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.centeredView}>
        <ScrollView style={styles.backgrd}>
          <Image source={photo} style={styles.profileImg} />

          <Text style={styles.txtName}>
            {firstName} {lastName}
          </Text>

          <TouchableOpacity
            style={styles.editbtn}
            onPress={() => {
              navigation.navigate('editProfile'); // Nav to edit page
            }}
          >
            <Text style={{ color: 'white' }}>Upload Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editbtn}
            onPress={() => {
              navigation.navigate(); // Nav to draft page
            }}
          >
            <Text style={{ color: 'white' }}>Drafts</Text>
          </TouchableOpacity>
          <Text style={styles.txt}>Friends: {friendCount}</Text>
          <TextInput
            placeholder="Whats on your mind..."
            onChangeText={(userInput) => this.setState({ userInput })}
            value={userInput}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.editbtn}
            onPress={() => {
              this.sendPost(); // Nav to edit page
            }}
          >
            <Text style={{ color: 'white' }}>Post</Text>
          </TouchableOpacity>
          <FlatList
            data={listData}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Image style={styles.profileImgCont} source={photo} />
                <Text style={styles.nameTxt}>
                  {item.author.first_name} {item.author.last_name}
                </Text>
                <Text style={styles.contentSection}> {item.text} </Text>
                <View style={styles.rightButtons}>
                  <Button
                    icon={<Icon name="edit" size={15} color="white" />}
                    onPress={() => {
                      this.editPost(item.post_id);
                    }}
                  />
                  <Button
                    icon={<Icon name="eye" size={15} color="white" />}
                    onPress={() => {
                      this.viewPost(item.post_id);
                    }}
                  />
                  <Button
                    icon={<Icon name="trash" size={15} color="red" />}
                    onPress={() => {
                      this.deletePost(item.post_id);
                    }}
                  />
                </View>
              </View>
            )}
          />
        </ScrollView>
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
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 80,
    borderColor: 'black',
    borderWidth: 1,
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
  buttonContainer: {
    flexDirection: 'row',
  },
  postContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 300,
    width: 400,
    marginTop: 30,
    borderWidth: 2,
  },
  rightButtons: {
    flexDirection: 'row',
    marginLeft: 300,
  },
  profileImgCont: {
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
    width: 170,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default ProfileScreen;
