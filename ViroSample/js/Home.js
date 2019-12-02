import React from "react"
import { connect } from "react-redux"
import { View, Text } from "react-native"
import { Actions } from "react-native-router-flux"
import { getUserCoords } from "../store/redux/coords"

export default connect(
	state => ({ coords: state.coords }),
	dispatch => ({ getUserCoords: () => dispatch(getUserCoords()) })
)(
	class extends React.Component {
		componentDidMount() {
			this.props.getUserCoords()
		}
		render() {
			return (
				<View>
					<Text onPress={() => Actions.map()}>Behold, our home page.</Text>
					<View>
						<Text onPress={() => Actions.ar()}>
							Click here to go to AR mode. (UPDATED)
						</Text>
					</View>
				</View>
			)
		}
	}
)
