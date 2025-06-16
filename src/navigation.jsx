import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import GameDetailScreen from './screens/GameDetailScreen';
import MyGamesScreen from './screens/MyGamesScreen';
import PlayStationGamesScreen from './screens/PlayStationGamesScreen';
import XboxGamesScreen from './screens/XboxGamesScreen';
import MobileGamesScreen from './screens/MobileGamesScreen';
import PcGamesScreen from './screens/PcGamesScreen';
import GameProgressScreen from './screens/GameProgressScreen';

import LoginScreen from './screens/usuario/LoginScreen';
import RegisterScreen from './screens/usuario/RegisterScreen';
import ProfileViewScreen from './screens/usuario/ProfileViewScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function headerOptions(title) {
  return {
    title,
    headerStyle: { backgroundColor: '#1c1c1e' },
    headerTintColor: '#C17CFF',
    headerTitleStyle: { fontWeight: 'bold' },
  };
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Início" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detalhes" component={GameDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlayStationGames" component={PlayStationGamesScreen} options={headerOptions('PlayStation')} />
      <Stack.Screen name="XboxGames" component={XboxGamesScreen} options={headerOptions('Xbox')} />
      <Stack.Screen name="MobileGames" component={MobileGamesScreen} options={headerOptions('Mobile')} />
      <Stack.Screen name="PcGames" component={PcGamesScreen} options={headerOptions('PC')} />
    </Stack.Navigator>
  );
}

function ProfileStack({ onLogout }) {
  return (
    <Stack.Navigator screenOptions={headerOptions('Perfil')}>
      <Stack.Screen name="PerfilView">
        {(props) => <ProfileViewScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={headerOptions('')}>
      <Stack.Screen name="Login" options={{ title: 'Login' }}>
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const json = await AsyncStorage.getItem('loggedUser');
      if (json) setUser(JSON.parse(json));
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogin = async (userData) => {
    await AsyncStorage.setItem('loggedUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedUser');
    setUser(null);
  };

  if (loading) return null;

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#1c1c1e',
              borderTopWidth: 0,
              height: 68,
            },
            tabBarActiveTintColor: '#C17CFF',
            tabBarInactiveTintColor: '#555',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginBottom: 4,
            },
          }}
        >
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
              tabBarLabel: 'Progresso',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="progress-check" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Meus Jogos"
            component={MyGamesScreen}
            options={{
              tabBarLabel: 'Meus Jogos',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="playlist-edit" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Perfil"
            options={{
              tabBarLabel: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              ),
            }}
          >
            {(props) => <ProfileStack {...props} onLogout={handleLogout} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}
