import { StyleSheet, Text, View,TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {useState} from 'react';

export default function ChangePassword({route}) {
    const onPress = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const [showPassword1, setShowPassword1] = useState(false);
    const togglePasswordVisibility1 = () => {
      setShowPassword1(!showPassword1);
    };
    const [newPass, setnewPass] = useState('');
    const [newPassError, setnewPassError] = useState(false);
    const [checkPass, setcheckPass] = useState('');
    const [checkPassError, setcheckPassError] = useState('');
    const [IsNewPassEntered, setIsNewPassEntered] = useState(false);
    const [marginLeftValue, setMarginLeftValue] = useState(0);
    const ChangePass = async () => {
      if (newPass === '') {
        setnewPassError(true);
        setIsNewPassEntered(false);
      } else {
        setnewPassError(false);
        setIsNewPassEntered(true);
      }
      if (IsNewPassEntered && checkPass === '') {
        setcheckPassError('Re-Enter your new password !!!');
        setMarginLeftValue(-145);
      } else {
        setcheckPassError('');
      }

      if (newPass !== '' && checkPass !== '') {
        if (newPass !== checkPass) {
          setcheckPassError('Passwords do not match');
          setMarginLeftValue(-190);
        } else {

          try {
            const response = await fetch('http://10.229.86.82:3000/change', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phonenumbers: PhoneNum,
                newpassword: newPass,
              }),
            });
            
            if (response.ok) {
              onPress.navigate('SignIn');
            } else {
              console.error('Error updating password:', response.statusText);
            }
          } catch (error) {
            console.error('Error updating password:', error.message);
          }
        }
      }
    };
    const { PhoneNum } = route.params;
    return (
        <View style={styles.container}>
          <Image
              style={styles.image0}
              source={require('../assets/images/login.png')}
            />
          <View style={styles.passwordContainer}>
          <TextInput
            style={styles.password}
            placeholder="Enter password"
            keyboardType="default"
            maxLength={300}
            secureTextEntry={!showPassword}
            onChangeText={text => {
              setnewPass(text);
              if (text !== '') {
                setIsNewPassEntered(true);
                setnewPassError(false);
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
        {!IsNewPassEntered && newPassError && (
            <View style={{ marginTop: 4, marginBottom: -10, marginLeft: -172}}>
              <Text style={{ color: 'red', fontWeight:'bold' }}>Enter your new Password !!!</Text>
            </View>
        )}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.password}
            placeholder="Re-enter password"
            keyboardType="default"
            maxLength={300}
            secureTextEntry={!showPassword1}
            onChangeText={text => {
              setcheckPass(text);
              if (text !== '') {
                setcheckPassError(false);
              }
            }}
          />
        <TouchableOpacity
        style={styles.showPasswordButton}
        onPress={togglePasswordVisibility1}>
        <Image
            source={
            showPassword1
                ? require('../assets/images/hide_pass.png')
                : require('../assets/images/show_pass.png')
            }
            style={styles.showPasswordIcon}
            resizeMode="contain"
        />
        </TouchableOpacity>
        </View>
        {checkPassError ? <Text style={{ color: 'red', fontWeight:'bold', marginTop: 7, marginBottom: -15 ,marginLeft:marginLeftValue}}>{checkPassError}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={ChangePass} >
            <Text style={{fontWeight:'bold',color:'white'}}>Change Password</Text>
          </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 50
    },
    image0: {
      width: 170,
      height: 170,
      marginRight: 10,
      marginBottom:20
    },
    inputContainer: {
      flexDirection: 'row',
      marginLeft: 20,
      marginRight: 20,
      marginTop: 15,
      alignItems: 'center',
      backgroundColor: '#E3DEDE',
      borderRadius: 6
    },
    input: {
      flex: 1,
      height: 55,
      fontSize: 16,
      paddingLeft: 20,
      paddingRight: 20
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
    },
    showPasswordIcon: {
      width: 24,
      height: 24,
      marginRight: 5
    },
    forgotPassword:{
      alignSelf:'flex-end',
      marginRight: 24,
      marginTop: 7
    },
    button: {
      width: '90%',
      alignItems: 'center',
      backgroundColor: '#5DB075',
      padding: 16,
      borderRadius: 6,
      marginTop: 25
    }
});