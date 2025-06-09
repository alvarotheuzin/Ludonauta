import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, Alert, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { getPCGamesFull, getXboxGamesFull, getPlayStationGamesFull, getMobileGamesFull } from '../services/rawgApi';

export default function GameProgressScreen({ navigation }) {
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [platform, setPlatform] = useState('');
    const [status, setStatus] = useState('Jogando');
    const [progress, setProgress] = useState('');
    const [hoursPlayed, setHoursPlayed] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        async function fetchPlatformGames() {
            if (!platform) {
                setGames([]);
                return;
            }

            let data = [];
            if (platform === 'PC') data = await getPCGamesFull();
            else if (platform === 'PlayStation') data = await getPlayStationGamesFull();
            else if (platform === 'Xbox') data = await getXboxGamesFull();
            else if (platform === 'Mobile') data = await getMobileGamesFull();

            setGames(data);
            setSelectedGameId('');
        }

        fetchPlatformGames();
    }, [platform]);

    async function handleSave() {
        const selectedGame = games.find(g => g.id.toString() === selectedGameId);

        if (!selectedGame) {
            Alert.alert('Erro', 'Por favor selecione um jogo');
            return;
        }

        const newEntry = {
            id: Date.now().toString(),
            gameId: selectedGame.id,
            gameName: selectedGame.name,
            platform,
            status,
            progress,
            hoursPlayed,
            startDate,
            endDate,
            rating,
            comment,
        };

        try {
            const storedData = await AsyncStorage.getItem('@mygames');
            const currentList = storedData ? JSON.parse(storedData) : [];
            const updatedList = [...currentList, newEntry];
            await AsyncStorage.setItem('@mygames', JSON.stringify(updatedList));

            setSavedMessage(`Progresso salvo para ${selectedGame.name}!`);
            setSelectedGameId('');
            setPlatform('');
            setStatus('Jogando');
            setProgress('');
            setHoursPlayed('');
            setStartDate('');
            setEndDate('');
            setRating('');
            setComment('');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar progresso.');
        }
    }

    return (
        <ImageBackground
            source={require('../imagens/galaxy.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Header />
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Registrar Progresso do Jogo</Text>

                    <Text style={styles.label}>Plataforma:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={platform}
                            onValueChange={setPlatform}
                            style={styles.picker}
                            dropdownIconColor="#fff"
                        >
                            <Picker.Item label="Selecione a plataforma" value="" color="#999" />
                            <Picker.Item label="PC" value="PC" />
                            <Picker.Item label="PlayStation" value="PlayStation" />
                            <Picker.Item label="Xbox" value="Xbox" />
                            <Picker.Item label="Mobile" value="Mobile" />
                        </Picker>
                    </View>

                    {platform !== '' && (
                        <>
                            <Text style={styles.label}>Escolha o jogo:</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={selectedGameId}
                                    onValueChange={setSelectedGameId}
                                    style={styles.picker}
                                    dropdownIconColor="#fff"
                                >
                                    <Picker.Item label="Selecione um jogo" value="" color="#999" />
                                    {games.map(game => (
                                        <Picker.Item key={game.id} label={game.name} value={game.id.toString()} />
                                    ))}
                                </Picker>
                            </View>
                        </>
                    )}

                    <Text style={styles.label}>Status:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={status}
                            onValueChange={setStatus}
                            style={styles.picker}
                            dropdownIconColor="#fff"
                        >
                            <Picker.Item label="Jogando" value="Jogando" />
                            <Picker.Item label="Pausado" value="Pausado" />
                            <Picker.Item label="Completo" value="Completo" />
                            <Picker.Item label="Abandonado" value="Abandonado" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Progresso (% ou nível):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 50 ou Capítulo 3"
                        placeholderTextColor="#aaa"
                        value={progress}
                        onChangeText={setProgress}
                    />

                    <Text style={styles.label}>Horas jogadas:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Ex: 20"
                        placeholderTextColor="#aaa"
                        value={hoursPlayed}
                        onChangeText={setHoursPlayed}
                    />

                    <Text style={styles.label}>Data de início:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA-MM-DD"
                        placeholderTextColor="#aaa"
                        value={startDate}
                        onChangeText={setStartDate}
                    />

                    <Text style={styles.label}>Data de término:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA-MM-DD"
                        placeholderTextColor="#aaa"
                        value={endDate}
                        onChangeText={setEndDate}
                    />

                    <Text style={styles.label}>Avaliação pessoal (1 a 10):</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Ex: 8"
                        placeholderTextColor="#aaa"
                        value={rating}
                        onChangeText={setRating}
                    />

                    <Text style={styles.label}>Comentário:</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        multiline
                        placeholder="Escreva sua opinião"
                        placeholderTextColor="#aaa"
                        value={comment}
                        onChangeText={setComment}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Salvar Progresso</Text>
                    </TouchableOpacity>

                    {savedMessage ? <Text style={styles.savedMessage}>{savedMessage}</Text> : null}
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)'
    },
    container: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center'
    },
    label: {
        color: '#ccc',
        marginTop: 12
    },
    pickerWrapper: {
        backgroundColor: '#222',
        borderRadius: 8
    },
    picker: {
        color: '#fff'
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: 8,
        padding: 10,
        marginTop: 8
    },
    button: {
        backgroundColor: '#1E90FF',
        padding: 14,
        borderRadius: 8,
        marginTop: 24
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    savedMessage: {
        color: 'limegreen',
        marginTop: 12,
        textAlign: 'center'
    },
});
