import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookingDetails() {
  return (
    <View style={styles.container}>
      <Text>Booking Details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});