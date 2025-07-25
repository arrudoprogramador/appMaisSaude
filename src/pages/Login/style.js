import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      cabecalho: {
        backgroundColor: '#4C9BE5',
        width: '100%',
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: '40%',
        borderBottomRightRadius: '40%',
      },
      avatar: {
        width: 80,
        height: 80,
      },

      content:{
        width: '100%',
        flex:0.7,
        alignItems:'center',
      },

      buttons:{
        width: '100%',
        flex:0.1,
        alignItems:'center',
      },

      title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginTop: 20,
        color:'#333',
        paddingTop:40,
        paddingBottom:20
      },
      input: {
        width: '80%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 40,
        marginTop: 20,
        paddingHorizontal: 10,
        fontSize: 18,
        color: '#777',

      },
      button: {
        backgroundColor: '#4C9BE5',
        paddingVertical: 15,
        borderRadius: 30,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
      },
      signupText: {
        marginTop: 20,
        fontSize: 18,
        color: '#777',

      },
      signupLink: {
        color: '#4C9BE5',
        fontWeight: 'bold',
      },
    });


