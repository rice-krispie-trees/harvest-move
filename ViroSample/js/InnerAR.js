import React, { Component } from "react"
import { ViroARSceneNavigator } from "react-viro"

const InitialARScene = require("./ARMode")

module.exports = props => (
	<ViroARSceneNavigator
		{...this.props}
		worldAlignment="GravityAndHeading"
		initialScene={{ scene: InitialARScene }}
	/>
)
