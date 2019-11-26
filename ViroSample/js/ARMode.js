"use strict"

import React, { Component } from "react"
import { StyleSheet } from "react-native"

import {
	ViroARScene,
	ViroText,
	ViroConstants,
	ViroMaterials,
	ViroARSceneNavigator,
	ViroARPlane,
	ViroARPlaneSelector,
	ViroAmbientLight,
	ViroBox
} from "react-viro"

import { PLOT_WIDTH, PLOT_LENGTH, PLOT_HEIGHT } from "./constants"

//const InitialARScene = require("./ARStart")
//const defaultSceneType = 'AR_START'
import { firebaseConfig } from "../firebase/config"
import { FirebaseWrapper } from "../firebase/firebase"

const peetsLat = 40.704757
const peetsLong = -73.009288

class Plot {
	constructor(lat, lng) {
		this.lat = lat
		this.long = lng
		this.visible = false
	}
}
const plots = []
for (let i = 40.704546; i < 40.705547; i += 0.00005) {
	for (let j = -74.009598; j < -74.008598; j += 0.00005) {
		plots.push(new Plot(i, j))
	}
}

const samplePlot = {
	crop: "corn",
	date: new Date(),
	ripe: false,
	sprouted: false,
	lat: 40.704787,
	long: -73.009143,
	waterC: 0,
	watered: null,
	alive: true,
	visible: false
}

const samplePlot2 = {
	crop: "cabbage",
	date: new Date(),
	ripe: false,
	sprouted: false,
	lat: 40.704797,
	long: -73.009143,
	waterC: 0,
	watered: null,
	alive: true,
	visible: false
}

const samplePlot3 = {
	crop: "potato",
	date: new Date(),
	ripe: false,
	sprouted: false,
	lat: 40.704807,
	long: -73.009163,
	waterC: 0,
	watered: null,
	alive: true,
	visible: false
}

class ARMode extends Component {
	constructor() {
		super()

		// Set initial state here
		this.state = {
			text: "Initializing AR...",
			selfLat: 0,
			selfLong: 0,
			loaded: false,
			error: null,
			plots: plots,
			anchorsFound: []
		}
		// bind 'this' to functions
		this._onInitialized = this._onInitialized.bind(this)
		this._getARCoords = this._getARCoords.bind(this)
		this._onSelected = this._onSelected.bind(this)
		this._onAnchorFound = this._onAnchorFound.bind(this)
	}

	async componentDidMount() {
		await navigator.geolocation.getCurrentPosition(
			position => {
				this.setState({
					selfLat: position.coords.latitude,
					selfLong: position.coords.longitude
				})
			},
			error => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		)
		this.setState({ loaded: true })
	}

	_latLongToMerc(lat_deg, lon_deg) {
		//got this code from https://github.com/explorAR-group/ExplorAR/blob/master/js/components/PointOfInterest.js
		var lon_rad = (lon_deg / 180.0) * Math.PI
		var lat_rad = (lat_deg / 180.0) * Math.PI
		var sm_a = 6378137.0
		var xmeters = sm_a * lon_rad
		var ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
		// 10 ** (y_meters / sm_a) * Math.cos(lat_rad) = (Math.sin(lat_rad) + 1)
		return { x: xmeters, y: ymeters }
	}

	_mercToLatLong(relative_x, relative_z) {
		const lat = relative_z / 111111.1 + this.state.selfLat
		const lng =
			relative_x / (111111.1 * Math.cos(this.state.selfLat)) +
			this.state.selfLong
		return { lat, lng }
	}

	_getARCoords(plot, y) {
		const plotMerc = this._latLongToMerc(plot.lat, plot.long)
		const selfMerc = this._latLongToMerc(
			this.state.selfLat,
			this.state.selfLong
		)
		const plotARZ = plotMerc.y - selfMerc.y
		const plotARX = plotMerc.x - selfMerc.x
		return [plotARX, y, -plotARZ]
	}

	_onSelected(anchor) {
		const { lat, lng } = this._mercToLatLong(anchor.center[2], anchor.center[0])
		console.log(lat, lng)
		const plot = new Plot(lat, lng)
		const newPlots = [...this.state.plots]
		newPlots.push(plot)
		console.log(this)
		this.setState({ plots: newPlots })
		// FirebaseWrapper.GetInstance().Initialize(firebaseConfig)
		// FirebaseWrapper.GetInstance().createPlot("Plots", "a name", lat, long)
	}

	_plotHere(anchor) {
		const { plots } = this.state
		for (let i = 0; i < plots.length; i++) {
			const [x, y, z] = this._getARCoords(plots[i])
			if (
				Math.abs(x - anchor.position[0]) < PLOT_WIDTH &&
				Math.abs(z - anchor.position[2]) < PLOT_LENGTH
			) {
				return plots[i]
			}
		}
	}

	_onAnchorFound(anchor) {
		if (this._plotHere(anchor)) {
			console.log("ANCHOR WITH PLOT FOUND!")
			const newAnchors = [...this.state.anchorsFound]
			newAnchors.push(anchor)
			this.setState({ anchorsFound: newAnchors })
		} else console.log("plotless anchor.")
	}

	render() {
		let hoeSelected = true
		return (
			<ViroARScene
				onTrackingUpdated={this._onInitialized}
				anchorDetectionTypes="PlanesHorizontal"
				onAnchorFound={this._onAnchorFound}
			>
				{this.state.plots.map(plot => (
					<ViroBox
						height={0.05}
						width={0.05}
						length={0.05}
						position={this._getARCoords(plot, 0)}
					/>
				))}
				{this.state.anchorsFound.map(anchor => (
					<ViroBox
						height={PLOT_HEIGHT}
						width={PLOT_WIDTH}
						length={PLOT_LENGTH}
						materials={["dirt"]}
						position={this._getARCoords(
							this._plotHere(anchor),
							anchor.position[1]
						)}
					/>
				))}
				<ViroAmbientLight color="#FFFFFF" />
				{hoeSelected ? (
					<ViroARPlaneSelector
						alignment="Horizontal"
						onPlaneSelected={this._onSelected}
					>
						<ViroBox
							height={0.0001}
							width={0.8}
							length={0.8}
							materials={["dirt"]}
							position={[0, 0, 0]}
						/>
					</ViroARPlaneSelector>
				) : (
					""
				)}
			</ViroARScene>
		)
	}

	_onInitialized(state, reason) {
		if (state == ViroConstants.TRACKING_NORMAL) {
			if (this.state.loaded) this.setState({ text: "Done" })
			else this.setState({ text: "Not Done" })
		} else if (state == ViroConstants.TRACKING_NONE) {
			// Handle loss of tracking
			console.error(reason)
		}
	}

	_switchARScene(newScene) {
		return <ViroARSceneNavigator initialScene={{ scene: newScene }} />
	}

	_onClick(sceneType, position, source) {
		this.setState({ sceneType: sceneType })
	}
}

var styles = StyleSheet.create({
	helloWorldTextStyle: {
		fontFamily: "Arial",
		fontSize: 15,
		color: "#ffffff",
		textAlignVertical: "center",
		textAlign: "center"
	}
})

ViroMaterials.createMaterials({
	dirt: {
		diffuseTexture: require("./res/plot_base.png")
	},
	frontMaterial: {
		diffuseColor: "#FFFFFF"
	},
	backMaterial: {
		diffuseColor: "#FFFFFF"
	},
	sideMaterial: {
		diffuseColor: "#FFFFFF"
	}
})

module.exports = ARMode
