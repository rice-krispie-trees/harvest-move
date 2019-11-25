<<<<<<< HEAD
import React from "react"
import { View, Text } from "react-native"
import { Actions } from "react-native-router-flux"

import MapView, { Marker } from "react-native-maps"

export default function CropMap() {
	return (
		<View>
			<Text onPress={() => Actions.ar()}>Behold, our map page.</Text>
		</View>
	)
=======
import React, { Component } from 'react';
// import { ExpoConfigView } from '@expo/samples';
import { StyleSheet, View, Button } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
// import { createStackNavigator, createBottomTabNavigator, navigate } from 'react-navigation';

export default class CropMap extends Component {
	// return <ExpoConfigView />; // from default template

	constructor(props) {
		super(props);
		this.state = {
			latitude: 40.7050758,
			longitude: -74.0091604,
			error: 0
		}
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(position => {
			this.setState({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				error: null,
			});
		},
			error => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
		);
	}

	render() {
		return <MapView
			style={styles.map}
			region={{
				latitude: this.state.latitude,
				longitude: this.state.longitude,
				latitudeDelta: 0.017,
				longitudeDelta: 0.019,
			}}>
			<Marker coordinate={this.state} pinColor='blue' onPress={() => this.props.navigation.navigate('Home')} />
		</MapView>
	}
>>>>>>> e8476aa2de6c2f154d546b7dca3f35a19ea69550
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		...StyleSheet.absoluteFillObject,
		height: 400,
		width: 400,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
	}
});
