/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-web';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';

class FriendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      friendCount: '',
      photo: null,
      isLoading: true,
      userId: '',
      listData: '',
      friendsId: this.props.route.params.friendId,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.getPost();
      this.getFriendData();
      this.get_profile_image();
      this.checkLoggedIn();
    });
  }

  viewPost = (friendPostId) => {
    const { navigation } = this.props;
    navigation.navigate('viewPost', {
      friendPostId: friendPostId,
      friendId: this.state.userId,
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
    const { friendsId } = this.state;
    fetch(`http://localhost:3333/api/1.0.0/user/${friendsId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
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

  getPost = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const { friendsId } = this.state;
    return fetch(`http://localhost:3333/api/1.0.0/user/${friendsId}/post`, {
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
        throw 'Something went wrong';
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

  getFriendData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const { friendsId } = this.state;
    const { navigation } = this.props;
    return fetch(`http://localhost:3333/api/1.0.0/user/${friendsId}`, {
      method: 'GET',
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
        } else if (response.status === 403) {
          throw new Error('Can only view the post of yourself of your friends');
        }
        throw 'Something went wrong';
      })
      .catch((error) => {
        console.log(error);
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
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

  sendLike = async (postId) => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const { friendsId } = this.state;
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${friendsId}/post/${postId}/like`,
      {
        method: 'POST',
        headers: {
          'X-Authorization': token,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        this.getPost();
      }
      if (response.status === 401) {
        navigation.navigate('login');
      } else if (response.status === 403) {
        throw new Error('You have already liked this post');
      }
      throw 'Something went wrong';
    });
  };

  sendDislike = async (postId) => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const { friendsId } = this.state;
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${friendsId}/post/${postId}/like`,
      {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        this.getPost();
      }
      if (response.status === 401) {
        navigation.navigate('login');
      } else if (response.status === 403) {
        throw new Error('You have already liked this post');
      }
      throw 'Something went wrong';
    });
  };

  render() {
    const { firstName, lastName, friendCount, listData, photo, isLoading } =
      this.state;
    const { navigation } = this.props;
    if (isLoading) {
      return (
        <View>
          <Text> Loading... </Text>
        </View>
      );
    }
    return (
      <View style={styles.centeredView}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: 'white' }}>Go back</Text>
        </TouchableOpacity>
        <ScrollView style={styles.backgrd}>
          <Image source={photo} style={styles.profileImg} />

          <Text style={styles.txtName}>
            {firstName} {lastName}
          </Text>
          <FlatList
            data={listData}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Image style={styles.profileImgCont} source={photo} />
                <Text style={styles.nameTxt}>
                  {item.author.first_name} {item.author.last_name}
                </Text>

                <Text style={styles.contentSection}> {item.text} </Text>
                <Text> Likes: {item.numLikes} </Text>
                <View style={styles.rightButtons}>
                  <Button
                    icon={
                      <Icon
                        name="thumbs-o-up"
                        size={15}
                        color="white"
                        onPress={() => {
                          this.sendLike(item.post_id);
                        }}
                      />
                    }
                  />

                  <Button
                    icon={
                      <Icon
                        name="thumbs-o-down"
                        size={15}
                        color="white"
                        onPress={() => {
                          this.sendDislike(item.post_id);
                        }}
                      />
                    }
                  />
                  <Button
                    icon={<Icon name="eye" size={15} color="white" />}
                    onPress={() => {
                      this.viewPost(item.post_id);
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
    alignSelf: 'center',
    height: 100,
    width: 100,
    borderWidth: 1,
    borderRadius: 75,
    marginTop: 20,
  },
  txtName: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
  backgrd: {
    backgroundColor: '#3b5998',
  },
  rightButtons: {
    flexDirection: 'row',
    marginLeft: 300,
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
  profileImgCont: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 30,
    width: 30,
    borderRadius: 75,
    marginTop: 4,
  },
  nameTxt: {
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  contentSection: {
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  backBtn: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8b9dc3',
    margin: 5,
    borderWidth: 2,
  },
});

export default FriendScreen;
