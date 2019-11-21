/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from "react"
import {
	AppRegistry,
	Text,
	View,
	StyleSheet,
	PixelRatio,
	TouchableHighlight
} from "react-native"
import { Router, Scene, Stack } from "react-native-router-flux"
import { Login, Home, CropMap, ARMode, AR } from "./js"

import { ViroVRSceneNavigator, ViroARSceneNavigator } from "react-viro"

import { firebaseConfig } from "./firebase/config"
import { FirebaseWrapper } from "./firebase/firebase"

/*
 TODO: Insert your API key below
 */
var sharedProps = {
	apiKey: "API_KEY_HERE"
}

// Sets the default scene you want for AR and VR
var InitialARScene = require("./js/ARMode")
// var InitialVRScene = require("./js/HelloWorldScene")

var UNSET = "UNSET"
var VR_NAVIGATOR_TYPE = "VR"
var AR_NAVIGATOR_TYPE = "AR"

// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
var defaultNavigatorType = UNSET

export default class ViroSample extends Component {
	constructor() {
		super()

		this.state = {
			navigatorType: defaultNavigatorType,
			sharedProps: sharedProps
		}
		this._NonARRoot = this._NonARRoot.bind(this)
		this._getARNavigator = this._getARNavigator.bind(this)
		this._goToAR = this._goToAR.bind(this)
		this._exitViro = this._exitViro.bind(this)
	}

	// Replace this function with the contents of _getVRNavigator() or _getARNavigator()
	// if you are building a specific type of experience.
	render() {
		FirebaseWrapper.GetInstance().Initialize(firebaseConfig)
		if (this.state.navigatorType == UNSET) {
			return this._NonARRoot()
		} else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
			return this._getARNavigator()
		}
	}

	// Presents the user with a choice of an AR or VR experience
	_NonARRoot() {
		return (
			<Router>
				<Stack key="root">
					{/* <Scene key="login" component={Login} title="Login" /> */}
					<Scene key="home" component={Home} title="Home" />
					<Scene
						key="map"
						render={props => <CropMap {...props} goToAR={this.goToAR} />}
						title="My Map"
					/>
					<Scene
						key="ar"
						component={AR}
						props={this.state.sharedProps}
						title="Farmin'!"
					/>
				</Stack>
			</Router>

			// <View style={localStyles.outer}>
			// 	<View style={localStyles.inner}>
			// 		<Text style={localStyles.titleText}>
			// 			Choose your desired experience:
			// 		</Text>

			// 		<TouchableHighlight
			// 			style={localStyles.buttons}
			// 			onPress={this._getExperienceButtonOnPress(AR_NAVIGATOR_TYPE)}
			// 			underlayColor={"#68a0ff"}
			// 		>
			// 			<Text style={localStyles.buttonText}>AR</Text>
			// 		</TouchableHighlight>

			// 		<TouchableHighlight
			// 			style={localStyles.buttons}
			// 			onPress={this._getExperienceButtonOnPress(VR_NAVIGATOR_TYPE)}
			// 			underlayColor={"#68a0ff"}
			// 		>
			// 			<Text style={localStyles.buttonText}>VR</Text>
			// 		</TouchableHighlight>
			// 	</View>
			// </View>
		)
	}

	// Returns the ViroARSceneNavigator which will start the AR experience
	_getARNavigator() {
		return (
			<ViroARSceneNavigator
				{...this.state.sharedProps}
				initialScene={{ scene: InitialARScene }}
			/>
		)
	}

	// Returns the ViroSceneNavigator which will start the VR experience
	_getVRNavigator() {
		return (
			<ViroVRSceneNavigator
				{...this.state.sharedProps}
				initialScene={{ scene: InitialVRScene }}
				onExitViro={this._exitViro}
			/>
		)
	}

	// This function returns an anonymous/lambda function to be used
	// by the experience selector buttons
	_goToAR(navigatorType) {
		return () => {
			this.setState({
				navigatorType: AR_NAVIGATOR_TYPE
			})
		}
	}

	// This function "exits" Viro by setting the navigatorType to UNSET.
	_exitViro() {
		this.setState({
			navigatorType: UNSET
		})
	}
}

var localStyles = StyleSheet.create({
	viroContainer: {
		flex: 1,
		backgroundColor: "black"
	},
	outer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "black"
	},
	inner: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "black"
	},
	titleText: {
		paddingTop: 30,
		paddingBottom: 20,
		color: "#fff",
		textAlign: "center",
		fontSize: 25
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontSize: 20
	},
	buttons: {
		height: 80,
		width: 150,
		paddingTop: 20,
		paddingBottom: 20,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: "#68a0cf",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#fff"
	},
	exitButton: {
		height: 50,
		width: 100,
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: "#68a0cf",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#fff"
	}
})

module.exports = ViroSample
