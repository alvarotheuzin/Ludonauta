import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Linking, TouchableOpacity, ImageBackground } from 'react-native';
import { getGameDetails, getGameScreenshots } from '../services/rawgApi';
import Header from '../components/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { addFavoriteGame, removeFavoriteGame, isGameFavorite } from '../services/favoritesStorage';

const platformIcons = {
  PC: 'laptop',
  PlayStation: 'sony-playstation',
  Xbox: 'microsoft-xbox',
  Nintendo: 'nintendo-switch',
  iOS: 'apple-ios',
  Android: 'android',
};

const GameDetailScreen = ({ route }) => {
  const { gameId } = route.params || {};
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await getGameDetails(gameId);
        const shots = await getGameScreenshots(gameId);
        setGame(details);
        setScreenshots(shots);
      } catch (error) {
        console.error('Erro ao carregar detalhes do jogo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [gameId]);

  useEffect(() => {
    if (gameId) {
      isGameFavorite(gameId).then(setIsFavorite);
    }
  }, [gameId]);

  const toggleFavorite = async () => {
    if (!game) return;
    if (isFavorite) {
      await removeFavoriteGame(game.id);
    } else {
      await addFavoriteGame({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
      });
    }
    setIsFavorite(!isFavorite);
  };

  const openURL = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Falha ao abrir link:', err)
      );
    }
  };

  if (loading || !game) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../imagens/galaxy.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{game.name}</Text>

        {game.background_image && (
          <Image
            source={{ uri: game.background_image }}
            style={styles.coverImage}
          />
        )}

        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            {isFavorite ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
          </Text>
        </TouchableOpacity>

        <View style={styles.platformContainer}>
          {game.platforms?.map(({ platform }) => {
            const icon = Object.entries(platformIcons).find(([name]) =>
              platform.name.includes(name)
            );
            return (
              <View key={platform.id} style={styles.platformIcon}>
                <MaterialCommunityIcons
                  name={icon ? icon[1] : 'gamepad-variant'}
                  color="#ccc"
                  size={20}
                />
                <Text style={styles.platformText}>{platform.name}</Text>
              </View>
            );
          })}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.screenshotContainer}
        >
          {screenshots.map((img) => (
            <Image
              key={img.id}
              source={{ uri: img.image }}
              style={styles.screenshot}
            />
          ))}
        </ScrollView>

        <Text style={styles.subTitle}>Descrição</Text>
        <Text style={styles.description}>
          {game.description_raw || 'Descrição não disponível.'}
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

export default GameDetailScreen;

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 10,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 18 },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  favoriteButton: {
    backgroundColor: '#A020F0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  platformContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'center',
    gap: 12,
  },
  platformIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  platformText: {
    color: '#ccc',
    marginLeft: 5,
    fontSize: 14,
  },
  screenshotContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  screenshot: {
    width: 280,
    height: 160,
    marginRight: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#ddd',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 40,
  },
});