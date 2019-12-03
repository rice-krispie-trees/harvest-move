import React, { Component } from "react"
import { PLOT_HEIGHT, PLOT_LENGTH, PLOT_WIDTH } from "./constants"
import { ViroNode, ViroMaterials } from "react-viro"
import { Vibration } from "react-native"

export default class PlotNode extends Component {
	constructor(props) {
		super(props)
		this.state = {
			waterablePlot: null,
			seedablePlot: null,
			pickablePlot: null,
			animateSeeds: false,
			clickable: true
		}
	}

	_onClick(plot) {
		if (
			this.state.clickable &&
			[
				this.state.seedablePlot,
				this.state.waterablePlot,
				this.state.pickablePlot
			].includes(plot)
		) {
			if (this.state.seedablePlot === plot) {
				this.props.seedPlot(plot, this.props.seed)
				Vibration.vibrate()
				Vibration.cancel()
				this.setState({ animateSeeds: true })
				// setTimeout(() => this.setState({ animateSeeds: false }), 1000)
			} else if (this.state.waterablePlot === plot) {
				this.props.waterPlot(plot)
				Vibration.vibrate()
				Vibration.cancel()
			} else if (this.state.pickablePlot === plot) {
				this.props.pickPlot(plot)
				Vibration.vibrate()
				Vibration.cancel()
			}
			this.setState({ clickable: false })
			setTimeout(() => {
				this.setState({ clickable: true })
			}, 3000)
		}
	}

	_onHover(anchor) {
		const plot = this._plotHere(anchor)
		const that = this
		return function(isHovering) {
			if (isHovering) {
				console.log("hovering on:", plot)
				that.setState({
					waterablePlot:
						plot.datePlanted && !plot.ripe && !plot.watered ? plot : null,
					seedablePlot: !plot.datePlanted ? plot : null,
					pickablePlot: plot.ripe ? plot : null
				})
			} else {
				that.setState({
					waterablePlot: null,
					seedablePlot: null,
					pickablePlot: null
				})
			}
		}
	}

	_getPlotButton(plot) {
		if (this.state.waterablePlot === plot) return ["waterButton"]
		else if (this.state.seedablePlot === plot) return ["seedButton"]
		else if (this.state.pickablePlot === plot) return ["pickButton"]
		return ["frontMaterial"]
	}

	render() {
		return (
			<ViroNode position={this.props.position}>
				<Particles
					seedablePlot={this.state.seedablePlot}
					animate={this.state.animateSeeds}
					coords={x => this._getARCoords(x, 0)}
				/>
				<ViroSphere
					radius={MARKER_RADIUS}
					position={[0, MARKER_RADIUS, 0]}
					materials={this._getPlotButton(this.props.plot)}
				/>
				<ViroBox
					onClick={() => this._onClick(this.props.plot)}
					onHover={this._onHover(anchor)}
					height={PLOT_HEIGHT}
					width={PLOT_WIDTH}
					length={PLOT_LENGTH}
					materials={["dirt"]}
					position={[0, 0, 0]}
				/>
			</ViroNode>
		)
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
