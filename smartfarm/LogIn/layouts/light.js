import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Button as ElementsButton } from "react-native-elements";
import { ActivityIndicator } from "react-native";
import axios from "axios";
const ADAFRUIT_IO_KEY = "";
const ADAFRUIT_IO_USERNAME = "duongwt16";

export default function Light() {
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [lights, setLights] = useState([]);
  const [lux, setLux] = useState(null);

  const fetchAutoLightData = async () => {
    try {
      const response = await axios.get(
        `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/auto-light/data`,
        {
          headers: {
            "X-AIO-Key": ADAFRUIT_IO_KEY,
          },
        }
      );
      const data = response.data;
      if (data.length > 0) {
        setIsAutomatic(data[0].value === "1");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  useEffect(() => {
    fetchAutoLightData();
  }, []);

  const fetchLights = async () => {
    try {
      // replace the 192.168.206.123 with your IP address
      const response = await fetch(`http://192.168.206.123:3000/light/0112233445`);
      const data = await response.json();
      setLights(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLights();
  }, []);

  const addLight = async () => {
    try {
      // find max device_id, device_id is in the format of L1, L2, L3, ...
      const maxDeviceId = lights.reduce((acc, light) => {
        const deviceId = parseInt(light.device_id.slice(1));
        return deviceId > acc ? deviceId : acc;
      }, 0);
      const newDeviceId = `L${maxDeviceId + 1}`;
      // replace the 192.168.206.123 with your IP address
      const response = await fetch(`http://192.168.206.123:3000/light/0112233445`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: newDeviceId,
          device_type: "light",
          device_location: "BK",
        }),
      });
      if (response.status === 200) {
        setLights([...lights, { device_id: newDeviceId }]);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const removeLight = async (deviceId) => {
    if (deviceId === "L1") {
      alert("Cannot delete the first light device");
      return;
    } else {
      try {
        // replace the 192.168.206.123 with your IP address
        const response = await fetch(`http://192.168.206.123:3000/light/${deviceId}`, {
          method: "DELETE",
        });
        if (response.status === 200) {
          setLights(lights.filter((light) => light.device_id !== deviceId));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const CustomSwitch = ({ deviceId, isAutomatic }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOn, setIsOn] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const fetchLightStatus = async () => {
      try {
        const response = await fetch(`http://192.168.206.123:3000/activity/${deviceId}`);
        const data = await response.json();
        setIsOn(data.acttivity_description === "ON");
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchLightStatus();
      const intervalId = setInterval(fetchLightStatus, 1000); //fetch light status every seconds
      // clean up function
      return () => clearInterval(intervalId);
    }, []);
  
    if (isLoading) {
      return <ActivityIndicator />;
    }

    const handleSwitch = async () => {
      if (isUpdating) {
        return;
      }
      setIsUpdating(true);
      try {
        const response = await fetch(`http://192.168.206.123:3000/activity`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acttivity_description: isOn ? "OFF" : "ON",
            device_id: deviceId,
          }),
        });
        if (response.status === 200) {
          setIsOn(!isOn);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsUpdating(false);
      }
    }
    return (
      <TouchableOpacity 
        style={{ 
          width: 50, 
          height: 30,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Switch 
          value={isOn}
          onValueChange={handleSwitch}
          disabled={isUpdating || isAutomatic}
        />
      </TouchableOpacity>
    );
  };
  
  const fetchLux = async () => {
    try {
      const response = await fetch(`http://192.168.206.123:3000/lux`);
      const data = await response.json();
      setLux(data.lux);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLux();
    const intervalId = setInterval(fetchLux, 1000); //fetch lux data every second
    // clean up function
    return () => clearInterval(intervalId);
  }, []);
  
  const sendAutoLightData = async () => {
    try {
      await axios.post(
        `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/auto-light/data`,
        {
          value: isAutomatic ? 0 : 1,
        },
        {
          headers: {
            "X-AIO-Key": ADAFRUIT_IO_KEY,
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const LightControl = ({ label, deviceId }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
      <TouchableOpacity 
        style={{ 
          marginVertical: 10,
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 10,
          padding: 10,
          backgroundColor: 'white',
          width: Dimensions.get('window').width * 0.45,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text>{label}</Text>
        <CustomSwitch deviceId={deviceId} isAutomatic={isAutomatic} />
  
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderTopWidth: 3,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderTopColor: "#000",
                    borderRadius: 10,
                    width: "100%",
                    height: Dimensions.get("window").height / 1.5,
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      backgroundColor: "black",
                      height: 3,
                      width: 50,
                    }}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      marginBottom: 10,
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    Settings
                  </Text>
                  <ElementsButton
                    icon={<FontAwesome name="pencil" size={15} color="black" />}
                    title="Change device's name"
                    onPress={() => {
                      /* handle press */
                    }}
                    buttonStyle={{ backgroundColor: "white" }}
                    titleStyle={{ color: "black" }}
                  />
                  <ElementsButton
                    icon={
                      <FontAwesome name="trash-o" size={15} color="black" />
                    }
                    title="Remove device"
                    onPress={() => removeLight(deviceId)}
                    buttonStyle={{ backgroundColor: "white" }}
                    titleStyle={{ color: "black", alignSelf: "flex-start" }}
                  />
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "black",
                      marginVertical: 10,
                    }}
                  />
                  <ElementsButton
                    icon={<Feather name="info" size={15} color="black" />}
                    title="Device info"
                    onPress={() => {
                      /* handle press */
                    }}
                    buttonStyle={{ backgroundColor: "white" }}
                    titleStyle={{ color: "black", alignSelf: "flex-start" }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Light</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Text style={{ marginRight: 15 }}>
          {isAutomatic ? "Automatic" : "Manual"}
        </Text>
        <Switch
          onValueChange={(value) => {
            setIsAutomatic(value);
            sendAutoLightData();
          }}
          value={isAutomatic}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: Dimensions.get('window').width * 0.5 }}>
          {lights.sort((a, b) => a.device_id.localeCompare(b.device_id)).map((light) => (
            <LightControl key={light.device_id} label={`Light ${light.device_id}`} deviceId={light.device_id}  />
          ))}
        </View>

        <View 
          style={{ 
            width: Dimensions.get('window').width * 0.4, // adjust this as needed
            height: 200,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            padding: 15,
            backgroundColor: 'white',
          }}
        >
          <Text style={{ fontSize: 20 }}>{lux}</Text>
          <Text style={{ fontSize: 15 }}>LUX</Text> 
          <Entypo 
            name="light-up"
            size={50} 
            color="black"
            style={{ 
              position: 'absolute', 
              bottom: 15, 
              right: 15 
            }}
          />
        </View>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <ElementsButton
          icon={<AntDesign name="plus" size={15} color="black" />}
          title=""
          onPress={addLight} // Add this
          buttonStyle={{
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "black",
          }}
          titleStyle={{ color: "black" }}
        />
        <Text style={{ marginLeft: 5 }}>Add device</Text>
      </View>
    </View>
  );
}
