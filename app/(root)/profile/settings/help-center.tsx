import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HelpCenterSettings() {
  return (
    <View style={styles.container} className='h-full'>
      <Text>HELP CENTER SETTINGS</Text>
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