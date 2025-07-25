import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import style from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensagem, setModalMensagem] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      setModalMensagem('Por favor, preencha todos os campos.');
      setModalVisible(true);
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password: senha
      });
  
      const token = response.data.token;
  
      if (token) {
        await AsyncStorage.setItem('authToken', token); 
        setModalMensagem('Login realizado com sucesso!');
        setModalVisible(true);
      } else {
        setModalMensagem('Token não recebido. Tente novamente.');
        setModalVisible(true);
      }
  
    } catch (error) {
      console.error(error);
      setModalMensagem('Erro ao fazer login. Verifique os dados e tente novamente.');
      setModalVisible(true);
    }
  };
  

  return (
    <View style={style.container}>
      <StatusBar style="auto" />

          {/* 🌈 CABEÇALHO COM GRADIENTE */}
      <LinearGradient
        colors={['#4C9BE5', '#87CEEB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={style.cabecalho}
      >
        <Image
          style={style.avatar}
          // source={require('./path/to/your/icon.png')} // se tiver logo
        />
      </LinearGradient>
      <View style={style.content}>
        <Text style={style.title}>Faça Login</Text>

        <TextInput
          style={style.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={style.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <View style={style.buttons}>
        <TouchableOpacity style={style.button} onPress={handleLogin}>
          <Text style={style.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={style.signupText}>
            Não tem uma conta? <Text style={style.signupLink}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de resposta */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                <View style={{ width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center', elevation: 5 }}>
                  <Text style={{ fontSize: 18, marginBottom: 15 }}>{modalMensagem}</Text>
                  <Pressable style={{ backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }} onPress={() => {
                    setModalVisible(false);
                    if (modalMensagem.includes("sucesso")) {
                      navigation.navigate("Home");
                    }
                  }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
    </View>
  );
}
