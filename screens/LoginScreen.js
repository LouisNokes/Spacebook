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
      email: '',
      password: '',
    };
  }

  login = async () => {
    // Validation here
    const { email, password } = this.state;
    const { navigation } = this.props;
    fetch('http://localhost:3333/api/1.0.0/login', {
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
        navigation.navigate('home');
      })

      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { email, password } = this.state;
    const { navigation } = this.props;
    return (
      <ScrollView>
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
          style={styles.loginBtn}
          onPress={() => {
            this.login();
          }}
        >
          <Text style={{ color: 'black' }}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => {
            navigation.navigate('signup');
          }}
        >
          <Text style={{ color: 'black' }}>SIGN UP</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loginBtn: {
    alignItems: 'center',
    backgroundColor: '#7649fe',
    padding: 10,
    margin: 5,
    borderWidth: 2,
  },
  signupBtn: {
    alignItems: 'center',
    padding: 10,
  },
});

export default Login;
