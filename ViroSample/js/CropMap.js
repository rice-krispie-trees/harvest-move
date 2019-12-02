import React, { Component } from "react";
// import { ExpoConfigView } from '@expo/samples';
import { StyleSheet, View, Button, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FirebaseWrapper } from "../firebase/firebase";
// import { createStackNavigator, createBottomTabNavigator, navigate } from 'react-navigation';

export default class CropMap extends Component {
  // return <ExpoConfigView />; // from default template

  constructor(props) {
    super(props);
    this.state = {
      location: {
        latitude: 40.7050758,
        longitude: -74.0091604,
        error: 0
      },
      hardcoded: [
        { name: "Union Sq", lat: 40.735075, long: -73.990848 },
        { name: "Charging Bull", lat: 40.705639, long: -74.013417 },
        { name: "NYSE", lat: 40.706975, long: -74.011083 },
        { name: "Pier 17", lat: 40.70604, long: -74.002623 }
      ],
      plots: []
    };
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          }
        });
      },
      error => this.setState({ location: { error: error.message } }),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
    );
    // this.state.hardcoded.forEach(async loc => {
    //   await FirebaseWrapper.GetInstance().createPlot(
    //     "Plots",
    //     loc.name,
    //     loc.lat,
    //     loc.long
    //   );
    // });

    // await FirebaseWrapper.GetInstance().getNearbyPlots(
    // 	"Plots",
    // 	this.state.location.latitude,
    // 	this.state.location.longitude,
    // 	plots => this.setState({ plots })
    // );

    await FirebaseWrapper.GetInstance().SetupCollectionListener(
      "Plots",
      plots => this.setState({ plots })
    );
  }

  render() {
    return (
      <MapView
        style={styles.map}
        region={{
          latitude: this.state.location.latitude,
          longitude: this.state.location.longitude,
          latitudeDelta: 0.017,
          longitudeDelta: 0.019
        }}
      >
        <Marker
          coordinate={this.state.location}
          pinColor="#4CB8EF"
          onPress={() => this.props.navigation.navigate("Home")}
        />
        {this.state.plots.map(plot => {
          return (
            <Marker
              key={plot.d.name}
              coordinate={{
                latitude: plot.d.coordinates.latitude,
                longitude: plot.d.coordinates.longitude
              }}
            />
          );
        })}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
