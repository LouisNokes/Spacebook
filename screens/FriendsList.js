import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

class FriendsList extends Component {
  // Show friend request (Accept/Reject this)

  // Show current friends
  render() {
    const { navigation } = this.props;
    return (
      <ScrollView style={styles.view}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('add');
          }}
        >
          <Text style={{ color: 'white' }}>Add Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('request');
          }}
        >
          <Text style={{ color: 'white' }}>Friend Request</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#3b5998',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b9dc3',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
});

export default FriendsList;
