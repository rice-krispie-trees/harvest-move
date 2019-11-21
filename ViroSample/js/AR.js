import React, { Component } from "react"
import { ARMode } from "./ARMode"
import { ViroARSceneNavigator } from "react-viro"

export default class AR extends Component {
	render() {
		return (
			<ViroARSceneNavigator {...this.props} initialScene={{ scene: ARMode }} />
		)
	}
}
