import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SecuritySettings() {
  return (
    <View style={styles.container} className='h-full'>
      <Text>SECURITY SETTINGS</Text>
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