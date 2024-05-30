import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const Chart = () => {
  const [temperatureData, setTemperatureData] = useState(null);
  const [lightData, setLightData] = useState(null);
  const [moistureData, setMoistureData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataForCurrentMonth = async () => {
    const temperature = await fetchData(
      "http://10.229.71.101:3000/temperature/current-month"
    );
    const light = await fetchData(
      "http://10.229.71.101:3000/lights/current-month"
    );
    const moisture = await fetchData(
      "http://10.229.71.101:3000/moisture/current-month"
    );

    setTemperatureData(temperature);
    setLightData(light);
    setMoistureData(moisture);
  };

  const fetchDataForCurrentYear = async () => {
    const temperature = await fetchData(
      "http://10.229.71.101:3000/temperature/current-year"
    );
    const light = await fetchData(
      "http://10.229.71.101:3000/lights/current-year"
    );
    const moisture = await fetchData(
      "http://10.229.71.101:3000/moisture/current-year"
    );

    // Format temperature data for current year
    const formattedTemperatureData = temperature.map((item) => ({
      day: item.month,
      temperature: item.average_temperature,
    }));

    setTemperatureData(formattedTemperatureData);

    // Format light data for current year
    const formattedLightData = light.map((item) => ({
      day: item.month,
      lux: item.average_light,
    }));

    setLightData(formattedLightData);

    // Format moisture data for current year
    const formattedMoistureData = moisture.map((item) => ({
      day: item.month,
      moisture: item.average_moisture,
    }));

    setMoistureData(formattedMoistureData);
  };

  useEffect(() => {
    fetchDataForCurrentMonth();
    fetchDataForCurrentYear();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={{ marginBottom: 20 }}>
            <LinearGradient
              colors={["#1d976c", "#93f9b9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={fetchDataForCurrentMonth}>
                <Text style={styles.buttonText}>
                  Load Data for Current Month
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View style={{ marginBottom: 20 }}>
            <LinearGradient
              colors={["#1d976c", "#93f9b9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <TouchableOpacity onPress={fetchDataForCurrentYear}>
                <Text style={styles.buttonText}>
                  Load Data for Current Year
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {temperatureData && (
            <LineChart
              data={{
                labels: temperatureData.map((item) => item.day),
                datasets: [
                  {
                    data: temperatureData.map((item) => item.temperature),
                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={400}
              height={200}
              yAxisSuffix="°C"
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ff0000",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
          {lightData && (
            <LineChart
              data={{
                labels: lightData.map((item) => item.day),
                datasets: [
                  {
                    data: lightData.map((item) => item.lux),
                    color: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={400}
              height={200}
              yAxisSuffix="lux"
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffff00",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
          {moistureData && (
            <LineChart
              data={{
                labels: moistureData.map((item) => item.day),
                datasets: [
                  {
                    data: moistureData.map((item) => item.moisture),
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={400}
              height={200}
              yAxisSuffix="%"
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#00ff00",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Chart;

const styles = {
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
};
