import { StyleSheet, View, TouchableOpacity} from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import SignIn from './layouts/SignIn';
import ForgotPassword from './layouts/ForgotPassword';
import OTPPhone from './layouts/OTPPhone';
import GoogleSig from './layouts/GoogleSig';
import ChangePassword from './layouts/changePassword';
import SignInNow from './layouts/SignInNow';
import SignInOTP from './layouts/SignInOTP';
import Homepage from './layouts/home';
import Watering from './layouts/watering';
import Light from './layouts/light';
import Temperature from './layouts/temperature';
import Task from './layouts/task';
import Noti from './layouts/notification';
import Setting from './layouts/setting';
import Chart from './layouts/chart';

const Stack = createStackNavigator();
export default function App() {
  const headerOptions = ({ navigation }) => ({
    headerLeft: null,
    headerTitle: '',
    headerRight: () => (
      <View style={styles.headerRightContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Homepage')}>
          <Feather name='home' size={24} color='black' style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chart')}>
          <Feather name='bar-chart-2' size={24} color='black' style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Noti')}>
          <Feather name='bell' size={24} color='black' style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Feather name='settings' size={24} color='black' style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
    ),
  });
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name= 'SignIn' 
        component={SignIn} 
        options ={{headerTitleAlign: 'center',headerTitleStyle: { fontSize: 24 },headerTitle:'Welcome !!!'}}/>
        <Stack.Screen name= 'ForgotPassword' 
        component={ForgotPassword}
        options={{headerTitleStyle:{fontSize:24}, headerTitle:'Sign In'}}/>
        <Stack.Screen name= 'OTPPhone' component={OTPPhone}
        options={{headerTitle:'OTP Verification'}}/>
        <Stack.Screen name= 'changePassword' component={ChangePassword}
        options={{headerTitle:'OTP Verification'}}/>
        <Stack.Screen name='GoogleSig' component={GoogleSig}
        options={{headerTitle:'Sign In'}}/>
        <Stack.Screen name= 'SignInNow' component={SignInNow}
        options={{headerTitle:'Sign In with OTP'}}/>
        <Stack.Screen name='SignInOTP' component={SignInOTP}
        options={{headerTitle:'Sign In'}} />
        <Stack.Screen
          name='Homepage'
          component={Homepage}
          options={headerOptions}
        />
        <Stack.Screen name = 'Watering' component={Watering}
        options={headerOptions}/>
        <Stack.Screen name = 'Light' component={Light}
        options={headerOptions}/>
        <Stack.Screen name = 'Tempera' component={Temperature}
        options={headerOptions}/>
        <Stack.Screen name = 'Task' component={Task}
        options={headerOptions}/>
        <Stack.Screen name = 'Noti' component={Noti} 
        options={headerOptions}/>
        <Stack.Screen name = 'Setting' component={Setting}
        options={headerOptions}/>
        <Stack.Screen name = 'Chart' component={Chart}
        options={headerOptions}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 45,
    width: 325, 
  },
  headerIcon: {
    marginLeft: 15,
  }
});
