import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Linking, TouchableOpacity, ImageBackground, } from 'react-native';
import { getGameDetails, getGameScreenshots } from '../services/rawgApi';

const storeLogos = {
  Steam: require('../imagens/steam.png'),
  'Epic Games Store': require('../imagens/epic.png'),
};

const GameDetailScreen = ({ route }) => {
  const { gameId } = route.params || {};
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

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

  if (loading)
    return <Text style={styles.loadingText}>Carregando...</Text>;
  if (!game)
    return <Text style={styles.loadingText}>Jogo não encontrado.</Text>;

  const openURL = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Falha ao abrir link:', err)
      );
    }
  };

  return (
    <ImageBackground
      source={require('../imagens/galaxy.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{game.name || 'Nome indisponível'}</Text>

        <Text style={styles.subTitle}>Capturas de Tela</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.screenshotContainer}
        >
          {screenshots.length > 0 ? (
            screenshots.map((img) => (
              <Image
                key={img.id}
                source={{ uri: img.image }}
                style={styles.screenshot}
              />
            ))
          ) : (
            <Text style={styles.noScreenshots}>Nenhuma captura disponível.</Text>
          )}
        </ScrollView>

        <Text style={styles.subTitle}>Disponível em:</Text>
        <View style={styles.storeButtonsContainer}>
          {game.stores?.length > 0 ? (
            game.stores.map(({ store, url }, index) => {
              if (!url) return null;
              const logo = storeLogos[store.name];
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.storeButton}
                  onPress={() => openURL(url)}
                >
                  {logo ? (
                    <Image source={logo} style={styles.storeLogo} />
                  ) : (
                    <Text style={styles.storeText}>{store.name}</Text>
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noStores}>Nenhuma loja disponível.</Text>
          )}
        </View>

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
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingText: {
    color: 'white',
    padding: 20,
    textAlign: 'center',
  },
  subTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  screenshotContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  screenshot: {
    width: 300,
    height: 180,
    marginRight: 10,
    borderRadius: 10,
  },
  noScreenshots: {
    color: '#ccc',
    marginLeft: 10,
    fontSize: 14,
  },
  storeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 10,
  },
  storeButton: {
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  storeLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  storeText: {
    color: '#fff',
    fontSize: 14,
  },
  noStores: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
});
