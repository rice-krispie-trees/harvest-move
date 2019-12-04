import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, } from "react-native"
import { Actions } from "react-native-router-flux"
import { Card } from "react-native-elements"
import { connect } from "react-redux"
import { getUserCoords } from "../store/redux/coords"

export default connect(
	state => ({ coords: state.coords }),
	dispatch => ({ getUserCoords: () => dispatch(getUserCoords()) })
)(
	class extends React.Component {
		async componentDidMount() {
			await this.props.getUserCoords()
			console.log({ ...this.props.coordinates })
		}
		render() {
		return (
				<View style={styles.container}>
					<ScrollView>
					<TouchableOpacity
						onPress={()=> Actions.ar()}
						style={styles.button}>
						<Card
						image={require('./res/wheat.jpg')}
						containerStyle={styles.card}
						imageStyle={styles.img}>
						<Text style={styles.text}>START FARMING!</Text>
						</Card>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={()=> Actions.map()}
						style={styles.button}>
						<Card
						image={require('./res/map.jpg')}
						containerStyle={styles.card}
						imageStyle={styles.img}>
						<Text style={styles.text}>CROP MAP</Text>
					</Card>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}>
						<Card
						image={require('./res/basket.png')}
						containerStyle={styles.card}
						imageStyle={styles.img}>
						<Text style={styles.text}>BASKET</Text>
					</Card>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}>
						<Card
						onPress={()=> Actions.market()}
						image={require('./res/market.png')}
						containerStyle={styles.card}
						imageStyle={styles.img}>
						<Text style={styles.text}>HARVEST MARKET</Text>
					</Card>
					</TouchableOpacity>
					</ScrollView>
				</View>
			)
		}
	}
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 5,
		backgroundColor: "rgba(255,255,255,1)"
	},
	button: {
		shadowColor: "grey",
		shadowOffset: { height: 1, width: 1 },
		shadowOpacity: 0.14,
		shadowRadius: 1,
	},
	card: {
    width: 299,
		height: 150,
    backgroundColor: "rgba(255,255,255,1)",
    borderColor: "grey",
    borderWidth: 0.1,
    overflow: "hidden",
		marginTop: 15,
		borderRadius: 3
	},
	img: {
    width: 299,
    height: 112,
		marginTop: 3,
		borderRadius: 3
	},
	text: {
		alignSelf: "center"
	}
})
