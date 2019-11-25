"use strict"

import React, { Component } from "react"
import { StyleSheet } from "react-native"

import {
	ViroARScene,
	ViroText,
	ViroConstants,
	ViroMaterials,
	ViroARSceneNavigator
} from "react-viro"

const InitialARScene = require("./ARStart")
//const defaultSceneType = 'AR_START'

class ARMode extends Component {
	constructor() {
		super()

		// Set initial state here
		this.state = {
			text: "Let's Farm!",
			//ARScene: defaultSceneType
		}
		// bind 'this' to functions
		//this._onInitialized = this._onInitialized.bind(this)
		//this._switchARScene = this._switchARScene.bind(this)
		//this._onClick = this._onClick.bind(this)
	}

	render() {
		// if (this.state.ARScene === defaultSceneType) {
		// 	return this._switchARScene(InitialARScene)
		// }
		return (
			<ViroARSceneNavigator initialScene={{ scene: InitialARScene }} />
		)
	}

	_onInitialized(state, reason) {
		//onTrackingUpdated={this._onInitialized}
		if (state == ViroConstants.TRACKING_NORMAL) {
			this.setState({text: "Let's Farm!"})
		} else if (state == ViroConstants.TRACKING_NONE) {
			// Handle loss of tracking
			console.error(reason)
		}
	}

	_switchARScene(newScene) {
		return (
			<ViroARSceneNavigator
			initialScene={{ scene: newScene }} />
		)
	}

	_onClick(sceneType, position, source) {
		this.setState({sceneType: sceneType})
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


module.exports = ARMode
