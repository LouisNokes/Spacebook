/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-web';

class ViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listData: '',
      firstName: '',
      lastName: '',
      postId: this.props.route.params.postID,
      friendId: this.props.route.params.friendId,
      friendPostId: this.props.route.params.friendPostId,
      photo: null,
    };
  }

  componentDidMount() {
    this.getPost();
    this.getFriendPost();
    this.get_friend_image();
  }

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

  getPost = async () => {
    const { postId } = this.state;
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}/post/${postId}`,
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
        if (response.status === 401) {
          navigation.navigate('login');
        } else if (response.status === 403) {
          throw new Error('Can only view the post of yourself of your friends');
        }
        throw 'Something went wrong';
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          text: responseJson.text,
          firstName: responseJson.author.first_name,
          lastName: responseJson.author.last_name,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getFriendPost = async () => {
    const { friendPostId, friendId } = this.state;
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${friendId}/post/${friendPostId}`,
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
        if (response.status === 401) {
          navigation.navigate('login');
        } else if (response.status === 403) {
          throw new Error('Can only view the post of yourself of your friends');
        }
        throw 'Something went wrong';
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          text: responseJson.text,
          firstName: responseJson.author.first_name,
          lastName: responseJson.author.last_name,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  get_friend_image = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const { friendId } = this.state;
    fetch(`http://localhost:3333/api/1.0.0/user/${friendId}/photo`, {
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

  render() {
    const { photo, firstName, lastName, text } = this.state;
    return (
      <View style={styles.centeredView}>
        <ScrollView style={styles.backgrd}>
          <View style={styles.postContainer}>
            <Image style={styles.profileImgCont} source={photo} />
            <Text style={styles.nameTxt}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.contentSection}> {text} </Text>
          </View>
        </ScrollView>
      </View>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
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
    borderRadius: 75,
    marginTop: 4,
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
});

export default ViewPost;
