"use strict"

import React, { Component } from "react"
import { StyleSheet } from "react-native"
import { ViroARScene, ViroText, ViroConstants } from "react-viro"
// import { firebaseConfig } from "./firebase/config"
// import { FirebaseWrapper } from "./firebase/firebase"

const merc = require("mercator-projection")

const peetsLat = 40.704757
const peetsLong = -73.009288

const samplePlot = {
	crop: "corn",
	date: new Date(),
	ripe: false,
	sprouted: false,
	lat: 40.704787,
	long: -73.009143,
	waterC: 0,
	watered: null,
	alive: true
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
	alive: true
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
	alive: true
}

export default class HelloWorldSceneAR extends Component {
	constructor() {
		super()

		// Set initial state here
		this.state = {
			text: "Initializing AR...",
			selfLat: 0,
			selfLong: 0,
			loaded: false,
			error: null,
			plots: [samplePlot, samplePlot2, samplePlot3]
		}

		// bind 'this' to functions
		this._onInitialized = this._onInitialized.bind(this)
		this._getARCoords = this._getARCoords.bind(this)
	}

	async componentDidMount() {
		// FirebaseWrapper.GetInstance().Initialize(firebaseConfig)

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
		this._printARCoords(samplePlot)
	}

	_latLongToMerc(lat_deg, lon_deg) {
		//got this code from https://github.com/explorAR-group/ExplorAR/blob/master/js/components/PointOfInterest.js
		var lon_rad = (lon_deg / 180.0) * Math.PI
		var lat_rad = (lat_deg / 180.0) * Math.PI
		var sm_a = 6378137.0
		var xmeters = sm_a * lon_rad
		var ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
		return { x: xmeters, y: ymeters }
	}

	_getARCoords(plot) {
		const plotMerc = this._latLongToMerc(plot.lat, plot.long)
		const selfMerc = this._latLongToMerc(
			this.state.selfLat,
			this.state.selfLong
		)
		const plotARZ = plotMerc.y - selfMerc.y
		const plotARX = plotMerc.x - selfMerc.x
		return [plotARX, 0, -plotARZ]
		// return this.state.loaded ? [0, 0, -3] : [0, 0, -1]
	}

	_printARCoords(plot) {
		const plotMerc = this._latLongToMerc(plot.lat, plot.long)
		const selfMerc = this._latLongToMerc(
			this.state.selfLat,
			this.state.selfLong
		)
		const plotARZ = plotMerc.y - selfMerc.y
		const plotARX = plotMerc.x - selfMerc.x
		// return [plotARX, 0, plotARZ]
		// return this.state.loaded ? [0, 0, -3] : [0, 0, -1]
		// this.setState({ text: this.state.selfLat + "," + this.state.selfLong })
		this.setState({ text: this.state.selfLat + "," + this.state.selfLong })
		// this.setState({ text: plotMerc.y + "," + plotARZ })
	}

	render() {
		return (
			<ViroARScene onTrackingUpdated={this._onInitialized}>
				<ViroText
					text={this.state.text}
					scale={[0.5, 0.5, 0.5]}
					position={[0, 0, -1]}
					style={styles.helloWorldTextStyle}
				/>
				{this.state.plots.map(plot => (
					<ViroText
						text={plot.crop}
						scale={[0.5, 0.5, 0.5]}
						position={this._getARCoords(plot)}
						style={styles.helloWorldTextStyle}
					/>
				))}
			</ViroARScene>
		)
	}

	_onInitialized(state, reason) {
		if (state == ViroConstants.TRACKING_NORMAL) {
			// this.setState({
			// 	text: this.state.loaded ? "Done" : "Not Done"
			// })
			if (this.state.loaded) this._printARCoords(samplePlot)
			else this.setState({ text: "Not Done" })
		} else if (state == ViroConstants.TRACKING_NONE) {
			// Handle loss of tracking
		}
	}
}

var styles = StyleSheet.create({
	helloWorldTextStyle: {
		fontFamily: "Arial",
		fontSize: 30,
		color: "#ffffff",
		textAlignVertical: "center",
		textAlign: "center"
	}
})

module.exports = HelloWorldSceneAR
