/* eslint-disable no-throw-literal */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ToastAndroid,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class SettingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      password: '',
      email: '',
      modalVisible: false,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  logout = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('login');
        } else if (response.status === 401) {
          navigation.navigate('login');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT);
      });
  };

  render() {
    const { modalVisible } = this.state;
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
              <TextInput style={styles.input} placeholder="Current email" />
              <TextInput style={styles.input} placeholder="New email" />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.updateUser()}
              >
                <Text style={styles.textStyle}>Save</Text>
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
          <Text style={styles.textStyle}>Change email</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonOpen, styles.position]}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Change password</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonOpen, styles.position]}
          onPress={() => this.logout()}
        >
          <Text style={styles.textStyle}>Sign Out</Text>
        </Pressable>
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
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SettingScreen;
