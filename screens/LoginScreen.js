import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginData = async (value) => {
  try {
    const jsonVal = JSON.stringify(value);
    await AsyncStorage.setItem('@spacebook_details', jsonVal);
  } catch (error) {
    console.error(error);
  }
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: 'louisnokes1@gmail.com',
      password: 'password123',
    };
  }

  login = async () => {
    // Validation here
    const { email, password } = this.state;
    const { navigation } = this.props;
    fetch('http://192.168.0.45:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        loginData(responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_id', responseJson.id.toString());
        navigation.navigate('profile');
      })

      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { email, password } = this.state;
    const { navigation } = this.props;
    return (
      <ScrollView style={styles.backgrd}>
        <Text style={styles.title}> Spacebook </Text>
        <TextInput
          placeholder="Email"
          onChangeText={(email) => this.setState({ email })}
          value={email}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          onChangeText={(password) => this.setState({ password })}
          value={password}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.loginPageBtn}
          onPress={() => {
            this.login();
          }}
        >
          <Text style={{ color: 'white' }}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginPageBtn}
          onPress={() => {
            navigation.navigate('signup');
          }}
        >
          <Text style={{ color: 'white' }}>SIGN UP</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 50,
    height: 150,
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  loginPageBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b9dc3',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
  },
  backgrd: {
    backgroundColor: '#3b5998',
  },
});

export default Login;
