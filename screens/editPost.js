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
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-web';

class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listData: '',
      firstName: '',
      lastName: '',
      postId: this.props.route.params.postID,
      photo: null,
      newText: '',
    };
  }

  componentDidMount() {
    this.getPost();
    this.checkLoggedIn();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    if (token == null) {
      navigation.navigate('login');
    }
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

  updateText = async () => {
    const { newText, postId } = this.state;
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('@user_id');
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${userId}/post/${postId}`,
      {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newText,
        }),
      }
    ).then((response) => {
      if (response.status === 200) {
        this.getPost();
      }
      if (response.status === 400) {
        throw new Error('Bad Request');
      } else if (response.status === 401) {
        throw new Error('Unauthorised');
      } else {
        throw 'Something went wrong';
      }
    });
  };

  render() {
    const { photo, firstName, lastName, text, newText } = this.state;
    const { navigation } = this.props;
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
          <View style={styles.postContainer}>
            <Image style={styles.profileImgCont} source={photo} />
            <Text style={styles.nameTxt}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.contentSection}> {text} </Text>
          </View>
          <TextInput
            placeholder="Edit post..."
            onChangeText={(newText) => this.setState({ newText })}
            value={newText}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.editbtn}
            onPress={() => {
              this.updateText();
            }}
          >
            <Text style={{ color: 'white' }}>Update</Text>
          </TouchableOpacity>
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
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
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
  nameTxt: {
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  contentSection: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  backBtn: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8b9dc3',
    margin: 5,
    borderWidth: 2,
  },
});

export default EditPost;
