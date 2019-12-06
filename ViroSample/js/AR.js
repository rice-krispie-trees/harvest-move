import React from "react"
import { View, SegmentedControlIOS, StyleSheet, Dimensions } from "react-native"
import { connect } from "react-redux"
import crops from "./logic/crops"
import InnerAR from "./InnerAR"
import { seedTypePicked } from "../store/redux/seed"
import { selectedTool } from "../store/redux/tool"
import { TOOLS, SEEDS } from "./constants"

module.exports = connect(
	state => ({
		seed: state.seed,
		tool: state.tool
	}),
	dispatch => ({
		seedTypePicked: seed => dispatch(seedTypePicked(seed)),
		selectedTool: tool => dispatch(selectedTool(tool))
	})
)(
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
						<SegmentedControlIOS
							style={styles.buttonBar}
							values={TOOLS}
							selectedIndex={TOOLS.indexOf(this.props.tool)}
							onChange={event =>
								this.props.selectedTool(
									TOOLS[event.nativeEvent.selectedSegmentIndex]
								)
							}
						/>
						{this.props.tool === SEEDS && (
							<SegmentedControlIOS
								style={styles.buttonBar}
								values={Object.keys(crops)}
								selectedIndex={Object.keys(crops).indexOf(this.props.seed)}
								onChange={event => {
									this.props.seedTypePicked(
										Object.keys(crops)[event.nativeEvent.selectedSegmentIndex]
									)
								}}
							/>
						)}
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
		width: Dimensions.get("window").width
	}
})
