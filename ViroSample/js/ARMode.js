"use strict"

import React, { Component } from "react"
import { connect } from "react-redux"
import { HoverBox, PlotNode } from "./"

import {
	ViroARScene,
	ViroConstants,
	ViroMaterials,
	ViroARPlaneSelector,
	ViroAmbientLight,
	ViroBox
} from "react-viro"

import { PLOT_WIDTH, PLOT_LENGTH } from "./constants"
import { getAllPlots, makeNewPlot } from "../store/redux/plots"

class ARMode extends Component {
	constructor(props) {
		super(props)
		this.state = {
			text: "Initializing AR...",
			loaded: false,
			error: null,
			plots: [],
			anchorsFound: [],
			plotAnchorMap: {}
		}
		this._onInitialized = this._onInitialized.bind(this)
		this._getARCoords = this._getARCoords.bind(this)
		this._onSelected = this._onSelected.bind(this)
		this._onAnchorFound = this._onAnchorFound.bind(this)
	}

	async componentDidMount() {
		await this.props.getAllPlots(this.props.coords.lat, this.props.coords.lng)
		console.log([...this.props.plots])
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

	async _onSelected(anchor) {
		const { lat, lng } = this._mercToLatLong(anchor.center[2], anchor.center[0])
		await this.props.makeNewPlot(lat, lng)
		const map = { ...this.state.plotAnchorMap }
		// map[plot.id] = anchor
		// this.setState({ plotAnchorMap: map })
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
		const plot = this._plotHere(anchor)
		if (plot && !this.state.plotAnchorMap[plot.id]) {
			const map = { ...this.state.plotAnchorMap }
			map[plot.id] = anchor
			this.setState({ plotAnchorMap: map })
		}
	}

	_mapAnchorsFound(callback) {
		const container = []
		for (let key in this.state.plotAnchorMap) {
			container.push(callback(this.state.plotAnchorMap[key]))
		}
		return container
	}

	render() {
		let hoeSelected = true
		return (
			<ViroARScene
				onTrackingUpdated={this._onInitialized}
				anchorDetectionTypes="PlanesHorizontal"
				onAnchorFound={this._onAnchorFound}
				style={{ flex: 1 }}
			>
				{this.props.plots.map(plot => (
					<HoverBox position={this._getARCoords(plot, 0)} />
				))}
				{/* {this.state.anchorsFound.map(anchor => ( */}
				{this._mapAnchorsFound(anchor => (
					<PlotNode
						position={this._getARCoords(
							this._plotHere(anchor),
							anchor.position[1]
						)}
						plot={this._plotHere(anchor)}
					/>
				))}
				<ViroAmbientLight color="#FFFFFF" />
				{hoeSelected ? (
					<ViroARPlaneSelector
						alignment="Horizontal"
						onPlaneSelected={this._onSelected}
					>
						{/* <ViroBox
							height={0.0001}
							width={0.8}
							length={0.8}
							materials={["dirt"]}
							position={[0, 0, 0]}
						/> */}
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
