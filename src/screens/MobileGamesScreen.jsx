import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getMobileGamesFull } from '../services/rawgApi';

const MobileGamesScreen = () => {
  const [games, setGames] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMobileGamesFull();
      setGames(data);
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => navigation.navigate('Detalhes', { gameId: item.id })}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.background_image }} />
        <Card.Content>
          <Title numberOfLines={1} style={styles.cardTitle}>
            {item.name}
          </Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../imagens/galaxy.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.container}
          scrollEnabled={true}
        />
      </View>
    </ImageBackground>
  );
};

export default MobileGamesScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: 'rgb(24, 24, 24)',
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
