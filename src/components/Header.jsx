import React from 'react';
import { Appbar, Avatar } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <Appbar.Header style={styles.header}>
      <View style={styles.left}>
        <Avatar.Image
          size={36}
          source={require('../imagens/ludonauta-icon.png')}
        />
        <Text style={styles.title}>Ludonauta</Text>
      </View>
      <Appbar.Action icon="magnify" onPress={() => {}} />
    </Appbar.Header>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1c1c1e',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
