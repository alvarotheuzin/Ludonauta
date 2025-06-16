import { useState, useCallback  } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import { getAllFavoriteGames } from '../../services/favoritesStorage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function ProfileViewScreen({ onLogout }) {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

useFocusEffect(
  useCallback(() => {
    const loadFavorites = async () => {
      const favs = await getAllFavoriteGames();
      setFavorites(favs);
    };
    loadFavorites();
  }, [])
);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameItem}
    >
      <Image source={{ uri: item.background_image }} style={styles.gameImage} />
      <Text style={styles.gameTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Jogos Favoritos</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não favoritou nenhum jogo.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Button title="Sair da conta" onPress={onLogout} color="#C17CFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#121212' 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    color: '#fff', 
    textAlign: 'center' 
  },
  gameItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  gameImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    marginRight: 15
   },
  gameTitle: { 
    color: '#fff', 
    fontSize: 18, 
    flexShrink: 1 
  },
  emptyText: { 
    color: '#aaa', 
    fontStyle: 'italic', 
    textAlign: 'center', 
    marginTop: 50 
  },
});
