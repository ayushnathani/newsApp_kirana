import React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#EAEAEA',
  },
});

const Divider = () => {
  return <View style={styles.divider} />;
};

export default Divider;
