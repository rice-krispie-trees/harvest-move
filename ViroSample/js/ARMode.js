"use strict"

import React, { Component } from "react"
import { connect } from "react-redux"
import { StyleSheet, Vibration } from "react-native"

import {
	ViroARScene,
	ViroConstants,
	ViroMaterials,
	ViroARSceneNavigator,
	ViroARPlaneSelector,
	ViroAmbientLight,
	ViroBox,
	ViroParticleEmitter
} from "react-viro"

import { PLOT_WIDTH, PLOT_LENGTH, PLOT_HEIGHT } from "./constants"
import {
	getAllPlots,
	makeNewPlot,
	waterPlot,
	seedPlot,
	pickPlot
} from "../store/redux/plots"

// class Plot {
// 	constructor(lat, lng) {
// 		this.lat = lat
// 		this.long = lng
// 		this.visible = false
// 	}
// }
// const plots = []
// for (let i = 40.704546; i < 40.705547; i += 0.00005) {
// 	for (let j = -74.009598; j < -74.008598; j += 0.00005) {
// 		plots.push(new Plot(i, j))
// 	}
// }

// const samplePlot = {
// 	crop: "corn",
// 	date: new Date(),
// 	ripe: false,
// 	sprouted: false,
// 	lat: 40.704787,
// 	long: -73.009143,
// 	waterC: 0,
// 	watered: null,
// 	alive: true,
// 	visible: false
// }

// const samplePlot2 = {
// 	crop: "cabbage",
// 	date: new Date(),
// 	ripe: false,
// 	sprouted: false,
// 	lat: 40.704797,
// 	long: -73.009143,
// 	waterC: 0,
// 	watered: null,
// 	alive: true,
// 	visible: false
// }

// const samplePlot3 = {
// 	crop: "potato",
// 	date: new Date(),
// 	ripe: false,
// 	sprouted: false,
// 	lat: 40.704807,
// 	long: -73.009163,
// 	waterC: 0,
// 	watered: null,
// 	alive: true,
// 	visible: false
// }

class ARMode extends Component {
	constructor(props) {
		super(props)
		this.state = {
			text: "Initializing AR...",
			loaded: false,
			error: null,
			plots: [],
			anchorsFound: [],
			water: false,
			seeds: false,
			pick: false,
			animateSeeds: false
		}
		this._onInitialized = this._onInitialized.bind(this)
		this._getARCoords = this._getARCoords.bind(this)
		this._onSelected = this._onSelected.bind(this)
		this._onAnchorFound = this._onAnchorFound.bind(this)
		this._onHover = this._onHover.bind(this)
		this._onClick = this._onClick.bind(this)
	}

	async componentDidMount() {
		await this.props.getAllPlots(this.props.coords.lat, this.props.coords.lng)
		this.setState({ loaded: true })
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

	_mercToLatLong(relative_x, relative_z) {
		const lat = relative_z / 111111.1 + this.props.coords.lat
		const lng =
			relative_x / (111111.1 * Math.cos(this.props.coords.lat)) +
			this.props.coords.lng
		return { lat, lng }
	}

	_getARCoords(plot, y) {
		const plotMerc = this._latLongToMerc(
			plot.coordinates.latitude,
			plot.coordinates.longitude
		)
		const selfMerc = this._latLongToMerc(
			this.props.coords.lat,
			this.props.coords.lng
		)
		const plotARZ = plotMerc.y - selfMerc.y
		const plotARX = plotMerc.x - selfMerc.x
		return [plotARX, y, -plotARZ]
	}

	_onHover(anchor) {
		const plot = this._plotHere(anchor)
		const that = this
		// console.log(this.state.seeds)
		return function(isHovering, position, source) {
			if (isHovering) {
				that.setState({
					water: plot.datePlanted && !plot.watered ? plot : null,
					seeds: !plot.datePlanted ? plot : null,
					pick: plot.ripe ? plot : null
				})
			} else {
				that.setState({
					water: null,
					seeds: null,
					pick: null
				})
			}
		}
	}

	async _onSelected(anchor) {
		const { lat, lng } = this._mercToLatLong(anchor.center[2], anchor.center[0])
		await this.props.makeNewPlot(lat, lng)
	}

	_plotHere(anchor) {
		const { plots } = this.props
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
			const newAnchors = [...this.state.anchorsFound]
			newAnchors.push(anchor)
			this.setState({ anchorsFound: newAnchors })
		}
	}

	_getPlotButton(plot) {
		console.log("in the plot button function")
		if (this.state.water === plot) return ["waterButton"]
		else if (this.state.seeds === plot) return ["seedButton"]
		return ["frontMaterial"]
	}

	_onClick(plot) {
		if (this.state.seeds === plot) {
			this.props.seedPlot(plot)
			Vibration.vibrate()
			Vibration.cancel()
			this.setState({ animateSeeds: true })
			// setTimeout(() => this.setState({ animateSeeds: false }), 1000)
		} else if (this.state.water === plot) {
			this.props.waterPlot(plot)
		} else if (this.state.pick === plot) {
			this.props.pickPlot(plot)
		}
	}

	render() {
		let hoeSelected = true
		return (
			<ViroARScene
				onTrackingUpdated={this._onInitialized}
				anchorDetectionTypes="PlanesHorizontal"
				onAnchorFound={this._onAnchorFound}
			>
				<ViroParticleEmitter
					position={[0, 0, -1]}
					duration={2000}
					run={this.state.animateSeeds}
					image={{
						source: require("./res/particle_firework.png"),
						height: 0.1,
						width: 0.1
					}}
				/>
				{this.props.plots.map(plot => {
					console.log("rendering:", plot)
					return (
						<ViroBox
							onClick={(position, source) => this._onClick(plot)}
							height={0.05}
							width={0.05}
							length={0.05}
							position={this._getARCoords(plot, 0)}
							materials={this._getPlotButton(plot)}
						/>
					)
				})}
				{this.state.anchorsFound.map(anchor => (
					<ViroBox
						onHover={this._onHover(anchor)}
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
							// onHover={this._onHover(anchor)}
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

	// _onClick(sceneType, position, source) {
	// 	this.setState({ sceneType: sceneType })
	// }
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
	waterButton: {
		diffuseColor: "#03c6fc"
	},
	seedButton: {
		diffuseColor: "#807955"
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

module.exports = connect(
	state => ({ plots: state.plots, coords: state.coords }),
	dispatch => ({
		getAllPlots: (lat, lng) => dispatch(getAllPlots(lat, lng)),
		makeNewPlot: (lat, lng) => dispatch(makeNewPlot(lat, lng)),
		waterPlot: plot => dispatch(waterPlot(plot)),
		seedPlot: plot => dispatch(seedPlot(plot)),
		pickPlot: plot => dispatch(pickPlot(plot))
	})
)(ARMode)
