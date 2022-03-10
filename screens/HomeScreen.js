import React, { Component } from 'react';
import { Text, ScrollView, Button, StyleSheet } from 'react-native';

class HomeScreen extends Component {
  // Button/Text box to add a post

  render() {
    return (
      <ScrollView style={styles.backgrd}>
        <Text>home</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backgrd: {
    backgroundColor: '#3b5998',
  },
});

export default HomeScreen;
