"use strict"

import React, { Component } from "react"
import { connect } from "react-redux"
import { Vibration } from "react-native"
import { HoverBox, PlotNode } from "./"

import {
	ViroARScene,
	ViroConstants,
	ViroMaterials,
	ViroARPlaneSelector,
	ViroAmbientLight,
	ViroBox,
	ViroParticleEmitter,
	ViroSphere
} from "react-viro"

import {
	PLOT_WIDTH,
	PLOT_LENGTH,
	PLOT_HEIGHT,
	MARKER_RADIUS
} from "./constants"
import {
	getAllPlots,
	makeNewPlot,
	waterPlot,
	seedPlot,
	pickPlot
} from "../store/redux/plots"

class ARMode extends Component {
	constructor(props) {
		super(props)
		this.state = {
			text: "Initializing AR...",
			loaded: false,
			error: null,
			plots: [],
			anchorsFound: []
			// waterablePlot: null,
			// seedablePlot: null,
			// pickablePlot: null,
			// animateSeeds: false,
			// clickable: true
		}
		this._onInitialized = this._onInitialized.bind(this)
		this._getARCoords = this._getARCoords.bind(this)
		this._onSelected = this._onSelected.bind(this)
		this._onAnchorFound = this._onAnchorFound.bind(this)
		// this._onHover = this._onHover.bind(this)
		// this._onClick = this._onClick.bind(this)
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

	// _onHover(anchor) {
	// 	const plot = this._plotHere(anchor)
	// 	const that = this
	// 	return function(isHovering) {
	// 		if (isHovering) {
	// 			console.log("hovering on:", plot)
	// 			that.setState({
	// 				waterablePlot:
	// 					plot.datePlanted && !plot.ripe && !plot.watered ? plot : null,
	// 				seedablePlot: !plot.datePlanted ? plot : null,
	// 				pickablePlot: plot.ripe ? plot : null
	// 			})
	// 		} else {
	// 			that.setState({
	// 				waterablePlot: null,
	// 				seedablePlot: null,
	// 				pickablePlot: null
	// 			})
	// 		}
	// 	}
	// }

	async _onSelected(anchor) {
		const { lat, lng } = this._mercToLatLong(anchor.center[2], anchor.center[0])
		await this.props.makeNewPlot(lat, lng)
	}

	_plotHere(anchor) {
		const { plots } = this.props
		for (let i = 0; i < plots.length; i++) {
			const [x, _, z] = this._getARCoords(plots[i])
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

	// _getPlotButton(plot) {
	// 	if (this.state.waterablePlot === plot) return ["waterButton"]
	// 	else if (this.state.seedablePlot === plot) return ["seedButton"]
	// 	else if (this.state.pickablePlot === plot) return ["pickButton"]
	// 	return ["frontMaterial"]
	// }

	// _onClick(plot) {
	// 	if (
	// 		this.state.clickable &&
	// 		[
	// 			this.state.seedablePlot,
	// 			this.state.waterablePlot,
	// 			this.state.pickablePlot
	// 		].includes(plot)
	// 	) {
	// 		if (this.state.seedablePlot === plot) {
	// 			this.props.seedPlot(plot, this.props.seed)
	// 			Vibration.vibrate()
	// 			Vibration.cancel()
	// 			this.setState({ animateSeeds: true })
	// 			// setTimeout(() => this.setState({ animateSeeds: false }), 1000)
	// 		} else if (this.state.waterablePlot === plot) {
	// 			this.props.waterPlot(plot)
	// 			Vibration.vibrate()
	// 			Vibration.cancel()
	// 		} else if (this.state.pickablePlot === plot) {
	// 			this.props.pickPlot(plot)
	// 			Vibration.vibrate()
	// 			Vibration.cancel()
	// 		}
	// 		this.setState({ clickable: false })
	// 		setTimeout(() => {
	// 			this.setState({ clickable: true })
	// 		}, 3000)
	// 	}
	// }

	render() {
		let hoeSelected = true
		return (
			<ViroARScene
				onTrackingUpdated={this._onInitialized}
				anchorDetectionTypes="PlanesHorizontal"
				onAnchorFound={this._onAnchorFound}
				style={{ flex: 1 }}
			>
				{/* <Particles
					seedablePlot={this.state.seedablePlot}
					animate={this.state.animateSeeds}
					coords={x => this._getARCoords(x, 0)}
				/> */}
				{this.props.plots.map(plot => (
					<HoverBox position={this._getARCoords(plot, 0)} />
				))}
				{this.state.anchorsFound.map(anchor => (
					<PlotNode
						position={this._getARCoords(
							this._plotHere(anchor),
							anchor.position[1]
						)}
						plot={this._plotHere(anchor)}
					/>
					// <ViroBox
					// 	onClick={() => this._onClick(this._plotHere(anchor))}
					// 	onHover={this._onHover(anchor)}
					// 	height={PLOT_HEIGHT}
					// 	width={PLOT_WIDTH}
					// 	length={PLOT_LENGTH}
					// 	materials={["dirt"]}

					// 	)}
					// />
				))}
				{/* {this.state.anchorsFound.map(anchor => (
					<ViroSphere
						radius={MARKER_RADIUS}
						position={this._getARCoords(
							this._plotHere(anchor),
							anchor.position[1] + MARKER_RADIUS
						)}
						materials={this._getPlotButton(this._plotHere(anchor))}
					/>
				))} */}
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
}

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
	pickButton: {
		diffuseColor: "#b8c5d9"
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
	state => ({ plots: state.plots, coords: state.coords, seed: state.seed }),
	dispatch => ({
		getAllPlots: (lat, lng) => dispatch(getAllPlots(lat, lng)),
		makeNewPlot: (lat, lng) => dispatch(makeNewPlot(lat, lng))
		// waterPlot: plot => dispatch(waterPlot(plot)),
		// seedPlot: (plot, seed) => dispatch(seedPlot(plot, seed)),
		// pickPlot: plot => dispatch(pickPlot(plot))
	})
)(ARMode)
