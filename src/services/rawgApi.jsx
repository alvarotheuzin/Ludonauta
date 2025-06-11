import axios from 'axios';

const API_KEY = 'b3e3b8feb90446e483b75b9b27729abb';

const api = axios.create({
  baseURL: 'https://api.rawg.io/api',
  timeout: 5000,
  headers: {
    'User-Agent': 'LudonautaApp/1.0 (https://seusite.com)',
  },
});

//Preview com 6 jogos (Home)
const fetchGamesByPlatformsPreview = async (platformIds) => {
  try {
    const response = await api.get('/games', {
      params: {
        key: API_KEY,
        ordering: '-added',
        platforms: platformIds.join(','),
        page_size: 6,
        lang: 'pt-BR',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Erro ao buscar jogos (preview) das plataformas ${platformIds}:`, error.response?.status, error.message);
    return [];
  }
};

//Completo com 40 jogos (Progresso, listas)
const fetchGamesByPlatformsFull = async (platformIds) => {
  try {
    const response = await api.get('/games', {
      params: {
        key: API_KEY,
        ordering: '-added',
        platforms: platformIds.join(','),
        page_size: 40,
        lang: 'pt-BR',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Erro ao buscar jogos (full) das plataformas ${platformIds}:`, error.response?.status, error.message);
    return [];
  }
};

//Para a Home (6 jogos)
export const getPCGamesPreview = () => fetchGamesByPlatformsPreview([4]);
export const getXboxGamesPreview = () => fetchGamesByPlatformsPreview([1, 186]);
export const getPlayStationGamesPreview = () => fetchGamesByPlatformsPreview([18, 187]);
export const getMobileGamesPreview = () => fetchGamesByPlatformsPreview([3, 21]);

//Para listas completas (40 jogos)
export const getPCGamesFull = () => fetchGamesByPlatformsFull([4]);
export const getXboxGamesFull = () => fetchGamesByPlatformsFull([1, 186]);
export const getPlayStationGamesFull = () => fetchGamesByPlatformsFull([18, 187]);
export const getMobileGamesFull = () => fetchGamesByPlatformsFull([3, 21]);

//Carrossel de jogos novos
const fetchNewGame = async (platformId) => {
  try {
    const response = await api.get('/games', {
      params: {
        key: API_KEY,
        platforms: platformId,
        ordering: '-released',
        page_size: 1,
        lang: 'pt-BR',
      },
    });
    return response.data.results[0] || null;
  } catch (error) {
    console.error(`Erro ao buscar jogo novo da plataforma ${platformId}:`, error.response?.status, error.message);
    return null;
  }
};

export const getNewGamesForCarousel = async () => {
  const pc = await fetchNewGame(4);
  const ps5 = await fetchNewGame(187);
  const xbox = await fetchNewGame(186);
  return [pc, ps5, xbox].filter(Boolean);
};

//Buscar todos os jogos com paginação
export const getAllGames = async (page = 1, pageSize = 20) => {
  try {
    const response = await api.get('/games', {
      params: {
        key: API_KEY,
        ordering: '-released',
        page,
        page_size: pageSize,
        lang: 'pt-BR',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Erro ao buscar todos os jogos (página ${page}):`, error.response?.status, error.message);
    return [];
  }
};

// 📋 Detalhes do jogo
export const getGameDetails = async (id) => {
  try {
    const response = await api.get(`/games/${id}`, {
      params: {
        key: API_KEY,
        lang: 'pt-BR',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do jogo ${id}:`, error.response?.status, error.message);
    return null;
  }
};

// 🖼️ Capturas de tela
export const getGameScreenshots = async (id) => {
  try {
    const response = await api.get(`/games/${id}/screenshots`, {
      params: {
        key: API_KEY,
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error(`Erro ao buscar capturas do jogo ${id}:`, error.response?.status, error.message);
    return [];
  }
};
