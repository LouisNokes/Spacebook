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
    const { first_name, last_name, email, password } = this.state;
    const { navigation } = this.props;
    const userData = {
      first_name,
      last_name,
      email,
      password,
    };

    if (
      first_name === '' ||
      last_name === '' ||
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
          navigation.navigate('login');
          ToastAndroid.show('Account created successfully', ToastAndroid.SHORT);
        }
        if (response.status === 400) {
          throw new Error('Failed validation');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    const { first_name, last_name, email, password } = this.state;
    return (
      <ScrollView style={styles.backgrd}>
        <TextInput
          placeholder="First Name"
          onChangeText={(first_name) => this.setState({ first_name })}
          value={first_name}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          onChangeText={(last_name) => this.setState({ last_name })}
          value={last_name}
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
          <Text style={{ color: 'white' }}>SIGN UP</Text>
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
    backgroundColor: '#FFFFFF',
  },
  signupBtn: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8b9dc3',
    margin: 5,
    borderWidth: 2,
  },
  backgrd: {
    backgroundColor: '#3b5998',
  },
});

export default Signup;
