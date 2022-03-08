/* eslint-disable no-throw-literal */
import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  }

  signup = async () => {
    const { firstName, lastName, email, password } = this.state;
    const { navigation } = this.props;
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    if (
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      password === ''
    ) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
    } else if (password.length < 5) {
      ToastAndroid.show('Password is too short', ToastAndroid.SHORT);
    } else {
      try {
        const response = await fetch('http://localhost:3333/api/1.0.0/user', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        if (response.status === 201) {
          ToastAndroid.show('Account created successfully', ToastAndroid.SHORT);
        } else if (response.status === 400) {
          throw 'Failed validation';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'Something went wrong';
        }
        const responseJson = undefined;
        console.log('User created with ID: ', responseJson);
        navigation.navigate('login');
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    const { firstName, lastName, email, password } = this.state;
    return (
      <ScrollView>
        <TextInput
          placeholder="First Name"
          onChangeText={(firstName) => this.setState({ firstName })}
          value={firstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          onChangeText={(lastName) => this.setState({ lastName })}
          value={lastName}
          style={styles.input}
        />

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
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => {
            this.signup();
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
  signupBtn: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#7649fe',
    margin: 5,
    borderWidth: 2,
  },
});

export default Signup;
