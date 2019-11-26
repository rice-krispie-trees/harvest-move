import React, { Component } from "react"
import { StyleSheet } from "react-native"
import {
	ViroMaterials,
	ViroARScene,
	ViroText,
	ViroConstants,
	ViroButton,
	ViroImage,
	ViroNode
} from "react-viro"

class ARStart extends Component {
	constructor() {
		super()
		this.state = {
			text: "Let's Farm!",
			viewPlotBase: false
		}
		this._onInitialized = this._onInitialized.bind(this)
		this._viewPlotBase = this._viewPlotBase.bind(this)
	}

	render() {
		//return (
			// <ViroARScene onTrackingUpdated={this._onInitialized}>
			// 	<ViroText
			// 		//scale={[0.5, 0.5, 0.5]}
			// 		position={[0, 0, -1]}
			// 		width={10} height={2}
			// 		extrusionDepth={4}
			// 		style={styles.helloWorldTextStyle}
			// 		materials={["frontMaterial", "backMaterial", "sideMaterial"]}
			// 		outerStroke={{type:"DropShadow", width:2, color:'#444444'}}
			// 		text={this.state.text}
			// 		onClick={this._viewPlotBase}
			// 	/>
			// 	<ViroNode position={[0,-1,0]} dragType="FixedToWorld" onDrag={()=>{}}>
			// 		<ViroImage
			// 				height={2}
			// 				width={2}
			// 				position={[0, 0, -1]}
			// 				source={require("./res/plot_base.png")}
			// 		/>
			// 	</ViroNode>
				/* {
				this.state.viewPlotBase ?
					<ViroImage
						source={require("./res/Dirt and Leaf Background.G03.watermarked.2k.png")}
					/> : null
				} */
			/* <ViroButton
				source={require("./res/icon_home.png")}
				position={[0.0, 0.0, -2]}
        height={0.25}
				width={0.25}

			/>
			<ViroButton
				source={require("./res/icon_home.png")}
				position={[0, -0.25, -2]}
        height={0.25}
    		width={0.25}
			/>
			<ViroButton
				source={require("./res/icon_home.png")}
				position={[0, -0.5, -2]}
        height={0.25}
    		width={0.25}
			/> */
			//</ViroARScene>
	//	)
	}

	_onInitialized(state, reason) {
		if (state == ViroConstants.TRACKING_NORMAL) {
			this.setState({text: ""})
		} else if (state == ViroConstants.TRACKING_NONE) {
			// Handle loss of tracking
			console.error(reason)
		}
	}

	_viewPlotBase(source) {
		this.setState({viewPlotBase: !this.state.viewPlotBase})
		console.log(this.state.viewPlotBase)
	}
}

var styles = StyleSheet.create({
	helloWorldTextStyle: {
		fontFamily: "Arial",
		fontSize: 15,
		color: "#ffffff",
		textAlignVertical: "center",
		textAlign: "center",
	}
})

ViroMaterials.createMaterials({
	frontMaterial: {
		diffuseColor: '#FFFFFF',
	},
	backMaterial: {
		diffuseColor: '#FFFFFF',
	},
	sideMaterial: {
		diffuseColor: '#FFFFFF',
	},
});

module.exports = ARStart
