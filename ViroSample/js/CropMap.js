import React, { Component } from "react";
// import { ExpoConfigView } from '@expo/samples';
import { StyleSheet, View, Button } from "react-native";
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
      plots: []
    };
    // this.renderPlots = this.renderPlots.bind(this)
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
    await FirebaseWrapper.GetInstance().getNearbyPlots(
      "Plots",
      this.state.location.latitude,
      this.state.location.longitude,
      plots => this.setState({ plots })
    );
  }

  //   async renderPlots() {
  //     await FirebaseWrapper.GetInstance().getNearbyPlots(
  //       "Plots",
  //       this.state.location.latitude,
  //       this.state.location.longitude,
  //       plots => this.setState({ plots })
  //     );
  //   }

  render() {
    return (
		<View>
			{this.state.plots && this.state.plots.map(plot => {
				return(
					<Text>{plot.location}</Text>
				)
			})}
		</View>
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
          pinColor="blue"
          onPress={() => this.props.navigation.navigate("Home")}
        />
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
