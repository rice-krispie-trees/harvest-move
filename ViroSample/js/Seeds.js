import React from "react"
import { ViroParticleEmitter } from "react-viro"

export default function Particles(props) {
	return (
		<ViroParticleEmitter
			position={[0, 1, 0]}
			duration={2000}
			run={props.animate}
			image={{
				source: require("./res/seed.png"),
				height: 0.1,
				width: 0.1
			}}
			spawnBehavior={{
				particleLifetime: [450, 450]
			}}
			particleAppearance={{
				color: {
					initialRange: ["#8f8651", "#8f8651"]
				}
			}}
			particlePhysics={{
				velocity: {
					initialRange: [
						[-0.25, 0, -0.25],
						[0.25, 0, 0.25]
					]
				},
				acceleration: {
					initialRange: [
						[0, -9.81, 0],
						[0, -9.81, 0]
					]
				}
			}}
		/>
	)
}
