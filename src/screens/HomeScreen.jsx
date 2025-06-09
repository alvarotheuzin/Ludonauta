import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import Header from '../components/Header';
import GameCarousel from '../components/GameCarousel';
import PlatformCards from '../components/PlatformCards';
import { useNavigation } from '@react-navigation/native';
import {
  getNewGamesForCarousel,
  getPCGamesPreview,
  getXboxGamesPreview,
  getPlayStationGamesPreview,
  getMobileGamesPreview,
} from '../services/rawgApi';

const GameCard = ({ game }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { gameId: game.id })} style={{ flex: 1 }}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: game.background_image }} />
        <Card.Content>
          <Title numberOfLines={1} style={styles.cardTitle}>
            {game.name}
          </Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const GameSection = ({ title, games }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <FlatList
      data={games}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <GameCard game={item} />}
      numColumns={2}
      scrollEnabled={false}
    />
  </View>
);

const HomeScreen = () => {
  const [carouselGames, setCarouselGames] = useState([]);
  const [pcGames, setPcGames] = useState([]);
  const [xboxGames, setXboxGames] = useState([]);
  const [psGames, setPsGames] = useState([]);
  const [mobileGames, setMobileGames] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setCarouselGames(await getNewGamesForCarousel());
      setPcGames(await getPCGamesPreview());
      setXboxGames(await getXboxGamesPreview());
      setPsGames(await getPlayStationGamesPreview());
      setMobileGames(await getMobileGamesPreview());
    };
    fetchAll();
  }, []);

  return (
    <ImageBackground source={require('../imagens/galaxy.jpg')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Header />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
          <GameCarousel games={carouselGames} />
          <PlatformCards />
          <GameSection title="Jogos para PC" games={pcGames} />
          <GameSection title="Jogos para Xbox" games={xboxGames} />
          <GameSection title="Jogos para PlayStation" games={psGames} />
          <GameSection title="Jogos para Celular" games={mobileGames} />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

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
  card: {
    margin: 5,
    flex: 1,
    backgroundColor: 'rgb(24, 24, 24)',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 10,
    color: '#fff',
  },
    cardTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
