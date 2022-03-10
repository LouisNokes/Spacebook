import React, { Component } from 'react';
import { Text, ScrollView, Button, StyleSheet } from 'react-native';

class FriendRequest extends Component {
  // Button/Text box to add a post

  render() {
    return (
      <ScrollView style={styles.backgrd}>
        <Text>Friend Request</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  backgrd: {
    backgroundColor: '#3b5998',
  },
});

export default FriendRequest;
