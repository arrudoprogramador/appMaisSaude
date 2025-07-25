import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, Modal, Button, Pressable, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import style from './style';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function Cadastro() {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [foto, setFoto] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensagem, setModalMensagem] = useState('');


  
  const pegarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,  
    });


    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const filename = `foto_${Date.now()}.jpg`;

      setFoto({
        uri: `data:${asset.type};base64,${asset.base64}`,
        name: filename,
        type: asset.type || 'image/jpeg',
      });
      console.log('Imagem capturada:', {
        uri: asset.uri,
        name: filename,
        type: asset.type || 'image/jpeg',
      });

    } else {
      console.warn('Nenhuma imagem selecionada.');
    }
  };

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

 const handleCadastro = async () => {
  if (!nome || !email || !senha || !altura || !peso) {
    setModalMensagem('Preencha todos os campos obrigatórios.');
    setModalVisible(true);
    return;
  }

  const dados = new FormData();

  dados.append('nome', nome);
  dados.append('email', email);
  dados.append('password', senha);
  dados.append('altura', altura);
  dados.append('peso', peso);

  if (foto && foto.uri && foto.uri.startsWith('data:')) {
    const blob = dataURLtoBlob(foto.uri);
    dados.append('foto', blob, foto.name || 'foto.jpg');
  } else if (foto && foto.uri) {
    dados.append('foto', {
      uri: Platform.OS === 'android' ? foto.uri : foto.uri.replace('file://', ''),
      name: foto.name || 'foto.jpg',
      type: foto.type || 'image/jpeg',
    });
  }

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/conta/adicionar',
      dados,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 201 || response.data?.mensagem?.includes("sucesso")) {
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        console.log("Token salvo com sucesso!");
      }

      setModalMensagem('Cadastro realizado com sucesso!');
      setModalVisible(true);
      navigation.navigate("Login");
    } else {
      setModalMensagem('Cadastro realizado, mas houve um aviso inesperado.');
      setModalVisible(true);
    }
  } catch (error) {
    console.error("Erro:", JSON.stringify(error.response?.data || error.message, null, 2));

    // 💡 Extrai erros do Laravel (campo `errors`)
    const errors = error.response?.data?.errors;
    if (errors) {
      const mensagens = Object.values(errors).flat().join('\n');
      setModalMensagem(mensagens);
    } else if (error.response?.data?.message) {
      setModalMensagem(error.response.data.message);
    } else {
      setModalMensagem('Erro ao cadastrar. Verifique os dados e tente novamente.');
    }

    setModalVisible(true);
  }
};




  return (
    <View style={style.container}>
      <StatusBar style="auto" />

<LinearGradient
  colors={['#4C9BE5', '#87CEEB']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={style.cabecalho}
>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          {foto && (
            <Image
              source={{ uri: foto.uri }}
              style={{ width: 150, height: 150, borderRadius: 75, marginTop: 10 }}
            />
          )}
          <Button title="Escolher Foto" onPress={pegarFoto} />
        </View>
        </LinearGradient>

      <View style={style.content}>
        <Text style={style.title}>Crie uma conta</Text>

        <TextInput style={style.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={style.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={style.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
        <TextInput style={style.input} placeholder="Altura" keyboardType="numeric" value={altura} onChangeText={setAltura} />
        <TextInput style={style.input} placeholder="Peso" keyboardType="numeric" value={peso} onChangeText={setPeso} />

        

      </View>

      <View style={style.buttons}>
        <TouchableOpacity style={style.button} onPress={handleCadastro}>
          <Text style={style.buttonText}>Cadastre-se</Text>
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
                navigation.navigate("Login");
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
