import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';

function formatDateBR(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function MyGamesScreen() {
  const [myGames, setMyGames] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadGames = async () => {
        try {
          const storedData = await AsyncStorage.getItem('@mygames');
          const savedGames = storedData ? JSON.parse(storedData) : [];
          setMyGames(savedGames);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os jogos salvos.');
        }
      };

      loadGames();
    }, [])
  );

  const deleteGame = async (id) => {
    Alert.alert(
      'Excluir Jogo',
      'Tem certeza que deseja remover este jogo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedGames = myGames.filter((game) => game.id !== id);
              setMyGames(updatedGames);
              await AsyncStorage.setItem('@mygames', JSON.stringify(updatedGames));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o jogo.');
            }
          },
        },
      ]
    );
  };

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.gameName}>{item.gameName}</Text>
        <Text style={styles.info}>Plataforma: {item.platform}</Text>
        <Text style={styles.info}>Status: {item.status}</Text>
        <Text style={styles.info}>Progresso: {item.progress}</Text>
        <Text style={styles.info}>Horas jogadas: {item.hoursPlayed}</Text>
        <Text style={styles.info}>Início: {item.startDate}</Text>
        <Text style={styles.info}>Término: {item.endDate}</Text>
        <Text style={styles.info}>Avaliação: {item.rating}</Text>
        <Text style={styles.comment}>Comentário: {item.comment}</Text>

        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteGame(item.id)}>
          <Text style={styles.deleteButtonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Meus Jogos</Text>
      {myGames.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum progresso salvo ainda.</Text>
      ) : (
        <FlatList
          data={myGames}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    color: '#C17CFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    width: '90%',
    alignSelf: 'center',
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  info: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 4,
  },
  comment: {
    color: '#bbb',
    fontStyle: 'italic',
    marginTop: 6,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
