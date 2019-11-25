import React from "react"
import { View, Text } from "react-native"
import { Actions } from "react-native-router-flux"

export default function Home() {
	return (
		<View>
			<Text onPress={() => Actions.map()}>Behold, our home page.</Text>
			<Text onPress={() => Actions.ar()}>Behold, our map page.</Text>
		</View>
	)
}
