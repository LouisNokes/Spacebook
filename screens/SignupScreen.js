/* eslint-disable no-throw-literal */
import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
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

    // Check email is valid

    if (
      first_name === '' ||
      last_name === '' ||
      email === '' ||
      password === ''
    ) {
      alert('Please fill in all fields');
    } else if (password.length < 5) {
      alert('Password must be more than 5 characters');
    } else if (!email.includes('@')) {
      alert('Invalid email entered');
    } else {
      return fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }).then((response) => {
        if (response.status === 201) {
          navigation.navigate('login');
          alert('Account created successfully');
        }
        if (response.status === 400) {
          throw new Error('Failed validation');
        } else {
          throw 'Something went wrong';
        }
      });
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
          secureTextEntry
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
