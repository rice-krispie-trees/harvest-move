import React, { Component } from "react"
import {
	PLOT_HEIGHT,
	PLOT_LENGTH,
	PLOT_WIDTH,
	PLOT_BORDER_WIDTH
} from "./constants"
import { ViroNode, ViroMaterials, ViroSphere, ViroBox } from "react-viro"
import { Vibration } from "react-native"
import { connect } from "react-redux"
import { Seeds, Droplets } from "./"
import { waterPlot, seedPlot, pickPlot } from "../store/redux/plots"

export default connect(
	state => ({ seed: state.seed }),
	dispatch => ({
		waterPlot: plot => dispatch(waterPlot(plot)),
		seedPlot: (plot, seed) => dispatch(seedPlot(plot, seed)),
		pickPlot: plot => dispatch(pickPlot(plot))
	})
)(
	class PlotNode extends Component {
		constructor(props) {
			super(props)
			this.state = {
				waterablePlot: null,
				seedablePlot: null,
				pickablePlot: null,
				animateSeeds: null,
				animateDroplets: null,
				clickable: true
			}
			this._onClick = this._onClick.bind(this)
			this._onHover = this._onHover.bind(this)
		}

		_onClick(plot) {
			if (this.state.clickable) {
				if (this._isSeedable(plot)) {
					this.props.seedPlot(plot, this.props.seed)
					Vibration.vibrate()
					Vibration.cancel()
					this.setState({ animateSeeds: plot.id })
					setTimeout(() => this.setState({ animateSeeds: null }), 1000)
				} else if (this._isWaterable(plot)) {
					this.props.waterPlot(plot)
					Vibration.vibrate()
					Vibration.cancel()
					this.setState({ animateDroplets: plot.id })
					setTimeout(() => this.setState({ animateDroplets: null }), 1000)
				} else if (this._isPickable(plot)) {
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

		_isWaterable(plot) {
			return plot.datePlanted && !plot.ripe && !plot.watered
		}

		_isSeedable(plot) {
			return !plot.datePlanted
		}

		_isPickable(plot) {
			return plot.ripe
		}

		_isActionable(plot) {
			return (
				this._isWaterable(plot) ||
				this._isSeedable(plot) ||
				this._isPickable(plot)
			)
		}

		_onHover(plot) {
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
			if (this._isWaterable(plot)) return ["waterButton"]
			else if (this._isSeedable(plot)) return ["seedButton"]
			else if (this._isPickable(plot)) return ["pickButton"]
			return ["frontMaterial"]
		}

		_getPlotTexture(plot) {
			if (plot.datePlanted) return ["seededPlot"]
			return ["dirt"]
		}

		render() {
			return (
				<ViroNode position={this.props.position}>
					<Seeds animate={this.state.animateSeeds === this.props.plot.id} />
					<Droplets
						animate={this.state.animateDroplets === this.props.plot.id}
					/>
					<ViroBox
						onClick={() => this._onClick(this.props.plot)}
						height={PLOT_HEIGHT}
						width={PLOT_WIDTH}
						length={PLOT_LENGTH}
						materials={this._getPlotTexture(this.props.plot)}
						position={[0, 0, 0]}
					/>
					<ViroBox
						height={PLOT_HEIGHT}
						width={PLOT_WIDTH + PLOT_BORDER_WIDTH}
						length={PLOT_LENGTH + PLOT_BORDER_WIDTH}
						materials={this._getPlotButton(this.props.plot)}
						visible={this._isActionable(this.props.plot)}
						position={[0, -0.0005, 0]}
					/>
				</ViroNode>
			)
		}
	}
)

// ViroMaterials.createMaterials({
// 	dirt: {
// 		diffuseTexture: require("./res/plot_base.png")
// 	},
// 	waterButton: {
// 		diffuseColor: "#03c6fc"
// 	},
// 	seedButton: {
// 		diffuseColor: "#807955"
// 	},
// 	pickButton: {
// 		diffuseColor: "#b8c5d9"
// 	},
// 	frontMaterial: {
// 		diffuseColor: "#FFFFFF"
// 	},
// 	backMaterial: {
// 		diffuseColor: "#FFFFFF"
// 	},
// 	sideMaterial: {
// 		diffuseColor: "#FFFFFF"
// 	}
// })
