import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GameDetailScreen from './screens/GameDetailScreen';
import MyGamesScreen from './screens/MyGamesScreen';
import ProfileScreen from './screens/ProfileScreen';
import PlayStationGamesScreen from './screens/PlayStationGamesScreen';
import XboxGamesScreen from './screens/XboxGamesScreen';
import MobileGamesScreen from './screens/MobileGamesScreen';
import PcGamesScreen from './screens/PcGamesScreen';
import GameProgressScreen from './screens/GameProgressScreen';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Início"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detalhes"
        component={GameDetailScreen}
        options={{ headerShown: false }}
        
      />
      <Stack.Screen
        name="PlayStationGames"
        component={PlayStationGamesScreen}
        options={{ title: 'PlayStation' }}
      />
      <Stack.Screen
        name="XboxGames"
        component={XboxGamesScreen}
        options={{ title: 'Xbox' }}
      />
      <Stack.Screen
        name="MobileGames"
        component={MobileGamesScreen}
        options={{ title: 'Mobile' }}
      />
      <Stack.Screen
        name="PcGames"
        component={PcGamesScreen}
        options={{ title: 'PC' }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gamepad-variant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Progresso"
        component={GameProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="progress-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Meus Jogos"
        component={MyGamesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="playlist-edit" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
