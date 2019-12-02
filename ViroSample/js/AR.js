import React, { Component } from "react"
import { View, SegmentedControlIOS, StyleSheet, Button } from "react-native"
import { ViroARSceneNavigator } from "react-viro"
import { connect } from "react-redux"
import crops from "./logic/crops"
import InnerAR from "./InnerAR"
import { seedTypePicked } from "../store/redux/seed"

module.exports = connect(null, dispatch => ({
	seedTypePicked: seed => dispatch(seedTypePicked(seed))
}))(
	class extends React.Component {
		constructor(props) {
			super(props)
			this.state = {
				selectedIndex: "corn"
			}
		}

		render() {
			return (
				<View style={styles.ARContainer}>
					<InnerAR />
					<View style={styles.buttonContainer}>
						{/* <Button title="button" /> */}
						<SegmentedControlIOS
							style={styles.buttonBar}
							values={Object.keys(crops)}
							selectedIndex={this.props.seed}
							onChange={event => {
								this.props.seedTypePicked(
									Object.keys(crops)[event.nativeEvent.selectedSegmentIndex]
								)
							}}
						/>
					</View>
				</View>
			)
		}
	}
)

var styles = StyleSheet.create({
	ARContainer: {
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		alignItems: "center",
		backgroundColor: "black"
	},
	buttonContainer: {
		backgroundColor: "white",
		position: "absolute",
		top: 0
	},
	buttonBar: {
		width: 320
	}
})
