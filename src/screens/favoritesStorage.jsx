import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorite_games';

// Adiciona um jogo aos favoritos
export const addFavoriteGame = async (game) => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    // Evita duplicata
    const alreadyExists = favorites.some(fav => fav.id === game.id);
    if (!alreadyExists) {
      favorites.push(game);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (e) {
    console.error('Erro ao adicionar favorito', e);
  }
};

// Remove um jogo dos favoritos pelo id
export const removeFavoriteGame = async (gameId) => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    let favorites = stored ? JSON.parse(stored) : [];
    favorites = favorites.filter(fav => fav.id !== gameId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Erro ao remover favorito', e);
  }
};

// Verifica se um jogo é favorito
export const isGameFavorite = async (gameId) => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    return favorites.some(fav => fav.id === gameId);
  } catch (e) {
    console.error('Erro ao verificar favorito', e);
    return false;
  }
};

// PEGA todos os jogos favoritos
export const getFavoriteGames = async () => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Erro ao pegar favoritos', e);
    return [];
  }
};
