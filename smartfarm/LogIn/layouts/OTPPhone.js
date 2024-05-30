import { StyleSheet, Text, View,TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {useState,useRef,useEffect} from 'react';
import FlashMessage, { showMessage } from "react-native-flash-message";


export default function OTPPhone({route}) {
  const { PhoneNum } = route.params;
  let clockCall = null;
  const onPress = useNavigation();
  const [isError, setIsError] = useState('');
  const [values, setValues] = useState(Array(6).fill(''));
  const verifyOTP = () => {
    const enteredOtp = values.join('');
    if (values.some(value => value === '')) {
      setIsError('Enter OTP code !!!');
    } else if (enteredOtp !== randomOtpcode) {
      setIsError('Wrong OTP code !!!');
    } else {
      setIsError(false);
      onPress.navigate('changePassword', { PhoneNum: PhoneNum });
    }
  }
  const handleTextChange = (text, index) => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);

    if (text.length === 1) {
      focusNextInput(index);
    }
    if (text !== ''){
      setIsError(false)
    }
  };
  
  console.log('Button Pressed')
  const inputs = useRef([]);

  const focusNextInput = (index) => {
    if (inputs.current[index + 1]) {
      inputs.current[index + 1].focus();
    }
  };
  const defaultCountDown = 30;
  const [CountDown, setCountDown] = useState(defaultCountDown);
  const [enableResend, setenableResend] = useState(false);
  useEffect(() => {
      clockCall = setInterval(()=>{
        decrementClock()
      },1000)
      return () => {
        clearInterval(clockCall)
      }
  })
  const decrementClock = () => {
    if (CountDown === 0){
      setenableResend(true);
      setCountDown(0);
      clearInterval(clockCall)
    } else {
      setCountDown(CountDown-1)
    }
  }
  const onResendOTP = () => {
    if (enableResend){
      setCountDown(defaultCountDown);
      setenableResend(false);
      clearInterval(clockCall);
      clockCall = setInterval(() =>{
        decrementClock(0);
      },1000)
      const newRandomOtpcode = data[Math.floor(Math.random() * data.length)];
      setRandomOtpcode(newRandomOtpcode);
      setTimeout(() => {
        showMessage({
          message: "OTP Notification",
          description: `Your OTP code is ${newRandomOtpcode}`,
          type: "info",
          floating: true,
          position: 'top', 
          duration: 4000,
        });
      }, 1000);
    }
  }

  const [data, setData] = useState([]);
  const [randomOtpcode, setRandomOtpcode] = useState(null);
  
  useEffect(() => {
    fetch('http://10.229.86.82:3000/datas')
      .then(response => response.json())
      .then(json => {
        const otpcodes = json.otpcode;
        setData(otpcodes);
      })
      .catch(error => console.error(error));
  }, []);
  
  useEffect(() => {
    if (data.length > 0) {
      const newRandomOtpcode = data[Math.floor(Math.random() * data.length)];
      setRandomOtpcode(newRandomOtpcode);
    }
  }, [data]);
  
  useEffect(() => {
    if (randomOtpcode !== null) {
      setTimeout(() => {
        showMessage({
          message: "OTP Notification",
          description: `Your OTP code is ${randomOtpcode}`,
          type: "info",
          floating: true,
          position: 'top',
          duration: 4000,
        });
      }, 1000);
    }
  }, [randomOtpcode]);
  
  return (
    <View style={styles.container}>
      <FlashMessage position="top" />
      <Image
        style={styles.image6}
        source={require('../assets/images/padlock.png')}
      />
      <Text style={{fontSize:30,fontWeight:'bold'}}>Verify OTP</Text>
      <Text style={styles.OTP0}>Enter the OTP code.</Text>
      <View style={styles.DontHaveAccount}>
        <Text>Didn't receive OTP Code?</Text>
        <TouchableOpacity onPress = {onResendOTP}>
          <Text style={[{fontWeight:'bold',color:'red'},{
            color: enableResend ? 'red':'#a9a9a9' 
          }]}> Resend OTP {CountDown > 0 && `(${CountDown}s)`} </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container0}>
      {[...Array(6)].map((_, index) => (
        <TextInput
          key={index}
          ref={(input) => inputs.current.push(input)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleTextChange(text, index)}
        />
      ))}
    </View>
    {isError ? <Text style={{ color: 'red', fontWeight:'bold', marginTop: 7 }}>{isError}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={verifyOTP}>
        <Text style={{fontWeight:'bold',color:'white'}}> Verify OTP</Text>
      </TouchableOpacity>
      <View style={styles.DontHaveAccount}>
        <Text>Don't have account yet?</Text>
        <TouchableOpacity>
          <Text style={{fontWeight:'bold',color:'red'}}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 20
    },
    image6: {
      width: 150,
      height: 150,
      marginRight: 10,
      marginBottom:20
    },
    OTP0:{
      textAlign:'center',
      color:'#696969',
      fontSize: 14,
      marginTop:8
    },
    button: {
      width: '80%',
      alignItems: 'center',
      backgroundColor: '#5DB075',
      padding: 16,
      borderRadius: 6,
      marginTop: 12
    },
    DontHaveAccount: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center'
    },
    container0: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    input: {
      width: 40,
      height: 45,
      marginHorizontal: 5,
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      borderWidth: 1,
    },
  });
  
