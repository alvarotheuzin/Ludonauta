import axios from 'axios';

const API_KEY = 'b3e3b8feb90446e483b75b9b27729abb';

const getPlatforms = async () => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
    response.data.results.forEach((platform) => {
      console.log(`${platform.name}: ${platform.id}`);
    });
  } catch (error) {
    console.error('Erro ao buscar plataformas:', error);
  }
};

getPlatforms();
