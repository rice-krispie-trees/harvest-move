import React from "react"
import { ViroParticleEmitter } from "react-viro"

export default function Particles(props) {
	return (
		<ViroParticleEmitter
			// position={[props.seeds ? props.coords(props.seeds) : [0, 0, -1]]}
			position={[0, 0, 0]}
			duration={2000}
			run={props.animate}
			image={{
				source: require("./res/particle_firework.png"),
				height: 0.1,
				width: 0.1
			}}
		/>
	)
}
