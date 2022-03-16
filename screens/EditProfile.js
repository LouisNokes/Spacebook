import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  // Show friend request (Accept/Reject this)
  addPhoto = async (data) => {
    // Get these from AsyncStorage
    const token = await AsyncStorage.getItem('@session_token');
    const uID = await AsyncStorage.getItem('@user_id');

    let res = await fetch(data.base64);
    let blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${uID}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token,
      },
      body: blob,
    })
      .then((response) => {
        console.log('Picture added', response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  // Show current friends

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasPermission) {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            // eslint-disable-next-line react/destructuring-assignment
            type={this.state.type}
            // eslint-disable-next-line no-return-assign
            ref={(ref) => (this.camera = ref)}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    return <Text>No access to camera</Text>;
  }
}

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
