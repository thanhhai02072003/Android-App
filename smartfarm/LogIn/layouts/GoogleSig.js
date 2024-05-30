import { StyleSheet, Text, View,TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {useState, useEffect} from 'react';


export default function GoogleSig() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://10.229.86.82:3000/datas')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const onPress = useNavigation();

  const [Email, setEmail] = useState('');
  const [EmailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [IsEmailEntered, setIsEmailEntered] = useState(false);
  const [marginLeftValue, setMarginLeftValue] = useState(0);
  const handleEmail = () => {
    const userIndex = data.gmailuser.indexOf(Email);
    if (Email === '') {
      setEmailError(true);
      setIsEmailEntered(false);
      setPasswordError('');
    } else if (userIndex === -1) {
      setIsEmailEntered(true);
      setEmailError(true);
      setPasswordError('');
    } else {
      setEmailError(false);
      if (IsEmailEntered && password === '') {
        setPasswordError('Enter your password !!!');
        setMarginLeftValue(-200);
      } else if (IsEmailEntered && password !== data.gmailpass[userIndex]) {
        setPasswordError('Wrong password !!!');
        setMarginLeftValue(-225);
      } else {
        setPasswordError('');
      }
      if (userIndex !== -1 && password === data.gmailpass[userIndex]) {
        onPress.navigate('Homepage');
      }
    }
  };


  return (
    <View style={styles.container}>
      <Image
          style={styles.image0}
          source={require('../assets/images/google.png')}
        />
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email Account"
        keyboardType= "email-address"
        maxLength={50}
        onChangeText={text => {
          setEmail(text);
          if (text !== '') {
            setIsEmailEntered(true);
            setEmailError(false);
          }
        }}
      />
    </View>
    {!IsEmailEntered && EmailError && (
      <View style={{ marginTop: 4, marginBottom: -10, marginLeft: -173}}>
        <Text style={{ color: 'red', fontWeight:'bold' }}>Enter your Email account !!!</Text>
      </View>
    )}
    {IsEmailEntered && EmailError && (
      <View style={{ marginTop: 4, marginBottom: -10, marginLeft: -159}}>
        <Text style={{ color: 'red', fontWeight:'bold' }}>Enter a valid Email account !!!</Text>
      </View>
    )}
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.password}
        placeholder="Enter password"
        keyboardType="default"
        maxLength={300}
        secureTextEntry={!showPassword}
        onChangeText={text => {
          setPassword(text);
          if (text !== ''){
            setPasswordError(false)
          }
        }}
      />
    <TouchableOpacity
      style={styles.showPasswordButton}
      onPress={togglePasswordVisibility}>
      <Image
        source={
          showPassword
            ? require('../assets/images/hide_pass.png')
            : require('../assets/images/show_pass.png')
        }
        style={styles.showPasswordIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
    </View>
    {passwordError ? <Text style={{ color: 'red', fontWeight:'bold', marginTop: 7 , marginLeft: marginLeftValue}}>{passwordError}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleEmail}>
        <Text style={{fontWeight:'bold',color:'white'}}>Sign In with Google Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30
  },
  image0: {
    width: 150,
    height: 150,
    marginRight: 10,
    marginBottom:20
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    height: 55,
    backgroundColor: '#E3DEDE', 
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    borderRadius: 6
  },
  passwordContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#E3DEDE',
    borderRadius: 6
  },
  password: {
    flex: 1,
    height: 55,
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
  },
  showPasswordButton: {
    padding: 10,
    marginRight: 5
  },
  showPasswordIcon: {
    width: 24,
    height: 24,
  },
  button: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#5DB075',
    padding: 16,
    borderRadius: 6,
    marginTop: 15
  }
});






