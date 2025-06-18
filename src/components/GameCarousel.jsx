import Carousel from 'react-native-reanimated-carousel';
import { Dimensions, View, Text, Image } from 'react-native';

const { width } = Dimensions.get('window');

const GameCarousel = ({ games }) => {
  return (
    <Carousel
      width={width * 0.9}
      height={220}
      data={games}
      style={{ alignSelf: 'center', marginVertical: 10 }}
      scrollAnimationDuration={1000}
      renderItem={({ item }) => (
        <View style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Image
            source={{ uri: item.background_image }}
            style={{ width: '100%', height: 180, borderRadius: 12 }}
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 5, color: 'white', }}>{item.name}</Text>
        </View>
      )}
    />
  );
};

export default GameCarousel;
