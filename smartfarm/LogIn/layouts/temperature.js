import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Button as ElementsButton } from "react-native-elements";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

export default function Temperature() {
  const [baseLimit, setBaseLimit] = useState(15.0);
  const [upperLimit, setUpperLimit] = useState(15.0);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempBaseLimit, setTempBaseLimit] = useState("");
  const [tempUpperLimit, setTempUpperLimit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchLimits();
  }, []);

  const fetchLimits = async () => {
    try {
      const [baseLimitResponse, upperLimitResponse] = await Promise.all([
        axios.get("http://10.229.71.101:3000/base-limit"),
        axios.get("http://10.229.71.101:3000/upper-limit"),
      ]);

      const { base_limit } = baseLimitResponse.data;
      const { upper_limit } = upperLimitResponse.data;

      setBaseLimit(base_limit);
      setUpperLimit(upper_limit);
    } catch (error) {
      console.error("Error fetching limits:", error);
    }
  };

  // const TemperatureControl = ({ label, value, onChange }) => {
  //   return (
  //     <View style={{ marginVertical: 10 }}>
  //       <Text style={{ fontSize: 18, marginBottom: 5 }}>{label}</Text>
  //       <View style={{ flexDirection: "row", alignItems: "center" }}>
  //         <Slider
  //           style={{ flex: 1, marginHorizontal: 10 }}
  //           value={parseFloat(value.toFixed(1))}
  //           onValueChange={onChange}
  //           minimumValue={15}
  //           maximumValue={40}
  //           step={0.1}
  //         />
  //         <Text>{value.toFixed(1)}</Text>
  //       </View>
  //     </View>
  //   );
  // };

  const saveLimits = async () => {
    if (baseLimit < upperLimit) {
      if (
        baseLimit >= 15 &&
        baseLimit <= 40 &&
        upperLimit >= 15 &&
        upperLimit <= 40
      ) {
        try {
          await axios.put("http://10.229.71.101:3000/put-upper-limit", {
            upperLimit,
          });

          await axios.put("http://10.229.71.101:3000/put-base-limit", {
            baseLimit,
          });

          console.log("Limits updated successfully");
          setModalVisible(false);
        } catch (error) {
          console.error("Error updating limits:", error);
        }
      } else {
        setErrorMessage("Values must be between 15 and 40");
      }
    } else {
      setErrorMessage("Base Limit must be less than Upper Limit");
    }
  };

  const openFormModal = () => {
    setTempBaseLimit(baseLimit.toFixed(1).toString());
    setTempUpperLimit(upperLimit.toFixed(1).toString());
    setErrorMessage("");
    setModalVisible(true);
  };

  const saveFormLimits = async () => {
    const tempBase = parseFloat(tempBaseLimit);
    const tempUpper = parseFloat(tempUpperLimit);
    console.log("Parsed values:", tempBase, tempUpper);

    if (!isNaN(tempBase) && !isNaN(tempUpper)) {
      if (tempBase < tempUpper) {
        if (
          tempBase >= 15 &&
          tempBase <= 40 &&
          tempUpper >= 15 &&
          tempUpper <= 40
        ) {
          try {
            await axios.put("http://10.229.71.101:3000/put-form-limits", {
              tempBase,
              tempUpper,
            });

            console.log("Form limits updated successfully");
            setModalVisible(false);
          } catch (error) {
            console.error("Error updating form limits:", error);
            setErrorMessage("An error occurred while updating form limits");
          }
        } else {
          setErrorMessage("Values must be between 15 and 40");
        }
      } else {
        setErrorMessage("Base Limit must be less than Upper Limit");
      }
    } else {
      setErrorMessage(
        "Please enter valid numeric values for Base Limit and Upper Limit"
      );
    }
  };
  const styles = StyleSheet.create({
    sliderContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 17,
      marginBottom: 20,
      fontWeight: "bold",
    },
  });

  return (
    // <View style={{ padding: 20 }}>
    //   <Text style={{ fontSize: 24, marginBottom: 20 }}>Temperature</Text>

    //   <TemperatureControl
    //     label="Base Limit"
    //     value={baseLimit}
    //     onChange={(value) => setBaseLimit(value)}
    //   />
    //   <TemperatureControl
    //     label="Upper Limit"
    //     value={upperLimit}
    //     onChange={(value) => setUpperLimit(value)}
    //   />

    //   <ElementsButton
    //     title="Save"
    //     onPress={saveLimits}
    //     buttonStyle={{
    //       backgroundColor: "black",
    //       marginTop: 20,
    //       marginBottom: 10,
    //       width: "100%",
    //     }}
    //     ViewComponent={LinearGradient}
    //     linearGradientProps={{
    //       colors: ["#1d976c", "#93f9b9"],
    //       start: { x: 0, y: 0 },
    //       end: { x: 1, y: 0 },
    //       style: {
    //         borderRadius: 10,
    //       },
    //     }}
    //     titleStyle={{ color: "white" }}
    //   />
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Temperature</Text>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Base Limit: {baseLimit.toFixed(1)}</Text>
        <Slider
          style={{ width: "100%" }}
          minimumValue={15}
          maximumValue={40}
          step={0.1}
          value={baseLimit}
          onValueChange={(value) => setBaseLimit(value)}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Upper Limit: {upperLimit.toFixed(1)}</Text>
        <Slider
          style={{ width: "100%" }}
          minimumValue={15}
          maximumValue={40}
          step={0.1}
          value={upperLimit}
          onValueChange={(value) => setUpperLimit(value)}
        />
      </View>

      <ElementsButton
        title="Save"
        onPress={saveLimits}
        buttonStyle={{
          backgroundColor: "black",
          marginTop: 20,
          marginBottom: 10,
          width: "100%",
        }}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ["#1d976c", "#93f9b9"],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
          style: {
            borderRadius: 10,
          },
        }}
        titleStyle={{ color: "white" }}
      />
      {errorMessage ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <ElementsButton
        title="Set Limits"
        onPress={openFormModal}
        buttonStyle={{
          width: "100%",
        }}
        ViewComponent={LinearGradient} // Use LinearGradient as the view component
        linearGradientProps={{
          colors: ["black", "#1d976c"],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
          style: {
            borderRadius: 10,
          },
        }}
        titleStyle={{ color: "white" }}
      />

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
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: "80%",
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                Enter Limits
              </Text>
              {errorMessage ? (
                <Text style={{ color: "red", marginBottom: 10 }}>
                  {errorMessage}
                </Text>
              ) : null}
              <TextInput
                style={{
                  marginBottom: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 6,
                }}
                placeholder="Base Limit"
                keyboardType="numeric"
                value={tempBaseLimit}
                onChangeText={(text) => setTempBaseLimit(text)}
              />
              <TextInput
                style={{
                  marginBottom: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 6,
                }}
                placeholder="Upper Limit"
                keyboardType="numeric"
                value={tempUpperLimit}
                onChangeText={(text) => setTempUpperLimit(text)}
              />
              <ElementsButton
                title="Save"
                onPress={saveFormLimits}
                buttonStyle={{ backgroundColor: "black", width: "100%" }}
                titleStyle={{ color: "white" }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
