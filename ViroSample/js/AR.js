import React, { Component } from "react"
import { ViroARSceneNavigator } from "react-viro"

const InitialARScene = require("./ARMode")

const AR = props => {
	return (
		<ViroARSceneNavigator
			{...props}
			worldAlignment="GravityAndHeading"
			initialScene={{ scene: InitialARScene }}
		/>
	)
}

export default AR
