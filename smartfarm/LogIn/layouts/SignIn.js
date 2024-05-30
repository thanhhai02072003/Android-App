import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as React from "react";
import { useState, useEffect } from "react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://10.229.71.101:3000/datas")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onPress = useNavigation();

  const handleForgotPassword = () => {
    onPress.navigate("ForgotPassword");
  };

  const handleSignInOTP = () => {
    onPress.navigate("SignInOTP");
  };

  const handleGoogleSig = () => {
    onPress.navigate("GoogleSig");
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [IsPhoneNumEntered, setIsPhoneNumEntered] = useState(false);
  const [marginLeftValue, setMarginLeftValue] = useState(0);

  const handleSignIn = () => {
    const userIndex = data.phonenum.indexOf(phoneNumber);
    if (phoneNumber === "") {
      setPhoneError(true);
      setIsPhoneNumEntered(false);
      setPasswordError("");
    } else if (userIndex === -1) {
      setIsPhoneNumEntered(true);
      setPhoneError(true);
      setPasswordError("");
    } else {
      setPhoneError(false);
      if (IsPhoneNumEntered && password === "") {
        setPasswordError("Enter your password !!!");
        setMarginLeftValue(-200);
      } else if (IsPhoneNumEntered && password !== data.password[userIndex]) {
        setPasswordError("Wrong password !!!");
        setMarginLeftValue(-225);
      } else {
        setPasswordError("");
      }
    }

    if (userIndex !== -1 && password === data.password[userIndex]) {
      onPress.navigate("Homepage");

      setPhoneNumber("");
      setPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image0}
        source={require("../assets/images/field.png")}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={(text) => {
            setPhoneNumber(text);
            if (text !== "") {
              setIsPhoneNumEntered(true);
              setPhoneError(false);
            }
          }}
        />
      </View>
      {!IsPhoneNumEntered && phoneError && (
        <View style={{ marginTop: 4, marginBottom: -10, marginLeft: -173 }}>
          <Text style={{ color: "red", fontWeight: "bold" }}>
            Enter your phone number !!!
          </Text>
        </View>
      )}
      {IsPhoneNumEntered && phoneError && (
        <View style={{ marginTop: 4, marginBottom: -10, marginLeft: -159 }}>
          <Text style={{ color: "red", fontWeight: "bold" }}>
            Enter a valid phone number !!!
          </Text>
        </View>
      )}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.password}
          placeholder="Enter password"
          keyboardType="default"
          maxLength={300}
          secureTextEntry={!showPassword}
          onChangeText={(text) => {
            setPassword(text);
            if (text !== "") {
              setPasswordError(false);
            }
          }}
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={togglePasswordVisibility}
        >
          <Image
            source={
              showPassword
                ? require("../assets/images/hide_pass.png")
                : require("../assets/images/show_pass.png")
            }
            style={styles.showPasswordIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text
          style={{
            color: "red",
            fontWeight: "bold",
            marginTop: 7,
            marginLeft: marginLeftValue,
          }}
        >
          {passwordError}
        </Text>
      ) : null}
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={handleForgotPassword}
      >
        <Text style={{ fontWeight: "bold", color: "red" }}>
          Forgot Password
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={{ fontWeight: "bold", color: "white" }}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.newline}>
        <View style={styles.line} />
        <Text style={styles.text}>ANOTHER WAY</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity style={styles.button1} onPress={handleGoogleSig}>
        <Image
          style={styles.image1}
          source={require("../assets/images/google.png")}
        />

        <Text style={styles.text1}>Sign In with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={handleSignInOTP}>
        <Image
          style={styles.image2}
          source={require("../assets/images/password.png")}
        />
        <Text style={styles.text2}>Sign In with Phone OTP</Text>
      </TouchableOpacity>
      <View style={styles.DontHaveAccount}>
        <Text>Don't have account yet?</Text>
        <TouchableOpacity>
          <Text style={{ fontWeight: "bold", color: "red" }}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  image0: {
    width: 150,
    height: 150,
    marginRight: 10,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    height: 55,
    backgroundColor: "#E3DEDE",
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    borderRadius: 6,
  },
  passwordContainer: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    alignItems: "center",
    backgroundColor: "#E3DEDE",
    borderRadius: 6,
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
    marginRight: 5,
  },
  showPasswordIcon: {
    width: 24,
    height: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginRight: 24,
    marginTop: 7,
  },
  button: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#5DB075",
    padding: 16,
    borderRadius: 6,
    marginTop: 7,
  },
  newline: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#C0C0C0",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 12,
    color: "#C0C0C0",
  },
  button1: {
    width: "90%",
    marginTop: 20,
    marginHorizontal: 20,
    height: 55,
    backgroundColor: "#E3DEDE",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  image1: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text1: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: -30,
  },
  button2: {
    width: "90%",
    marginTop: 10,
    marginHorizontal: 20,
    height: 55,
    backgroundColor: "#E3DEDE",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  image2: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text2: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: -30,
  },
  DontHaveAccount: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
