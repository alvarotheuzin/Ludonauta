import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const platforms = [
  {
    name: 'PlayStation',
    image: require('../imagens/playstation.png'),
    screen: 'PlayStationGames',
  },
  {
    name: 'Xbox',
    image: require('../imagens/xbox.png'),
    screen: 'XboxGames',
  },
  {
    name: 'Mobile',
    image: require('../imagens/mobile.png'),
    screen: 'MobileGames',
  },
  {
    name: 'Pc',
    image: require('../imagens/pc.png'),
    screen: 'PcGames',
  },
];

const PlatformCards = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {platforms.map((platform) => (
        <TouchableOpacity
          key={platform.name}
          style={styles.card}
          onPress={() => navigation.navigate(platform.screen)}
        >
          <Image source={platform.image} style={styles.image} />
          <Text style={styles.label}>{platform.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PlatformCards;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 15,
  },
  card: {
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  label: {
    marginTop: 5,
    fontWeight: '600',
    color: 'white',
  },
});
