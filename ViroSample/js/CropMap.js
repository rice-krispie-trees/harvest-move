import React from "react"
import { View, Text } from "react-native"
import { Actions } from "react-native-router-flux"

import MapView, { Marker } from "react-native-maps"

export default function CropMap() {
	return (
		<View>
			<Text onPress={this.props.goToAR}>Behold, our map page.</Text>
		</View>
	)
}
